#!/usr/bin/env bash
#
# generate-skill-manifest.sh - Walk the lamella-skills content tree and emit skills-manifest.json
#
# Reads from LAMELLA_CONTENT_ROOT (defaults to sibling ../lamella-skills or local resources/).
# Outputs to OUT_FILE (default: dist/skills-manifest.json).
#
# Usage:
#   bash scripts/generate-skill-manifest.sh [output-path]
#
# The manifest shape:
#   {
#     "content_root": "<resolved-path>",
#     "skills": [ { "name", "description", "origin", "category", "path" }, ... ],
#     "agents": [ { "name", "description", "category", "path" }, ... ],
#     "commands": [ { "name", "description", "path" }, ... ]
#   }
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

# shellcheck source=./lib/content-root.sh
source "$BASE_DIR/scripts/lib/content-root.sh"

# Write to a tracked path so the CI workflow can stage and commit it.
# dist/ is gitignored; generated/ is tracked and not scanned by any validator.
DEFAULT_OUT_FILE="$BASE_DIR/generated/skills-manifest.json"
OUT_FILE="${1:-$DEFAULT_OUT_FILE}"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Extract a single YAML scalar value from frontmatter (first match, unquoted).
# NOTE: only the first physical line of a field is captured; multi-line block
# or folded YAML scalars are silently truncated to their opening line.
extract_fm_field() {
    local file="$1"
    local field="$2"
    # Match "field: value" or "field: 'value'" or 'field: "value"'
    grep -m1 "^${field}:" "$file" 2>/dev/null \
        | sed "s/^${field}:[[:space:]]*//" \
        | sed "s/^[\"']//; s/[\"'][[:space:]]*\$//" \
        | tr -d $'\r' \
        || true
}

