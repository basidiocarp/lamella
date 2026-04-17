#!/usr/bin/env bash
set -euo pipefail

# Maps target name to adapter script and output directory
# Each entry: target:adapter:output_dir
ADAPTERS=(
    "claude-code:scripts/adapters/claude-code.sh:dist/claude-code"
    "codex:scripts/adapters/codex.sh:dist/codex"
    "cursor:scripts/adapters/cursor.sh:dist/cursor"
    "gemini:scripts/adapters/gemini.sh:dist/gemini"
)

# Verify no two targets share an output dir
check_ownership_guard() {
    local seen_paths=""
    local seen_targets=""

    for entry in "${ADAPTERS[@]}"; do
        IFS=':' read -r target adapter output_dir <<< "$entry"

        # Check for duplicate output dirs by looking in seen_paths string
        if echo "$seen_paths" | grep -qF "|$output_dir|"; then
            # Find which target had this path
            local prev_target=$(echo "$seen_targets" | tr '|' '\n' | grep -B1 "$output_dir" | head -1)
            echo "ERROR: ownership conflict — two targets share output path: $output_dir" >&2
            echo "  Conflicting targets detected" >&2
            exit 1
        fi

        seen_paths="$seen_paths|$output_dir|"
        seen_targets="$seen_targets|$target"
    done
}

# Run all adapters on all skill files
run_all_adapters() {
    local skills_dir="${1:-resources/skills}"
    local dry_run="${2:-false}"

    check_ownership_guard

    for entry in "${ADAPTERS[@]}"; do
        IFS=':' read -r target adapter output_dir <<< "$entry"

        if [[ "$dry_run" == "true" ]]; then
            echo "DRY RUN: $target → $adapter → $output_dir"
            continue
        fi

        mkdir -p "$output_dir"
        echo "Running adapter: $target"
        while IFS= read -r -d '' skill_file; do
            bash "$adapter" "$skill_file" "$output_dir"
        done < <(find "$skills_dir" -name "*.md" -print0 2>/dev/null)
        echo "  Done: $target"
    done
}
