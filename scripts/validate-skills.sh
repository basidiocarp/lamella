#!/usr/bin/env bash
set -euo pipefail

# Validate SKILL.md files for required frontmatter fields.
#
# Rules:
# - skill-001 MUST: file has `name:` in frontmatter
# - skill-002 MUST: file has `description:` in frontmatter
# - skill-003 SHOULD: file has `origin:` in frontmatter
# - skill-004 MAY: file has ## When to Activate or ## When to Use section

# Accumulate findings in JSON format
FINDINGS=()
MUST_COUNT=0

check_skill() {
    local file="$1"

    # skill-001 MUST: name field
    if ! grep -q "^name:" "$file" 2>/dev/null; then
        FINDINGS+=("{\"rule_id\": \"skill-001\", \"level\": \"MUST\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"Missing required frontmatter field: name\", \"normative_source\": \"lamella skill authoring guide\"}")
        MUST_COUNT=$((MUST_COUNT + 1))
    fi

    # skill-002 MUST: description field
    if ! grep -q "^description:" "$file" 2>/dev/null; then
        FINDINGS+=("{\"rule_id\": \"skill-002\", \"level\": \"MUST\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"Missing required frontmatter field: description\", \"normative_source\": \"lamella skill authoring guide\"}")
        MUST_COUNT=$((MUST_COUNT + 1))
    fi

    # skill-003 SHOULD: origin field (lint-skills.sh enforces this as MUST, so this is SHOULD here)
    if ! grep -q "^origin:" "$file" 2>/dev/null; then
        FINDINGS+=("{\"rule_id\": \"skill-003\", \"level\": \"SHOULD\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"Missing recommended frontmatter field: origin\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-004 MAY: When to Activate or When to Use section
    if ! grep -qE "^## (When to Activate|When to Use)" "$file" 2>/dev/null; then
        FINDINGS+=("{\"rule_id\": \"skill-004\", \"level\": \"MAY\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"Missing suggested section: ## When to Activate or ## When to Use\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi
}

# Find and check all SKILL.md files
while IFS= read -r -d '' file; do
    check_skill "$file"
done < <(find resources/skills -name "SKILL.md" -print0 2>/dev/null)

# Build JSON output
FINDINGS_JSON="["
for i in "${!FINDINGS[@]}"; do
    FINDINGS_JSON+="${FINDINGS[$i]}"
    if [ $((i + 1)) -lt ${#FINDINGS[@]} ]; then
        FINDINGS_JSON+=","
    fi
done
FINDINGS_JSON+="]"

# Output JSON
cat <<EOF
{
  "validator": "validate-skills",
  "findings": $FINDINGS_JSON
}
EOF

# Exit with error code if any MUST-level finding
[ "$MUST_COUNT" -eq 0 ]
