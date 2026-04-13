#!/usr/bin/env bash
#
# install-plugin.sh - Install built Lamella plugins
#
# Supports two install modes:
#   1. Plugin mode (default): Registers plugins with Claude Code via --plugin-dir
#      or copies to ~/.claude/plugins/ for persistent access
#   2. Standalone mode: Copies non-plugin resources (rules, workflows, templates)
#      directly to ~/.claude/
#
# Usage:
#   ./install-plugin.sh [options] [plugin-names...]
#
# Options:
#   --list, -l        List available plugins
#   --all, -a         Install all plugins
#   --uninstall, -u   Uninstall specified plugins
#   --dry-run, -n     Show what would be done
#   --force, -f       Overwrite existing files
#   --help, -h        Show this help
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
DIST_DIR="$BASE_DIR/dist/claude/plugins"
MANIFESTS_DIR="$BASE_DIR/manifests/claude"
CLAUDE_DIR="${CLAUDE_HOME:-$HOME/.claude}"
PLUGINS_DIR="$CLAUDE_DIR/plugins/lamella"
FILTER_PLUGIN_SCRIPT="$BASE_DIR/scripts/plugins/filter-plugin-install.js"
LAMELLA_CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/lamella"
DETECTED_TOOLS_CACHE="$LAMELLA_CONFIG_DIR/detected-tools.json"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

DRY_RUN=false
FORCE=false
UNINSTALL=false
LIST_ONLY=false
INSTALL_ALL=false
IGNORE_REQUIRES=false
PRINT_ORDER=false
REFRESH=false
PLUGINS=()
DETECTED_TOOLS_JSON='[]'
DETECTED_TOOLS_CSV=''

