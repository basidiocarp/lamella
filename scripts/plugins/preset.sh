#!/usr/bin/env bash
#
# preset.sh - Manage lamella workflow presets
#
# Usage:
#   preset.sh list                  List available presets
#   preset.sh show <name>           Show preset details
#   preset.sh install <name>        Install plugins with preset configuration
#
# Presets are TOML files in resources/presets/ that bundle model choices,
# tool preferences, skill activations, and agent defaults into named
# configurations users can install.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

# shellcheck source=../lib/content-root.sh
source "$BASE_DIR/scripts/lib/content-root.sh"

PRESETS_DIR="$CONTENT_ROOT/presets"
INSTALL_SCRIPT="$BASE_DIR/install.sh"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

usage() {
    cat <<EOF
${BOLD}lamella preset${NC} - Manage workflow presets

${BOLD}USAGE${NC}
    lamella preset list              List available presets
    lamella preset show <name>       Show full preset details
    lamella preset install <name>    Install with preset configuration

${BOLD}EXAMPLES${NC}
    lamella preset list
    lamella preset show explore-codebase
    lamella preset install tdd-cycle
EOF
    exit 0
}

# ---------------------------------------------------------------------------
# TOML helpers (minimal parser for preset files)
# ---------------------------------------------------------------------------

# Read a simple string value from a TOML key in a section.
# Usage: toml_get <file> <section> <key>
toml_get() {
    local file="$1" section="$2" key="$3"
    awk -v section="$section" -v key="$key" '
        /^\[/ { in_section = ($0 == "[" section "]") }
        in_section && $0 ~ "^" key " *= *" {
            val = $0
            sub(/^[^=]*= */, "", val)
            gsub(/^"|"$/, "", val)
            print val
            exit
        }
    ' "$file"
}

# Read an array value from a TOML key (supports both inline and multi-line).
# Usage: toml_get_array <file> <section> <key>
toml_get_array() {
    local file="$1" section="$2" key="$3"
    awk -v section="$section" -v key="$key" '
        BEGIN { in_section = 0; in_array = 0 }
        /^[ \t]*\[/ && !/^\[\[/ {
            if (in_array) { in_array = 0 }
            gsub(/^[ \t]+|[ \t]+$/, "")
            in_section = ($0 == "[" section "]")
            next
        }
        in_array {
            line = $0
            sub(/#.*$/, "", line)
            gsub(/^[ \t]+|[ \t]+$/, "", line)
            if (line ~ /^\]/) { in_array = 0; next }
            n = split(line, items, ",")
            for (i = 1; i <= n; i++) {
                gsub(/^[ \t]*"?|"?[ \t]*$/, "", items[i])
                if (items[i] != "" && items[i] != "]") print items[i]
            }
            next
        }
        in_section {
            line = $0
            sub(/#.*$/, "", line)
            # Match key = [...]  or  key = [
            if (line ~ "^" key "[ \t]*=") {
                sub(/^[^=]*=[ \t]*/, "", line)
                gsub(/^[ \t]+|[ \t]+$/, "", line)
                if (line ~ /^\[.*\]$/) {
                    # Inline array on one line
                    sub(/^\[/, "", line)
                    sub(/\]$/, "", line)
                    n = split(line, items, ",")
                    for (i = 1; i <= n; i++) {
                        gsub(/^[ \t]*"?|"?[ \t]*$/, "", items[i])
                        if (items[i] != "") print items[i]
                    }
                } else if (line ~ /^\[/) {
                    # Multi-line array starting with [
                    in_array = 1
                    sub(/^\[/, "", line)
                    gsub(/^[ \t]+|[ \t]+$/, "", line)
                    if (line != "") {
                        n = split(line, items, ",")
                        for (i = 1; i <= n; i++) {
                            gsub(/^[ \t]*"?|"?[ \t]*$/, "", items[i])
                            if (items[i] != "") print items[i]
                        }
                    }
                }
            }
        }
    ' "$file"
}

# Read all inline-table entries from a section.
# Usage: toml_get_agents <file> <section>
toml_get_agents() {
    local file="$1" section="$2"
    awk -v section="$section" '
        /^\[/ && !/^\[\[/ {
            gsub(/^[ \t]+|[ \t]+$/, "")
            in_section = ($0 == "[" section "]")
            next
        }
        in_section && /=.*\{/ {
            name = $0
            sub(/ *=.*/, "", name)
            gsub(/^[ \t]+|[ \t]+$/, "", name)
            val = $0
            sub(/^[^{]*\{/, "", val)
            sub(/\}.*$/, "", val)
            printf "%s: %s\n", name, val
        }
    ' "$file"
}

# Read all key = value pairs from a section (non-table values only).
# Usage: toml_get_section_kv <file> <section>
toml_get_section_kv() {
    local file="$1" section="$2"
    awk -v section="$section" '
        /^\[/ && !/^\[\[/ {
            gsub(/^[ \t]+|[ \t]+$/, "")
            in_section = ($0 == "[" section "]")
            next
        }
        in_section && /^[a-zA-Z_]+ *= *[^{\[]/ {
            key = $0; val = $0
            sub(/ *=.*/, "", key)
            sub(/^[^=]*= */, "", val)
            gsub(/^"|"$/, "", val)
            printf "%s = %s\n", key, val
        }
    ' "$file"
}

# ---------------------------------------------------------------------------
# Tool detection (reuses logic from install-plugin.sh)
# ---------------------------------------------------------------------------

detect_available_tools() {
    local tools=()

    if command -v spore >/dev/null 2>&1; then
        local discovered
        discovered=$(spore discover --json 2>/dev/null \
            | jq -r '
                (
                  if type == "array" then .
                  elif (.tools? | type) == "array" then .tools
                  else []
                  end
                )[]
                | if type == "string" then .
                  elif (.name? | type) == "string" then .name
                  elif (.tool? | type) == "string" then .tool
                  elif (.id? | type) == "string" then .id
                  else empty
                  end
              ' 2>/dev/null || true)
        if [[ -n "$discovered" ]]; then
            while IFS= read -r tool; do
                [[ -z "$tool" ]] && continue
                case "$tool" in
                    mycelium|hyphae|rhizome|cortina|canopy|spore|stipe)
                        tools+=("$tool")
                        ;;
                esac
            done <<< "$discovered"
        fi
    fi

    local candidate
    for candidate in mycelium hyphae rhizome cortina canopy spore stipe; do
        if command -v "$candidate" >/dev/null 2>&1; then
            tools+=("$candidate")
        fi
    done

    if [[ ${#tools[@]} -eq 0 ]]; then
        echo ""
        return 0
    fi

    printf '%s\n' "${tools[@]}" | awk '!seen[$0]++'
}

# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

cmd_list() {
    if [[ ! -d "$PRESETS_DIR" ]]; then
        log_error "Presets directory not found: $PRESETS_DIR"
        exit 1
    fi

    local count=0
    echo ""
    printf "${BOLD}%-22s %-50s %s${NC}\n" "PRESET" "DESCRIPTION" "REQUIRES"
    echo "──────────────────────────────────────────────────────────────────────────────────────"

    for preset_file in "$PRESETS_DIR"/*.toml; do
        [[ ! -f "$preset_file" ]] && continue
        local name desc requires_str
        name=$(toml_get "$preset_file" "preset" "name")
        desc=$(toml_get "$preset_file" "preset" "description")
        requires_str=$(toml_get_array "$preset_file" "preset" "requires" | paste -sd ',' - 2>/dev/null || echo "")

        if [[ -z "$requires_str" ]]; then
            requires_str="(none)"
        fi

        printf "  %-20s %-50s %s\n" "$name" "$desc" "$requires_str"
        count=$((count + 1))
    done

    echo ""
    echo "$count preset(s) available"
    echo ""
}

cmd_show() {
    local name="${1:-}"
    if [[ -z "$name" ]]; then
        log_error "Missing preset name. Usage: lamella preset show <name>"
        exit 1
    fi

    local preset_file="$PRESETS_DIR/${name}.toml"
    if [[ ! -f "$preset_file" ]]; then
        log_error "Preset not found: $name"
        log_info "Run 'lamella preset list' to see available presets"
        exit 1
    fi

    local desc requires_csv
    desc=$(toml_get "$preset_file" "preset" "description")
    requires_csv=$(toml_get_array "$preset_file" "preset" "requires" | paste -sd ',' - 2>/dev/null | sed 's/,/, /g' || echo "none")
    [[ -z "$requires_csv" ]] && requires_csv="none"

    echo ""
    echo -e "${BOLD}Preset: ${CYAN}${name}${NC}"
    echo -e "${BOLD}Description:${NC} $desc"
    echo -e "${BOLD}Requires:${NC} $requires_csv"
    echo ""

    # Models
    local models
    models=$(toml_get_section_kv "$preset_file" "models")
    if [[ -n "$models" ]]; then
        echo -e "${BOLD}Models:${NC}"
        while IFS= read -r line; do
            echo "  $line"
        done <<< "$models"
        echo ""
    fi

    # Tool preferences
    local tool_prefs
    tool_prefs=$(toml_get_section_kv "$preset_file" "tools")
    if [[ -n "$tool_prefs" ]]; then
        echo -e "${BOLD}Tool Preferences:${NC}"
        while IFS= read -r line; do
            echo "  $line"
        done <<< "$tool_prefs"
        echo ""
    fi

    # Skills
    local skills
    skills=$(toml_get_array "$preset_file" "skills" "activate")
    if [[ -n "$skills" ]]; then
        echo -e "${BOLD}Skills:${NC}"
        while IFS= read -r skill; do
            echo "  - $skill"
        done <<< "$skills"
        echo ""
    fi

    # Agents
    local agents
    agents=$(toml_get_agents "$preset_file" "agents")
    if [[ -n "$agents" ]]; then
        echo -e "${BOLD}Agents:${NC}"
        while IFS= read -r agent; do
            echo "  $agent"
        done <<< "$agents"
        echo ""
    fi
}

cmd_install() {
    local name="${1:-}"
    if [[ -z "$name" ]]; then
        log_error "Missing preset name. Usage: lamella preset install <name>"
        exit 1
    fi

    local preset_file="$PRESETS_DIR/${name}.toml"
    if [[ ! -f "$preset_file" ]]; then
        log_error "Preset not found: $name"
        log_info "Run 'lamella preset list' to see available presets"
        exit 1
    fi

    log_info "Loading preset: $name"

    # Check requires
    local required_tools missing_tools=()
    required_tools=$(toml_get_array "$preset_file" "preset" "requires")

    if [[ -n "$required_tools" ]]; then
        local detected
        detected=$(detect_available_tools)

        while IFS= read -r required; do
            [[ -z "$required" ]] && continue
            if ! echo "$detected" | grep -qx "$required"; then
                missing_tools+=("$required")
            fi
        done <<< "$required_tools"

        if [[ ${#missing_tools[@]} -gt 0 ]]; then
            echo ""
            log_error "Preset '$name' requires tools that are not installed:"
            for tool in "${missing_tools[@]}"; do
                echo -e "  ${RED}missing:${NC} $tool"
            done
            echo ""
            log_info "Install missing tools with: stipe install ${missing_tools[*]}"
            log_info "Or use a preset with fewer requirements: lamella preset list"
            exit 1
        fi

        log_success "All required tools detected"
    fi

    # Apply the preset by installing all plugins (the preset config is advisory)
    log_info "Installing plugins with preset configuration..."
    bash "$INSTALL_SCRIPT" --all

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_success "Preset '$name' applied"
    echo ""

    # Show what was configured
    local skills
    skills=$(toml_get_array "$preset_file" "skills" "activate")
    if [[ -n "$skills" ]]; then
        echo -e "${BOLD}Activated skills:${NC}"
        while IFS= read -r skill; do
            echo "  - $skill"
        done <<< "$skills"
        echo ""
    fi

    local models
    models=$(toml_get_section_kv "$preset_file" "models")
    if [[ -n "$models" ]]; then
        echo -e "${BOLD}Model assignments:${NC}"
        while IFS= read -r line; do
            echo "  $line"
        done <<< "$models"
        echo ""
    fi

    echo -e "${DIM}Preset configuration is advisory. The activated skills and model"
    echo -e "assignments guide agent behavior when referenced in session.${NC}"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

main() {
    case "${1:-}" in
        ""|-h|--help|help)
            usage
            ;;
        list)
            cmd_list
            ;;
        show)
            shift
            cmd_show "$@"
            ;;
        install)
            shift
            cmd_install "$@"
            ;;
        *)
            log_error "Unknown preset command: $1"
            usage
            ;;
    esac
}

main "$@"
