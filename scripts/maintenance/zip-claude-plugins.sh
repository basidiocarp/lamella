#!/usr/bin/env bash
set -euo pipefail

# Zip built Claude plugins from dist/claude/plugins.
# Output: dist/claude/plugin-zips/{plugin-name}.zip
#
# Usage:
#   ./scripts/maintenance/zip-claude-plugins.sh               # Zip all built plugins
#   ./scripts/maintenance/zip-claude-plugins.sh core rust     # Zip only named plugins
#   ./scripts/maintenance/zip-claude-plugins.sh --list        # List built plugins
#   ./scripts/maintenance/zip-claude-plugins.sh --clean       # Remove old zips first

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PLUGINS_DIR="$BASE_DIR/dist/claude/plugins"
ZIP_DIR="$BASE_DIR/dist/claude/plugin-zips"

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

usage() {
    echo "Usage: $(basename "$0") [plugin-name ...] [--list] [--clean]"
    echo ""
    echo "  No args       Zip all built Claude plugins from dist/claude/plugins"
    echo "  core rust     Zip only the named built plugins"
    echo "  --list        List built plugins without zipping"
    echo "  --clean       Remove dist/claude/plugin-zips/ before building"
    echo ""
    echo "Output: dist/claude/plugin-zips/{plugin-name}.zip"
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    usage
    exit 0
fi

if [[ ! -d "$PLUGINS_DIR" ]]; then
    echo "Built plugin directory not found: $PLUGINS_DIR" >&2
    echo "Run ./lamella build-marketplace first." >&2
    exit 1
fi

if [[ "${1:-}" == "--list" ]]; then
    count=0
    for plugin_dir in "$PLUGINS_DIR"/*; do
        [[ -d "$plugin_dir" ]] || continue
        plugin="$(basename "$plugin_dir")"
        printf "%s\n" "$plugin"
        count=$((count + 1))
    done
    echo ""
    echo "$count built plugins found"
    exit 0
fi

if [[ "${1:-}" == "--clean" ]]; then
    rm -rf "$ZIP_DIR"
    echo "Cleaned $ZIP_DIR"
    shift
fi

plugins=()
if [[ $# -gt 0 ]]; then
    plugins=("$@")
else
    for plugin_dir in "$PLUGINS_DIR"/*; do
        [[ -d "$plugin_dir" ]] || continue
        plugins+=("$(basename "$plugin_dir")")
    done
fi

mkdir -p "$ZIP_DIR"

total=0
skipped=0

for plugin in "${plugins[@]}"; do
    plugin_dir="$PLUGINS_DIR/$plugin"
    zip_path="$ZIP_DIR/$plugin.zip"

    if [[ ! -d "$plugin_dir" ]]; then
        echo -e "${YELLOW}Warning: built plugin '$plugin' not found, skipping${NC}"
        continue
    fi

    if [[ -f "$zip_path" ]]; then
        newest_source="$(find "$plugin_dir" -type f -newer "$zip_path" 2>/dev/null | head -1)"
        if [[ -z "$newest_source" ]]; then
            skipped=$((skipped + 1))
            continue
        fi
    fi

    rm -f "$zip_path"
    (
        cd "$PLUGINS_DIR"
        zip -qr "$zip_path" "$plugin" -x '*.DS_Store' -x '*__pycache__*'
    )

    total=$((total + 1))
    printf "  ${GREEN}✓${NC} %s → %s\n" "$plugin" "$(du -h "$zip_path" | awk '{print $1}')"
done

echo ""
echo -e "${CYAN}Done:${NC} $total zipped, $skipped unchanged"
echo -e "${CYAN}Output:${NC} $ZIP_DIR/"