usage() {
    cat <<EOF
${BOLD}install-plugin.sh${NC} - Install Lamella plugins

${BOLD}USAGE${NC}
    $0 [options] [plugin-names...]

${BOLD}OPTIONS${NC}
    -l, --list        List available plugins
    -a, --all         Install all available plugins
    -u, --uninstall   Uninstall specified plugins
    -n, --dry-run     Show what would be done
    -f, --force       Overwrite existing files
    --refresh         Re-detect tools and re-evaluate installed plugins
    --ignore-requires Install selected plugins without filtering by requires
    --print-order     Print the dependency-resolved install order
    -h, --help        Show this help

${BOLD}EXAMPLES${NC}
    $0 core python typescript     Install specific plugins
    $0 --all                      Install all plugins
    $0 --uninstall security       Remove security plugin

${BOLD}INSTALL LOCATIONS${NC}
    Plugin resources → $PLUGINS_DIR/<name>/
      (agents, commands, skills, hooks — official Claude Code plugin dirs)
    Standalone resources → $CLAUDE_DIR/
      (rules, workflows, templates — copied directly)

${BOLD}NOTES${NC}
    Dependency order is resolved from manifests/claude/*.json.
    Run 'builders/build-claude-marketplace.sh' first to build all plugins.
    After install, add to settings.json or use: claude --plugin-dir <path>

EOF
    exit 0
}

get_installed_plugins() {
    [[ ! -d "$PLUGINS_DIR" ]] && return
    for dir in "$PLUGINS_DIR"/*; do
        [[ ! -d "$dir" ]] && continue
        basename "$dir"
    done | sort
}

write_detected_tools_cache() {
    local tools_json="$1"
    mkdir -p "$LAMELLA_CONFIG_DIR"
    jq -n \
        --arg detected_at "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
        --argjson tools "$tools_json" \
        '{detected_at: $detected_at, tools: $tools}' > "$DETECTED_TOOLS_CACHE"
}

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
        echo '[]'
        return 0
    fi

    printf '%s\n' "${tools[@]}" | awk '!seen[$0]++' | jq -R . | jq -s .
}

remove_plugin_standalone_targets() {
    local plugin="$1"
    local src="$DIST_DIR/$plugin"

    for resource_type in rules workflows templates; do
        local standalone_dir="$src/_standalone/$resource_type"
        local claude_dst="$CLAUDE_DIR/$resource_type"
        [[ ! -d "$standalone_dir" ]] && continue

        for item in "$standalone_dir"/*; do
            [[ ! -e "$item" ]] && continue
            local target="$claude_dst/$(basename "$item")"
            [[ ! -e "$target" ]] && continue
            rm -rf "$target"
        done
    done
}

hook_command_stream() {
    local json_path="$1"

    [[ -f "$json_path" ]] || return 0

    jq -r '
        (.hooks // .) as $root
        | if ($root | type) == "object" then
            $root
            | to_entries[]?.value[]?.hooks[]?.command? // empty
          elif ($root | type) == "array" then
            $root[]?.hooks[]?.command? // empty
          else
            empty
          end
    ' "$json_path" 2>/dev/null || true
}

extract_hook_refs() {
    local command="$1"

    grep -oE '\$\{CLAUDE_PLUGIN_ROOT\}/[^"'"'"'[:space:]]+|\$HOME/\.claude/[^"'"'"'[:space:]]+|~/.claude/[^"'"'"'[:space:]]+|/[^"'"'"'[:space:]]+\.(js|sh|py)' <<< "$command" | sort -u || true
}

resolve_hook_ref() {
    local ref="$1"
    local plugin_dir="$2"

    case "$ref" in
        '${CLAUDE_PLUGIN_ROOT}/'*)
            printf '%s\n' "$plugin_dir/${ref#\$\{CLAUDE_PLUGIN_ROOT\}/}"
            ;;
        '$HOME/'*)
            printf '%s\n' "$HOME/${ref#\$HOME/}"
            ;;
        '~/'*)
            printf '%s\n' "$HOME/${ref#~/}"
            ;;
        *)
            printf '%s\n' "$ref"
            ;;
    esac
}

ref_targets_plugin() {
    local ref="$1"
    local resolved="$2"
    local plugin_dir="$3"

    [[ "$ref" == '${CLAUDE_PLUGIN_ROOT}/'* ]] && return 0
    [[ "$resolved" == "$plugin_dir/"* ]] && return 0
    return 1
}

validate_packaged_hook_paths() {
    local plugin_dir="$1"
    local hooks_json="$plugin_dir/hooks/hooks.json"

    [[ -f "$hooks_json" ]] || return 0

    local command refs ref resolved
    while IFS= read -r command; do
        [[ -z "$command" ]] && continue

        refs=$(extract_hook_refs "$command")
        while IFS= read -r ref; do
            [[ -z "$ref" ]] && continue
            resolved=$(resolve_hook_ref "$ref" "$plugin_dir")

            if [[ ! -e "$resolved" ]]; then
                echo "WARNING: Bundled hook path not found after install: $resolved"
                echo "  Run \`lamella install\` again or check your installation."
            fi
        done <<< "$refs"
    done < <(hook_command_stream "$hooks_json")
}

settings_hook_paths() {
    printf '%s\n' "$CLAUDE_DIR/settings.json"

    local project_settings="$PWD/.claude/settings.json"
    if [[ -f "$project_settings" ]]; then
        printf '%s\n' "$project_settings"
    fi
}

validate_registered_hook_paths() {
    local plugin="$1"
    local plugin_dir="$2"
    local settings_path command refs ref resolved

    while IFS= read -r settings_path; do
        [[ -f "$settings_path" ]] || continue

        while IFS= read -r command; do
            [[ -z "$command" ]] && continue

            refs=$(extract_hook_refs "$command")
            while IFS= read -r ref; do
                [[ -z "$ref" ]] && continue
                resolved=$(resolve_hook_ref "$ref" "$plugin_dir")

                if ! ref_targets_plugin "$ref" "$resolved" "$plugin_dir"; then
                    continue
                fi

                if [[ ! -e "$resolved" ]]; then
                    echo "WARNING: Registered hook path for plugin '$plugin' not found in $settings_path: $resolved"
                    echo "  Remove the stale hook entry or reinstall the plugin before relying on it."
                fi
            done <<< "$refs"
        done < <(hook_command_stream "$settings_path")
    done < <(settings_hook_paths)
}

get_available_plugins() {
    [[ ! -d "$MANIFESTS_DIR" ]] && return
    for f in "$MANIFESTS_DIR"/*.json; do
        [[ ! -f "$f" ]] && continue
        local name
        name=$(basename "$f" .json)
        [[ "$name" == "schema" || "$name" == "index" ]] && continue
        echo "$name"
    done | sort
}

manifest_path() {
    local plugin="$1"
    echo "$MANIFESTS_DIR/$plugin.json"
}

manifest_dependencies() {
    local plugin="$1"
    local manifest
    manifest=$(manifest_path "$plugin")
    [[ -f "$manifest" ]] || return 1
    jq -r '.dependencies[]? // empty' "$manifest"
}

resolve_plugin_order() {
    local roots=("$@")
    local ordered=()
    local resolved=""
    local visiting=""

    visit_plugin() {
        local plugin="$1"

        if list_contains "$resolved" "$plugin"; then
            return 0
        fi

        if list_contains "$visiting" "$plugin"; then
            log_error "Cyclic dependency detected while resolving $plugin"
            return 1
        fi

        local manifest
        manifest=$(manifest_path "$plugin")
        if [[ ! -f "$manifest" ]]; then
            log_error "Manifest not found: $plugin ($manifest)"
            return 1
        fi

        visiting=$(append_list_item "$visiting" "$plugin")

        local dep
        while IFS= read -r dep; do
            [[ -z "$dep" ]] && continue
            visit_plugin "$dep" || return 1
        done < <(manifest_dependencies "$plugin")

        visiting=$(pop_list_item "$visiting")
        resolved=$(append_list_item "$resolved" "$plugin")
        ordered+=("$plugin")
    }

    local root
    for root in "${roots[@]}"; do
        [[ -z "$root" ]] && continue
        visit_plugin "$root" || return 1
    done

    printf '%s\n' "${ordered[@]}"
}

reverse_plugins() {
    local input=("$@")
    local reversed=()
    local i
    for ((i=${#input[@]}-1; i>=0; i--)); do
        reversed+=("${input[$i]}")
    done
    printf '%s\n' "${reversed[@]}"
}

list_contains() {
    local list="$1"
    local needle="$2"

    case $'\n'"$list"$'\n' in
        *$'\n'"$needle"$'\n'*) return 0 ;;
    esac

    return 1
}

append_list_item() {
    local list="$1"
    local item="$2"

    if [[ -z "$list" ]]; then
        printf '%s' "$item"
    else
        printf '%s\n%s' "$list" "$item"
    fi
}

pop_list_item() {
    local list="$1"

    if [[ -z "$list" ]]; then
        printf ''
        return 0
    fi

    printf '%s\n' "$list" | sed '$d'
}

describe_plugin_order() {
    local label="$1"
    shift

    echo -e "${BOLD}${label}${NC}"
    local index=1
    local plugin deps
    for plugin in "$@"; do
        deps=$(manifest_dependencies "$plugin" | paste -sd ', ' -)
        if [[ -n "$deps" ]]; then
            printf "  %2d. %s (deps: %s)\n" "$index" "$plugin" "$deps"
        else
            printf "  %2d. %s\n" "$index" "$plugin"
        fi
        index=$((index + 1))
    done
}

list_plugins() {
    echo -e "${BOLD}Available Plugins${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    local plugins
    plugins=$(get_available_plugins)
    [[ -z "$plugins" ]] && { log_warn "No plugins found."; exit 1; }

    printf "${BOLD}%-18s %-8s %6s %6s %6s  %-20s %-35s${NC}\n" "PLUGIN" "VERSION" "SKILL" "AGENT" "CMD" "DEPS" "DESCRIPTION"
    echo "──────────────────────────────────────────────────────────────────────────────"

    local total_plugins=0

    while IFS= read -r plugin; do
        local pjson="$MANIFESTS_DIR/$plugin.json"
        if [[ -f "$pjson" ]]; then
            local name version desc
            name=$(jq -r '.name' "$pjson")
            version=$(jq -r '.version // "?"' "$pjson")
            desc=$(jq -r '.description // ""' "$pjson" | head -c 35)
            local deps
            deps=$(jq -r '[.dependencies // [] | .[]] | join(",")' "$pjson")

            local skill_count agent_count cmd_count
            skill_count=$(jq -r '.resources.skills // [] | length' "$pjson")
            agent_count=$(jq -r '.resources.agents // [] | length' "$pjson")
            cmd_count=$(jq -r '.resources.commands // [] | length' "$pjson")

            local status=""
            [[ -d "$DIST_DIR/$plugin" ]] && status="${BLUE}built${NC}"
            if [[ -d "$PLUGINS_DIR/$plugin" ]]; then
                if [[ -n "$status" ]]; then
                    status="${status} / ${GREEN}installed${NC}"
                else
                    status="${GREEN}installed${NC}"
                fi
            fi

            printf "%-18s %-8s %6s %6s %6s  %-20s %-35s %b\n" "$name" "$version" "$skill_count" "$agent_count" "$cmd_count" "${deps:0:20}" "${desc:0:35}" "$status"
            ((total_plugins++))
        fi
    done <<< "$plugins"

    echo "──────────────────────────────────────────────────────────────────────────────"
    echo -e "${BOLD}Total:${NC} $total_plugins plugins"
    echo -e "${BLUE}built${NC} = built"
    echo -e "${GREEN}installed${NC} = installed"
}

# Install a plugin as an official Claude Code plugin directory
install_plugin() {
    local plugin="$1"
    local src="$DIST_DIR/$plugin"

    if [[ ! -d "$src" ]]; then
        log_error "Plugin not found: $plugin"
        return 1
    fi

    if [[ ! -f "$src/.claude-plugin/plugin.json" ]]; then
        log_error "Not a valid Claude Code plugin: $plugin (missing .claude-plugin/plugin.json)"
        return 1
    fi

    log_info "Installing ${BOLD}$plugin${NC}..."

    local installed=0
    local filtered_src="$src"
    local filter_summary='{"copied":0,"skipped":[]}'

    if ! $DRY_RUN; then
        local temp_dir
        temp_dir=$(mktemp -d)
        filter_summary=$(LAMELLA_DETECTED_TOOLS="$DETECTED_TOOLS_CSV" \
            LAMELLA_IGNORE_REQUIRES="$([[ "$IGNORE_REQUIRES" == true ]] && echo 1 || echo 0)" \
            node "$FILTER_PLUGIN_SCRIPT" "$src" "$temp_dir/plugin")
        filtered_src="$temp_dir/plugin"
    fi

    # 1. Install plugin directory (agents, commands, skills, hooks)
    local dst="$PLUGINS_DIR/$plugin"

    if $DRY_RUN; then
        echo "  [dry-run] Would install plugin to: $dst"
    else
        if [[ -d "$dst" ]] && ! $FORCE && ! $REFRESH; then
            log_warn "Already installed: $plugin (use --force to overwrite)"
            return 0
        fi

        mkdir -p "$PLUGINS_DIR"
        rm -rf "$dst"
        mkdir -p "$dst"

        # Copy official plugin structure
        cp -r "$filtered_src/.claude-plugin" "$dst/"
        [[ -d "$filtered_src/agents" ]] && cp -r "$filtered_src/agents" "$dst/"
        [[ -d "$filtered_src/commands" ]] && cp -r "$filtered_src/commands" "$dst/"
        [[ -d "$filtered_src/skills" ]] && cp -r "$filtered_src/skills" "$dst/"
        [[ -d "$filtered_src/hooks" ]] && cp -r "$filtered_src/hooks" "$dst/"
        [[ -d "$filtered_src/scripts" ]] && cp -r "$filtered_src/scripts" "$dst/"

        log_success "Plugin installed: $dst"
        validate_packaged_hook_paths "$dst"
        validate_registered_hook_paths "$plugin" "$dst"
        ((installed++))
    fi

    # 2. Install standalone resources (rules, workflows, templates)
    if [[ -d "$filtered_src/_standalone" ]]; then
        if ! $DRY_RUN && { $FORCE || $REFRESH; }; then
            remove_plugin_standalone_targets "$plugin"
        fi

        for resource_type in rules workflows templates; do
            local standalone_dir="$filtered_src/_standalone/$resource_type"
            [[ ! -d "$standalone_dir" ]] && continue
            [[ -z "$(ls -A "$standalone_dir" 2>/dev/null)" ]] && continue

            local claude_dst="$CLAUDE_DIR/$resource_type"

            for item in "$standalone_dir"/*; do
                [[ ! -e "$item" ]] && continue
                local name
                name=$(basename "$item")
                local target="$claude_dst/$name"

                if $DRY_RUN; then
                    echo "  [dry-run] Would copy $resource_type/$name to $target"
                else
                    if [[ -e "$target" ]] && ! $FORCE && ! $REFRESH; then
                        log_warn "Exists: $resource_type/$name (use --force)"
                        continue
                    fi
                    mkdir -p "$claude_dst"
                    cp -r "$item" "$target"
                    ((installed++))
                fi
            done

            if ! $DRY_RUN && [[ -d "$standalone_dir" ]]; then
                local count
                count=$(find "$standalone_dir" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ')
                [[ "$count" -gt 0 ]] && log_success "  Standalone $resource_type: $count items → $claude_dst"
            fi
        done
    fi

    if ! $DRY_RUN; then
        local skipped_count
        skipped_count=$(jq '.skipped | length' <<< "$filter_summary")
        if [[ "$skipped_count" -gt 0 ]]; then
            while IFS= read -r skipped; do
                [[ -z "$skipped" ]] && continue
                log_warn "Skipped $skipped"
            done < <(jq -r '.skipped[] | "\(.kind): \(.path) (requires: \(.requires))"' <<< "$filter_summary")
        fi

        if [[ "$filtered_src" != "$src" ]]; then
            rm -rf "${filtered_src%/plugin}"
        fi
    fi

    return 0
}

# Uninstall a plugin
uninstall_plugin() {
    local plugin="$1"

    log_info "Uninstalling ${BOLD}$plugin${NC}..."

    local removed=0

    # Remove plugin directory
    local dst="$PLUGINS_DIR/$plugin"
    if [[ -d "$dst" ]]; then
        if $DRY_RUN; then
            echo "  [dry-run] Would remove: $dst"
        else
            rm -rf "$dst"
            log_success "Removed plugin: $dst"
            ((removed++))
        fi
    else
        log_warn "Plugin not installed: $plugin"
    fi

    # Note: standalone resources (rules) are NOT removed during uninstall
    # because they may be shared with other plugins or manually modified

    return 0
}

main() {
    parse_args "$@"

    if $LIST_ONLY; then
        list_plugins
        exit 0
    fi

    if $PRINT_ORDER; then
        if $INSTALL_ALL; then
            PLUGINS=()
            while IFS= read -r plugin; do
                [[ -z "$plugin" ]] && continue
                PLUGINS+=("$plugin")
            done < <(get_available_plugins)
        fi
        if [[ ${#PLUGINS[@]} -eq 0 ]]; then
            log_error "No plugins specified"
            exit 1
        fi
        ordered_output=$(resolve_plugin_order "${PLUGINS[@]}")
        ordered=()
        while IFS= read -r plugin; do
            [[ -z "$plugin" ]] && continue
            ordered+=("$plugin")
        done <<EOF
$ordered_output
EOF
        printf '%s\n' "${ordered[@]}"
        exit 0
    fi

    if [[ ! -d "$DIST_DIR" ]]; then
        log_error "No built plugins at $DIST_DIR"
        log_info "Run 'scripts/plugins/build-marketplace.sh' first"
        exit 1
    fi

    if $INSTALL_ALL; then
        IGNORE_REQUIRES=true
        PLUGINS=()
        while IFS= read -r plugin; do
            [[ -z "$plugin" ]] && continue
            PLUGINS+=("$plugin")
        done < <(get_available_plugins)
    fi

    if $REFRESH; then
        FORCE=true
        if [[ ${#PLUGINS[@]} -eq 0 && "$INSTALL_ALL" == false ]]; then
            while IFS= read -r plugin; do
                [[ -z "$plugin" ]] && continue
                PLUGINS+=("$plugin")
            done < <(get_installed_plugins)
        fi
    fi

    if [[ ${#PLUGINS[@]} -eq 0 ]]; then
        log_error "No plugins specified"
        usage
    fi

    DETECTED_TOOLS_JSON=$(detect_available_tools)
    write_detected_tools_cache "$DETECTED_TOOLS_JSON"
    DETECTED_TOOLS_CSV=$(jq -r 'join(",")' <<< "$DETECTED_TOOLS_JSON")

    ordered_output=$(resolve_plugin_order "${PLUGINS[@]}")
    ordered_plugins=()
    while IFS= read -r plugin; do
        [[ -z "$plugin" ]] && continue
        ordered_plugins+=("$plugin")
    done <<EOF
$ordered_output
EOF
    PLUGINS=("${ordered_plugins[@]}")

    if $UNINSTALL; then
        reversed_output=$(reverse_plugins "${PLUGINS[@]}")
        reversed_plugins=()
        while IFS= read -r plugin; do
            [[ -z "$plugin" ]] && continue
            reversed_plugins+=("$plugin")
        done <<EOF
$reversed_output
EOF
        PLUGINS=("${reversed_plugins[@]}")
    fi

    if $DRY_RUN; then
        describe_plugin_order "Dependency order" "${PLUGINS[@]}"
        echo ""
    fi

    if ! $DRY_RUN; then
        mkdir -p "$CLAUDE_DIR"
    fi

    local success=0 failed=0

    for plugin in "${PLUGINS[@]}"; do
        if $UNINSTALL; then
            if uninstall_plugin "$plugin"; then
                success=$((success + 1))
            else
                failed=$((failed + 1))
            fi
        else
            if install_plugin "$plugin"; then
                success=$((success + 1))
            else
                failed=$((failed + 1))
            fi
        fi
    done

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    if $UNINSTALL; then
        log_success "Uninstalled: $success plugins"
    else
        log_success "Installed: $success plugins"
        if ! $DRY_RUN && ! $UNINSTALL; then
            echo ""
            echo -e "Plugin directories: ${CYAN}$PLUGINS_DIR${NC}"
            echo -e "Use with Claude Code:"
            echo -e "  claude --plugin-dir $PLUGINS_DIR/<name>"
            echo ""
            echo -e "Or register the marketplace in settings.json:"
            echo -e "  See docs/getting-started/ for details"

            # Validate hook paths after install
            echo ""
            validate_hooks_result=$(node "$BASE_DIR/scripts/validate-hooks.js" 2>&1 || true)
            if echo "$validate_hooks_result" | grep -q "^\[STALE\]"; then
                log_warn "Stale hook paths detected in ~/.claude/settings.json"
                echo "$validate_hooks_result" | grep "^\[STALE\]" | sed 's/^/  /'
                echo ""
                echo "  To repair hook paths, run:"
                echo "    stipe install --repair"
            fi
        fi
    fi
    [[ $failed -gt 0 ]] && log_error "Failed: $failed plugins"

    return 0
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -l|--list) LIST_ONLY=true; shift ;;
            -a|--all) INSTALL_ALL=true; shift ;;
            -u|--uninstall) UNINSTALL=true; shift ;;
            -n|--dry-run) DRY_RUN=true; shift ;;
            -f|--force) FORCE=true; shift ;;
            --refresh) REFRESH=true; shift ;;
            --ignore-requires) IGNORE_REQUIRES=true; shift ;;
            --print-order) PRINT_ORDER=true; shift ;;
            -h|--help) usage ;;
            -*) log_error "Unknown option: $1"; usage ;;
            *) PLUGINS+=("$1"); shift ;;
        esac
    done
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    main "$@"
fi
