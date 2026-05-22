#!/usr/bin/env bash
set -euo pipefail

# Validate hooks.json structure.
#
# Rules:
# - hook-001 MUST: every top-level hook entry has a description field (non-empty string)
# - hook-002 SHOULD: every hook entry's hooks array items have a type field
# - hook-003 MAY: every hook entry has a matcher field (only applicable to PreToolUse/PostToolUse)

# Resolve content root (supports LAMELLA_CONTENT_ROOT and sibling lamella-skills/)
source "$(dirname "${BASH_SOURCE[0]}")/lib/content-root.sh"
HOOKS_FILE="$CONTENT_ROOT/hooks/hooks.json"
FINDINGS=()
MUST_COUNT=0

# If hooks.json doesn't exist, emit empty findings and exit 0
if [ ! -f "$HOOKS_FILE" ]; then
    cat <<EOF
{
  "validator": "validate-hooks",
  "findings": []
}
EOF
    exit 0
fi

# Determine which tool to use for JSON parsing
USE_JQ=false
USE_PYTHON=false

if command -v jq &>/dev/null; then
    USE_JQ=true
elif command -v python3 &>/dev/null; then
    USE_PYTHON=true
else
    # Cannot validate without jq or python3
    FINDINGS+=("{\"rule_id\": \"hook-999\", \"level\": \"SHOULD\", \"certainty\": \"HIGH\", \"file\": \"$HOOKS_FILE\", \"message\": \"Cannot validate hooks.json: neither jq nor python3 available\", \"normative_source\": \"lamella validator\"}")
fi

if [ "$USE_JQ" = true ]; then
    # Use jq for parsing

    # hook-001 MUST: every top-level entry has description
    while IFS= read -r hook_type; do
        # Get count of entries without description field in this hook type
        missing_desc=$(jq --arg ht "$hook_type" '.hooks[$ht] // [] | map(select(.description == null or .description == "")) | length' "$HOOKS_FILE")
        if [ "$missing_desc" -gt 0 ]; then
            # Collect indices without description into array first — avoids subshell mutation loss
            mapfile -t idxs < <(jq --arg ht "$hook_type" '.hooks[$ht] // [] | to_entries | .[] | select(.value.description == null or .value.description == "") | .key' "$HOOKS_FILE")
            for idx in "${idxs[@]}"; do
                FINDINGS+=("{\"rule_id\": \"hook-001\", \"level\": \"MUST\", \"certainty\": \"HIGH\", \"file\": \"$HOOKS_FILE\", \"message\": \"Hook entry in $hook_type[$idx] missing required description field\", \"normative_source\": \"lamella hook authoring guide\"}")
                MUST_COUNT=$((MUST_COUNT + 1))
            done
        fi
    done < <(jq -r '.hooks | keys | .[]' "$HOOKS_FILE")

    # hook-002 SHOULD: every hook in hooks array has type field
    while IFS= read -r hook_type; do
        missing_type=$(jq --arg ht "$hook_type" '.hooks[$ht] // [] | map(.hooks // []) | flatten | map(select(.type == null or .type == "")) | length' "$HOOKS_FILE")
        if [ "$missing_type" -gt 0 ]; then
            FINDINGS+=("{\"rule_id\": \"hook-002\", \"level\": \"SHOULD\", \"certainty\": \"HIGH\", \"file\": \"$HOOKS_FILE\", \"message\": \"$missing_type hook(s) in $hook_type missing type field\", \"normative_source\": \"lamella hook authoring guide\"}")
        fi
    done < <(jq -r '.hooks | keys | .[]' "$HOOKS_FILE")

elif [ "$USE_PYTHON" = true ]; then
    # Use python3 for parsing
    python3 << 'PYTHON_SCRIPT'
import json
import sys

HOOKS_FILE = "resources/hooks/hooks.json"
findings = []
must_count = 0

try:
    with open(HOOKS_FILE, 'r') as f:
        data = json.load(f)
except Exception as e:
    print(json.dumps({
        "validator": "validate-hooks",
        "findings": [{"rule_id": "hook-999", "level": "MUST", "certainty": "HIGH", "file": HOOKS_FILE, "message": f"Failed to parse hooks.json: {str(e)}", "normative_source": "lamella validator"}]
    }), flush=True)
    sys.exit(1)

hooks = data.get('hooks', {})

# hook-001 MUST: every top-level entry has description
for hook_type, entries in hooks.items():
    for idx, entry in enumerate(entries):
        if not entry.get('description') or entry.get('description').strip() == '':
            findings.append({
                "rule_id": "hook-001",
                "level": "MUST",
                "certainty": "HIGH",
                "file": HOOKS_FILE,
                "message": f"Hook entry in {hook_type}[{idx}] missing required description field",
                "normative_source": "lamella hook authoring guide"
            })
            must_count += 1

# hook-002 SHOULD: every hook in hooks array has type field
for hook_type, entries in hooks.items():
    for entry in entries:
        for hook in entry.get('hooks', []):
            if not hook.get('type') or hook.get('type').strip() == '':
                findings.append({
                    "rule_id": "hook-002",
                    "level": "SHOULD",
                    "certainty": "HIGH",
                    "file": HOOKS_FILE,
                    "message": f"Hook in {hook_type} missing type field",
                    "normative_source": "lamella hook authoring guide"
                })
                break

print(json.dumps({
    "validator": "validate-hooks",
    "findings": findings
}), flush=True)

sys.exit(1 if must_count > 0 else 0)
PYTHON_SCRIPT
fi

# Build and output JSON (for jq or neither-tool path; python handles its own output)
if [ "$USE_JQ" = true ] || [ "$USE_PYTHON" = false ]; then
    FINDINGS_JSON="["
    for i in "${!FINDINGS[@]}"; do
        FINDINGS_JSON+="${FINDINGS[$i]}"
        if [ $((i + 1)) -lt ${#FINDINGS[@]} ]; then
            FINDINGS_JSON+=","
        fi
    done
    FINDINGS_JSON+="]"

    cat <<EOF
{
  "validator": "validate-hooks",
  "findings": $FINDINGS_JSON
}
EOF

    # Exit with error code if any MUST-level finding
    [ "$MUST_COUNT" -eq 0 ]
fi
