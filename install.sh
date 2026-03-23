#!/usr/bin/env bash
#
# Lamella installer for Claude Code plugins.
#
# Usage:
#   ./install.sh                   Interactive plugin selection
#   ./install.sh core python       Install specific plugins
#   ./install.sh --all             Install every available plugin
#   ./install.sh --dry-run core    Show the resolved install order
#   ./install.sh --list            List available plugins
#
# The installer resolves manifest dependencies before it builds or installs a
# plugin, so dependency roots such as `core` are processed first.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$SCRIPT_DIR/manifests/claude"
BUILD_SCRIPT="$SCRIPT_DIR/builders/build-claude-plugin.sh"
INSTALL_SCRIPT="$SCRIPT_DIR/scripts/plugins/install-plugin.sh"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

DRY_RUN=false
LIST_ONLY=false
INSTALL_ALL=false
PLUGINS=()

usage() {
    cat <<EOF
${BOLD}lamella install${NC}

${BOLD}USAGE${NC}
    $0 [options] [plugin-names...]

${BOLD}OPTIONS${NC}
    -a, --all         Install every available plugin
    -l, --list        List available plugins
    -n, --dry-run     Show the resolved build/install order
    -h, --help        Show this help

${BOLD}EXAMPLES${NC}
    $0 core python         Install specific plugins
    $0 --all               Install everything
    $0 --dry-run typescript
    $0 --list

${BOLD}NOTE${NC}
    Dependency metadata lives in manifests/claude/*.json. The installer
    resolves those dependencies before it builds or installs anything.
EOF
    exit 0
}

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
        local name
        name=$(basename "$f" .json)
        [[ "$name" == "schema" || "$name" == "index" ]] && continue
        echo "$name"
    done | sort
}

resolve_install_order() {
    local roots=("$@")
    if [[ ${#roots[@]} -eq 0 ]]; then
        return 1
    fi

    bash "$INSTALL_SCRIPT" --print-order "${roots[@]}"
}

build_plugins() {
    local plugins=("$@")
    local built=0 failed=0 plugin manifest

    echo ""
    log_info "Building ${#plugins[@]} plugin(s)..."

    for plugin in "${plugins[@]}"; do
        manifest="$PLUGIN_DIR/$plugin.json"
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
        return 1
    fi

    if [[ $failed -gt 0 ]]; then
        log_error "Build failed for $failed plugin(s); skipping install"
        return 1
    fi

    return 0
}

print_plan() {
    local plugins=("$@")

    echo ""
    echo -e "${BOLD}Resolved install order${NC}"
    local index=1
    local plugin deps
    for plugin in "${plugins[@]}"; do
        deps=$(jq -r '[.dependencies // [] | .[]] | join(",")' "$PLUGIN_DIR/$plugin.json")
        if [[ -n "$deps" && "$deps" != "null" ]]; then
            printf "  %2d. %s (deps: %s)\n" "$index" "$plugin" "$deps"
        else
            printf "  %2d. %s\n" "$index" "$plugin"
        fi
        index=$((index + 1))
    done

    echo ""
    echo -e "${BOLD}Would run${NC}"
    for plugin in "${plugins[@]}"; do
        printf "  bash %s %s\n" "$BUILD_SCRIPT" "$PLUGIN_DIR/$plugin.json"
    done
    printf "  bash %s --force %s\n" "$INSTALL_SCRIPT" "${plugins[*]}"
}

interactive_select() {
    echo -e "${BOLD}Lamella Installer${NC}"
    echo ""
    printf "${BOLD}%-18s %-6s\n" "PLUGIN" "DEPS"
    echo "────────────────────────────────────"
    local plugin deps
    local available=()
    while IFS= read -r plugin; do
        [[ -z "$plugin" ]] && continue
        available+=("$plugin")
    done < <(list_plugin_names)
    for plugin in "${available[@]}"; do
        deps=$(jq -r '[.dependencies // [] | .[]] | join(",")' "$PLUGIN_DIR/$plugin.json")
        printf "%-18s %-6s\n" "$plugin" "${deps:--}"
    done
    echo ""
    read -rp "Enter plugin names (space-separated): " input
    read -r -a PLUGINS <<< "$input"
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -a|--all) INSTALL_ALL=true; shift ;;
            -l|--list) LIST_ONLY=true; shift ;;
            -n|--dry-run) DRY_RUN=true; shift ;;
            -h|--help) usage ;;
            -*) log_error "Unknown option: $1"; usage ;;
            *) PLUGINS+=("$1"); shift ;;
        esac
    done
}

main() {
    check_deps
    parse_args "$@"

    if $LIST_ONLY; then
        bash "$INSTALL_SCRIPT" --list
        exit 0
    fi

    if $INSTALL_ALL; then
        PLUGINS=()
        while IFS= read -r plugin; do
            [[ -z "$plugin" ]] && continue
            PLUGINS+=("$plugin")
        done < <(list_plugin_names)
    fi

    if [[ ${#PLUGINS[@]} -eq 0 ]]; then
        if [[ -t 0 ]]; then
            interactive_select
        else
            usage
        fi
    fi

    local ordered_output ordered_plugins
    ordered_output=$(resolve_install_order "${PLUGINS[@]}")
    ordered_plugins=()
    while IFS= read -r plugin; do
        [[ -z "$plugin" ]] && continue
        ordered_plugins+=("$plugin")
    done <<EOF
$ordered_output
EOF

    if $DRY_RUN; then
        print_plan "${ordered_plugins[@]}"
        exit 0
    fi

    if ! build_plugins "${ordered_plugins[@]}"; then
        exit 1
    fi

    echo ""
    log_info "Installing ${#ordered_plugins[@]} plugin(s)..."
    bash "$INSTALL_SCRIPT" --force "${ordered_plugins[@]}"

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_success "Done! ${#ordered_plugins[@]} plugin(s) installed"
    echo ""
    echo -e "${BOLD}Usage:${NC}"
    echo "  ./lamella list"
    echo "  ./lamella install core python typescript"
    echo "  ./lamella build-marketplace"
}

main "$@"
