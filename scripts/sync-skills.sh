#!/usr/bin/env bash
set -euo pipefail

# Determine repo root (default to lamella directory)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Fallback to hardcoded adapter definitions if TOML parsing is not available
# These match skill-sync.toml exactly
ADAPTERS=(
    "claude-code:scripts/adapters/claude-code.sh:dist/claude-code"
    "codex:scripts/adapters/codex.sh:dist/codex"
    "cursor:scripts/adapters/cursor.sh:dist/cursor"
    "gemini:scripts/adapters/gemini.sh:dist/gemini"
)

CANONICAL_DIR="resources/skills"

# Usage: check_adapters
# Verifies adapter scripts exist, are executable, and canonical dir exists
check_adapters() {
    local exit_code=0

    # Check canonical directory exists
    if [[ ! -d "$REPO_ROOT/$CANONICAL_DIR" ]]; then
        echo "ERROR: canonical directory not found: $REPO_ROOT/$CANONICAL_DIR" >&2
        return 1
    fi

    # Check each adapter script exists and is executable
    for entry in "${ADAPTERS[@]}"; do
        IFS=':' read -r target adapter output_dir <<< "$entry"

        local adapter_path="$REPO_ROOT/$adapter"

        if [[ ! -f "$adapter_path" ]]; then
            echo "ERROR: adapter script not found: $adapter_path" >&2
            exit_code=1
        elif [[ ! -x "$adapter_path" ]]; then
            echo "ERROR: adapter script not executable: $adapter_path" >&2
            exit_code=1
        fi
    done

    return "$exit_code"
}

# Usage: dry_run
# Lists what would be processed without modifying files
dry_run() {
    echo "Canonical source: $REPO_ROOT/$CANONICAL_DIR"
    echo "Adapters to run:"
    echo ""

    for entry in "${ADAPTERS[@]}"; do
        IFS=':' read -r target adapter output_dir <<< "$entry"
        echo "  Target: $target"
        echo "    Adapter: $adapter"
        echo "    Output: $output_dir"

        # Count skills in canonical dir
        local skill_count=0
        if [[ -d "$REPO_ROOT/$CANONICAL_DIR" ]]; then
            skill_count=$(find "$REPO_ROOT/$CANONICAL_DIR" -name "SKILL.md" -o -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
        fi
        echo "    Skills to process: $skill_count"
        echo ""
    done
}

# Main logic
mode="${1:-check}"

case "$mode" in
    --check)
        if check_adapters; then
            exit 0
        else
            exit 1
        fi
        ;;
    --dry-run)
        dry_run
        ;;
    *)
        echo "Usage: $0 [--check|--dry-run]" >&2
        echo "" >&2
        echo "  --check    Verify adapter scripts exist and are executable" >&2
        echo "  --dry-run  List what would be processed without modifying files" >&2
        exit 1
        ;;
esac
