#!/bin/bash
set -euo pipefail

# Zip individual skills from the lamella skills directory for upload.
# Output: dist/skills/{category}/{skill-name}.zip
#
# Usage:
#   ./scripts/zip-skills.sh              # Zip all skills
#   ./scripts/zip-skills.sh core rust    # Zip only core and rust categories
#   ./scripts/zip-skills.sh --list       # List all skills without zipping

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_DIR="$ROOT_DIR/skills"
DIST_DIR="$ROOT_DIR/dist/skills"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

if [[ "${1:-}" == "--list" ]]; then
    count=0
    for category_dir in "$SKILLS_DIR"/*/; do
        category="$(basename "$category_dir")"
        for skill_dir in "$category_dir"*/; do
            [ -d "$skill_dir" ] || continue
            skill="$(basename "$skill_dir")"
            printf "%s/%s\n" "$category" "$skill"
            count=$((count + 1))
        done
    done
    echo ""
    echo "$count skills found"
    exit 0
fi

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    echo "Usage: $(basename "$0") [categories...] [--list] [--clean]"
    echo ""
    echo "  No args       Zip all skills"
    echo "  core rust     Zip only specified categories"
    echo "  --list        List all skills without zipping"
    echo "  --clean       Remove dist/skills/ before building"
    echo ""
    echo "Output: dist/skills/{category}/{skill-name}.zip"
    exit 0
fi

if [[ "${1:-}" == "--clean" ]]; then
    rm -rf "$DIST_DIR"
    echo "Cleaned $DIST_DIR"
    shift
fi

# Determine which categories to process
categories=()
if [[ $# -gt 0 ]]; then
    categories=("$@")
else
    for dir in "$SKILLS_DIR"/*/; do
        [ -d "$dir" ] || continue
        categories+=("$(basename "$dir")")
    done
fi

total=0
skipped=0

for category in "${categories[@]}"; do
    category_path="$SKILLS_DIR/$category"
    if [[ ! -d "$category_path" ]]; then
        echo -e "${YELLOW}Warning: category '$category' not found, skipping${NC}"
        continue
    fi

    mkdir -p "$DIST_DIR/$category"

    for skill_dir in "$category_path"/*/; do
        [ -d "$skill_dir" ] || continue
        skill="$(basename "$skill_dir")"
        zip_path="$DIST_DIR/$category/$skill.zip"

        # Skip if zip is newer than all files in the skill dir
        if [[ -f "$zip_path" ]]; then
            newest_source="$(find "$skill_dir" -type f -newer "$zip_path" 2>/dev/null | head -1)"
            if [[ -z "$newest_source" ]]; then
                skipped=$((skipped + 1))
                continue
            fi
        fi

        # Create zip from within the skill directory so paths are relative
        (cd "$skill_dir" && zip -qr "$zip_path" . -x '*.DS_Store' -x '*__pycache__*')

        total=$((total + 1))
        printf "  ${GREEN}✓${NC} %s/%s → %s\n" "$category" "$skill" "$(du -h "$zip_path" | cut -f1 | xargs)"
    done
done

echo ""
echo -e "${CYAN}Done:${NC} $total zipped, $skipped unchanged"
echo -e "${CYAN}Output:${NC} $DIST_DIR/"