# Emit a single JSON object line, letting jq handle all escaping.
# Usage: emit_json_object field1 value1 field2 value2 ...
# (field count must be even)
emit_json_object() {
    local args=()
    local keys=()
    while [[ $# -ge 2 ]]; do
        args+=(--arg "$1" "$2")
        keys+=("\"$1\": \$$1")
        shift 2
    done
    local body
    body="$(IFS=,; echo "${keys[*]}")"
    jq -n "${args[@]}" "{ $body }"
}

# ---------------------------------------------------------------------------
# Accumulate JSON entries into temp files
# ---------------------------------------------------------------------------

TMP_SKILLS=$(mktemp)
TMP_AGENTS=$(mktemp)
TMP_COMMANDS=$(mktemp)

cleanup() { rm -f "$TMP_SKILLS" "$TMP_AGENTS" "$TMP_COMMANDS"; }
trap cleanup EXIT

# ---------------------------------------------------------------------------
# 1. Skills — SKILL.md inside category/skill-name/ directories
#    Also include loose .md skill files directly under skills/ (not directories)
# ---------------------------------------------------------------------------

SKILLS_DIR="$CONTENT_ROOT/skills"

collect_skills() {
    local skills_dir="$1"

    if [[ ! -d "$skills_dir" ]]; then
        echo "WARN: skills directory not found: $skills_dir" >&2
        return 0
    fi

    # Depth-2 directory skills: skills/<category>/<skill-name>/SKILL.md
    while IFS= read -r skill_md; do
        [[ -f "$skill_md" ]] || continue
        local skill_dir category_dir skill_name category_name
        skill_dir="$(dirname "$skill_md")"
        category_dir="$(dirname "$skill_dir")"
        skill_name="$(basename "$skill_dir")"
        category_name="$(basename "$category_dir")"

        local name description origin
        name="$(extract_fm_field "$skill_md" "name")"
        description="$(extract_fm_field "$skill_md" "description")"
        origin="$(extract_fm_field "$skill_md" "origin")"

        # Fall back to directory name when name field is absent
        [[ -z "$name" ]] && name="$skill_name"

        local rel_path
        rel_path="${skill_md#"${CONTENT_ROOT}/"}"

        emit_json_object \
            name        "$name" \
            description "$description" \
            origin      "$origin" \
            category    "$category_name" \
            path        "$rel_path" >> "$TMP_SKILLS"

    done < <(find "$skills_dir" -mindepth 3 -maxdepth 3 -name "SKILL.md" | sort)

    # Loose .md skill files directly under skills/ (not SKILL_TEMPLATE.md or README.md)
    while IFS= read -r skill_md; do
        [[ -f "$skill_md" ]] || continue
        local base_name
        base_name="$(basename "$skill_md" .md)"
        # Skip template and README
        [[ "$base_name" == "SKILL_TEMPLATE" ]] && continue
        [[ "$base_name" == "README" ]] && continue

        local name description origin
        name="$(extract_fm_field "$skill_md" "name")"
        description="$(extract_fm_field "$skill_md" "description")"
        origin="$(extract_fm_field "$skill_md" "origin")"

        [[ -z "$name" ]] && name="$base_name"

        local rel_path
        rel_path="${skill_md#"${CONTENT_ROOT}/"}"

        emit_json_object \
            name        "$name" \
            description "$description" \
            origin      "$origin" \
            category    "root" \
            path        "$rel_path" >> "$TMP_SKILLS"

    done < <(find "$skills_dir" -maxdepth 1 -name "*.md" | sort)
}

collect_skills "$SKILLS_DIR"

# ---------------------------------------------------------------------------
# 2. Agents — SUBAGENT.md inside category/agent-name/ directories
# ---------------------------------------------------------------------------

SUBAGENTS_DIR="$CONTENT_ROOT/subagents"

collect_agents() {
    local subagents_dir="$1"

    if [[ ! -d "$subagents_dir" ]]; then
        echo "WARN: subagents directory not found: $subagents_dir" >&2
        return 0
    fi

    while IFS= read -r subagent_md; do
        [[ -f "$subagent_md" ]] || continue
        local agent_dir category_dir agent_name category_name
        agent_dir="$(dirname "$subagent_md")"
        category_dir="$(dirname "$agent_dir")"
        agent_name="$(basename "$agent_dir")"
        category_name="$(basename "$category_dir")"

        local name description
        name="$(extract_fm_field "$subagent_md" "name")"
        description="$(extract_fm_field "$subagent_md" "description")"

        [[ -z "$name" ]] && name="$agent_name"

        local rel_path
        rel_path="${subagent_md#"${CONTENT_ROOT}/"}"

        emit_json_object \
            name        "$name" \
            description "$description" \
            category    "$category_name" \
            path        "$rel_path" >> "$TMP_AGENTS"

    done < <(find "$subagents_dir" -name "SUBAGENT.md" | sort)
}

collect_agents "$SUBAGENTS_DIR"

# ---------------------------------------------------------------------------
# 3. Commands — .md files under commands/ (recursive, excluding README.md)
# ---------------------------------------------------------------------------

COMMANDS_DIR="$CONTENT_ROOT/commands"

collect_commands() {
    local commands_dir="$1"

    if [[ ! -d "$commands_dir" ]]; then
        echo "WARN: commands directory not found: $commands_dir" >&2
        return 0
    fi

    while IFS= read -r cmd_md; do
        [[ -f "$cmd_md" ]] || continue
        local base_name
        base_name="$(basename "$cmd_md")"
        [[ "$base_name" == "README.md" ]] && continue

        local name description
        name="$(extract_fm_field "$cmd_md" "name")"
        description="$(extract_fm_field "$cmd_md" "description")"

        # Fall back to filename without extension
        if [[ -z "$name" ]]; then
            name="$(basename "$cmd_md" .md)"
        fi

        local rel_path
        rel_path="${cmd_md#"${CONTENT_ROOT}/"}"

        emit_json_object \
            name        "$name" \
            description "$description" \
            path        "$rel_path" >> "$TMP_COMMANDS"

    done < <(find "$commands_dir" -name "*.md" | sort)
}

collect_commands "$COMMANDS_DIR"

# ---------------------------------------------------------------------------
# 4. Assemble final JSON with jq
# ---------------------------------------------------------------------------

mkdir -p "$(dirname "$OUT_FILE")"

# Count top-level objects in each temp file (each object opens with '{').
# `grep -c` always prints a single integer (0 when no match) but exits 1 on
# zero matches; `|| true` absorbs that exit under `set -e` while keeping the
# printed "0". Do NOT wrap in $(( )) — an empty category would surface as the
# two-token string "0\n0" and trip an arithmetic syntax error.
SKILL_COUNT=$(grep -c '^{' "$TMP_SKILLS" 2>/dev/null || true)
AGENT_COUNT=$(grep -c '^{' "$TMP_AGENTS" 2>/dev/null || true)
CMD_COUNT=$(grep -c '^{' "$TMP_COMMANDS" 2>/dev/null || true)

# jq --slurpfile reads NDJSON files (one JSON object per line) as arrays
jq -n \
    --arg content_root "$CONTENT_ROOT" \
    --slurpfile skills "$TMP_SKILLS" \
    --slurpfile agents "$TMP_AGENTS" \
    --slurpfile commands "$TMP_COMMANDS" \
    '{
        content_root: $content_root,
        skills: $skills,
        agents: $agents,
        commands: $commands
    }' > "$OUT_FILE"

echo "skills-manifest.json written to: $OUT_FILE"
echo "  skills:   $SKILL_COUNT"
echo "  agents:   $AGENT_COUNT"
echo "  commands: $CMD_COUNT"
