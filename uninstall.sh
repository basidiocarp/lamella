#!/usr/bin/env bash
#
# Skill-Issue Uninstaller
#
# Usage:
#   ./uninstall.sh                    Uninstall all plugins
#   ./uninstall.sh core python        Uninstall specific plugins
#   ./uninstall.sh --list             List installed plugins
#
# This wraps install-plugin.sh --uninstall for convenience.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_SCRIPT="$SCRIPT_DIR/scripts/plugins/install-plugin.sh"
PLUGIN_DIR="$SCRIPT_DIR/plugin-manifests"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

log_info()    { echo -e "\033[0;34m[INFO]\033[0m $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

usage() {
    cat <<EOF
${BOLD}Skill-Issue Uninstaller${NC}

${BOLD}USAGE${NC}
    $0 [plugin-names...]    Uninstall specific plugins
    $0                      Uninstall all plugins
    $0 --help               Show this help

EOF
    exit 0
}

# Get all plugin names
get_all_plugins() {
    for f in "$PLUGIN_DIR"/*.json; do
        local name
        name=$(basename "$f" .json)
        [[ "$name" == "schema" || "$name" == "index" ]] && continue
        echo "$name"
    done
}

main() {
    if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
        usage
    fi

    local plugins=("$@")

    # No args → uninstall all
    if [[ ${#plugins[@]} -eq 0 ]]; then
        echo -e "${BOLD}Uninstalling all Skill-Issue plugins...${NC}"
        read -rp "Are you sure? [y/N] " confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
            echo "Cancelled."
            exit 0
        fi
        mapfile -t plugins < <(get_all_plugins)
    fi

    bash "$INSTALL_SCRIPT" --uninstall --force "${plugins[@]}"

    echo ""
    log_success "Uninstall complete."
}

main "$@"
