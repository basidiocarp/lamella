#!/usr/bin/env bash
#
# Skill-Issue Installer
#
# Usage:
#   ./install.sh                    Interactive plugin selection
#   ./install.sh --all              Install all plugins
#   ./install.sh core python rust   Install specific plugins
#   ./install.sh --list             List available plugins
#
# Builds Skill-Issue manifests into official Claude Code plugins, then installs
# them to ~/.claude/plugins/lamella/. Each plugin is a self-contained
# directory with .claude-plugin/plugin.json following the official spec.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$SCRIPT_DIR/plugin-manifests"
BUILD_SCRIPT="$SCRIPT_DIR/scripts/plugins/build-plugin.sh"
INSTALL_SCRIPT="$SCRIPT_DIR/scripts/plugins/install-plugin.sh"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

check_deps() {
    local missing=()
    command -v jq &>/dev/null || missing+=("jq")
    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing dependencies: ${missing[*]}"
        echo "Install with: brew install ${missing[*]}"
        exit 1
    fi
}

list_plugin_names() {
    for f in "$PLUGIN_DIR"/*.json; do
        local name; name=$(basename "$f" .json)
        [[ "$name" == "schema" || "$name" == "index" ]] && continue
        echo "    $name"
    done
}

get_plugin_manifests() {
    for f in "$PLUGIN_DIR"/*.json; do
        local name; name=$(basename "$f" .json)
        [[ "$name" == "schema" || "$name" == "index" ]] && continue
        echo "$f"
    done
}

list_plugins() {
    echo -e "${BOLD}Available Plugins${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    printf "${BOLD}%-18s %6s  %-50s${NC}\n" "PLUGIN" "SKILLS" "DESCRIPTION"
    echo "──────────────────────────────────────────────────────────────"

    local total_skills=0 plugin_count=0

    for manifest in $(get_plugin_manifests); do
        local name description skills_count
        name=$(jq -r '.name' "$manifest")
        description=$(jq -r '.description // ""' "$manifest" | head -c 50)
        skills_count=$(jq -r '.resources.skills | length // 0' "$manifest")

        printf "%-18s %6s  %-50s\n" "$name" "$skills_count" "${description:0:50}"
        [[ "$skills_count" =~ ^[0-9]+$ ]] && total_skills=$((total_skills + skills_count))
        plugin_count=$((plugin_count + 1))
    done

    echo "──────────────────────────────────────────────────────────────"
    echo -e "${BOLD}Total:${NC} $plugin_count plugins, $total_skills skills"
}

build_and_install() {
    local plugins=("$@")
    local built=0 failed=0

    echo ""
    log_info "Building ${#plugins[@]} plugin(s)..."

    for plugin in "${plugins[@]}"; do
        local manifest="$PLUGIN_DIR/$plugin.json"
        if [[ ! -f "$manifest" ]]; then
            log_error "Plugin not found: $plugin"
            failed=$((failed + 1))
            continue
        fi
        if bash "$BUILD_SCRIPT" "$manifest" > /dev/null 2>&1; then
            log_success "Built: $plugin"
            built=$((built + 1))
        else
            log_error "Failed to build: $plugin"
            failed=$((failed + 1))
        fi
    done

    if [[ $built -eq 0 ]]; then
        log_error "No plugins built successfully"
        exit 1
    fi

    echo ""
    log_info "Installing $built plugin(s)..."
    bash "$INSTALL_SCRIPT" --force "${plugins[@]}"

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_success "Done! $built plugin(s) installed"
    if [[ $failed -gt 0 ]]; then
        log_warn "$failed plugin(s) failed"
    fi

    echo ""
    echo -e "${BOLD}Usage:${NC}"
    echo "  claude --plugin-dir ~/.claude/plugins/lamella/<name>"
    echo ""
    echo "  Or add the marketplace:"
    echo "  /plugin marketplace add $(pwd)/dist"
}

install_all() {
    local all_plugins=()
    for manifest in $(get_plugin_manifests); do
        all_plugins+=("$(basename "$manifest" .json)")
    done
    build_and_install "${all_plugins[@]}"
}

interactive_select() {
    echo -e "${BOLD}Skill-Issue Installer${NC}"
    echo ""
    list_plugins
    echo ""
    echo -e "${BOLD}Options:${NC}"
    echo "  1) Install ALL plugins"
    echo "  2) Install recommended set (core, security, tools, workflow)"
    echo "  3) Choose specific plugins"
    echo "  4) Cancel"
    echo ""
    read -rp "Select [1-4]: " choice

    case "$choice" in
        1) install_all ;;
        2)
            local recommended=(core security tools workflow)
            log_info "Installing recommended: ${recommended[*]}"
            build_and_install "${recommended[@]}"
            ;;
        3)
            echo "Enter plugin names (space-separated):"
            read -rp "> " plugin_input
            # shellcheck disable=SC2086
            build_and_install $plugin_input
            ;;
        4) echo "Cancelled."; exit 0 ;;
        *) log_error "Invalid selection"; exit 1 ;;
    esac
}

usage() {
    cat <<EOF
${BOLD}Skill-Issue Installer${NC}

${BOLD}USAGE${NC}
    $0 [options] [plugin-names...]

${BOLD}OPTIONS${NC}
    --all, -a     Install all plugins
    --list, -l    List available plugins
    --help, -h    Show this help

${BOLD}EXAMPLES${NC}
    $0                            Interactive selection
    $0 core python typescript     Install specific plugins
    $0 --all                      Install everything

${BOLD}AVAILABLE PLUGINS${NC}
$(list_plugin_names)

EOF
    exit 0
}

main() {
    check_deps

    if [[ $# -eq 0 ]]; then
        interactive_select
        exit 0
    fi

    local plugins=()
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -a|--all) install_all; exit 0 ;;
            -l|--list) list_plugins; exit 0 ;;
            -h|--help) usage ;;
            -*) log_error "Unknown option: $1"; usage ;;
            *) plugins+=("$1"); shift ;;
        esac
    done

    if [[ ${#plugins[@]} -gt 0 ]]; then
        build_and_install "${plugins[@]}"
    fi
}

main "$@"
