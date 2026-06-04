#!/usr/bin/env bash
set -euo pipefail

# Validate SKILL.md files for required frontmatter fields and structure.
#
# Rules:
# - skill-001 MUST:   file has `name:` in frontmatter
# - skill-002 MUST:   file has `description:` in frontmatter
# - skill-003 SHOULD: file has `origin:` in frontmatter
# - skill-004 MAY:    file has ## When to Activate or ## When to Use section
# - skill-005 MUST:   frontmatter opens with `---` on line 1
# - skill-006 MUST:   file is non-empty
# - skill-007 MUST:   no CRLF (Windows) line endings
# - skill-008 MUST:   `name:` value matches the skill directory basename
# - skill-009 MUST:   `name:` value is kebab-case
# - skill-010 SHOULD: frontmatter block is closed (>= 2 `---` delimiters)
# - skill-011 SHOULD: `description:` value is non-empty
# - skill-012 SHOULD: `name:` value is non-empty
# - skill-013 SHOULD: `description:` value is <= 1024 chars
# - skill-014 SHOULD: file is valid UTF-8
# - skill-015 SHOULD: file is <= 16 KiB
# - skill-016 MAY:    file ends with a trailing newline
# - skill-017 MAY:    no TODO/FIXME/PLACEHOLDER markers left in content
# - skill-018 MAY:    has a `# ` level-1 title heading
# - skill-019 MAY:    has at least one `## ` body heading
# - skill-020 MAY:    `origin:` value is non-empty
#
# Only MUST-level findings affect the exit code (gate `make validate`). The
# MUST set above was verified to produce zero findings across the current
# content tree before promotion; SHOULD/MAY are advisory and never gate.
# NOTE: a `## Workflow`-required rule was deliberately NOT added — ~76% of
# current skills legitimately omit it and CLAUDE.md mandates short SKILL.md
# files, so requiring it (even advisory) would be wrong signal.

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

    # Shared field extractions (|| true keeps set -e happy when a field is absent)
    local name_field desc_field origin_field dir_name dash_count fsize
    name_field=$(grep -m1 "^name:" "$file" 2>/dev/null | sed 's/^name:[[:space:]]*//' | tr -d "\"'" | tr -d '\\' | tr -d '[:space:]' || true)
    desc_field=$(grep -m1 "^description:" "$file" 2>/dev/null | sed 's/^description:[[:space:]]*//' || true)
    origin_field=$(grep -m1 "^origin:" "$file" 2>/dev/null | sed 's/^origin:[[:space:]]*//' | tr -d "\"'" | tr -d '[:space:]' || true)
    dir_name=$(basename "$(dirname "$file")")

    # skill-005 MUST: frontmatter opens with `---` on line 1
    # Skip when CRLF is present — skill-007 owns that root cause, and a `---\r`
    # first line would otherwise double-count the same broken file.
    if ! LC_ALL=C grep -q $'\r' "$file" 2>/dev/null && [ "$(sed -n '1p' "$file")" != "---" ]; then
        FINDINGS+=("{\"rule_id\": \"skill-005\", \"level\": \"MUST\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"Frontmatter must open with --- on line 1\", \"normative_source\": \"lamella skill authoring guide\"}")
        MUST_COUNT=$((MUST_COUNT + 1))
    fi

    # skill-006 MUST: file is non-empty
    if [ ! -s "$file" ]; then
        FINDINGS+=("{\"rule_id\": \"skill-006\", \"level\": \"MUST\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"SKILL.md file is empty\", \"normative_source\": \"lamella skill authoring guide\"}")
        MUST_COUNT=$((MUST_COUNT + 1))
    fi

    # skill-007 MUST: no CRLF line endings
    if LC_ALL=C grep -q $'\r' "$file" 2>/dev/null; then
        FINDINGS+=("{\"rule_id\": \"skill-007\", \"level\": \"MUST\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"File contains CRLF (Windows) line endings; use LF\", \"normative_source\": \"lamella skill authoring guide\"}")
        MUST_COUNT=$((MUST_COUNT + 1))
    fi

    # skill-008 MUST: name value matches the skill directory basename
    if [ -n "$name_field" ] && [ "$name_field" != "$dir_name" ]; then
        FINDINGS+=("{\"rule_id\": \"skill-008\", \"level\": \"MUST\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"name '$name_field' does not match skill directory '$dir_name'\", \"normative_source\": \"lamella skill authoring guide\"}")
        MUST_COUNT=$((MUST_COUNT + 1))
    fi

    # skill-009 MUST: name value is kebab-case
    if [ -n "$name_field" ] && ! printf '%s' "$name_field" | grep -qE '^[a-z0-9]+(-[a-z0-9]+)*$'; then
        FINDINGS+=("{\"rule_id\": \"skill-009\", \"level\": \"MUST\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"name '$name_field' is not kebab-case\", \"normative_source\": \"lamella skill authoring guide\"}")
        MUST_COUNT=$((MUST_COUNT + 1))
    fi

    # skill-010 SHOULD: frontmatter block is closed (>= 2 `---` delimiters)
    dash_count=$(grep -c '^---[[:space:]]*$' "$file" 2>/dev/null || true)
    if [ "${dash_count:-0}" -lt 2 ]; then
        FINDINGS+=("{\"rule_id\": \"skill-010\", \"level\": \"SHOULD\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"Frontmatter block does not appear to be closed with a second ---\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-011 SHOULD: description value is non-empty
    if grep -q "^description:" "$file" 2>/dev/null && [ -z "$(printf '%s' "$desc_field" | tr -d '[:space:]')" ]; then
        FINDINGS+=("{\"rule_id\": \"skill-011\", \"level\": \"SHOULD\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"description field is present but empty\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-012 SHOULD: name value is non-empty
    if grep -q "^name:" "$file" 2>/dev/null && [ -z "$name_field" ]; then
        FINDINGS+=("{\"rule_id\": \"skill-012\", \"level\": \"SHOULD\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"name field is present but empty\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-013 SHOULD: description value is <= 1024 chars
    if [ "${#desc_field}" -gt 1024 ]; then
        FINDINGS+=("{\"rule_id\": \"skill-013\", \"level\": \"SHOULD\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"description is longer than 1024 characters\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-014 SHOULD: file is valid UTF-8
    if ! iconv -f UTF-8 -t UTF-8 "$file" >/dev/null 2>&1; then
        FINDINGS+=("{\"rule_id\": \"skill-014\", \"level\": \"SHOULD\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"File is not valid UTF-8\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-015 SHOULD: file is <= 16 KiB
    fsize=$(wc -c < "$file" 2>/dev/null | tr -d '[:space:]' || true)
    if [ "${fsize:-0}" -gt 16384 ]; then
        FINDINGS+=("{\"rule_id\": \"skill-015\", \"level\": \"SHOULD\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"SKILL.md is larger than 16 KiB; push depth into adjacent references\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-016 MAY: file ends with a trailing newline
    if [ -s "$file" ] && [ -n "$(tail -c1 "$file")" ]; then
        FINDINGS+=("{\"rule_id\": \"skill-016\", \"level\": \"MAY\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"File does not end with a trailing newline\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-017 MAY: no TODO/FIXME/PLACEHOLDER markers left in content
    if grep -qE "TODO|FIXME|PLACEHOLDER" "$file" 2>/dev/null; then
        FINDINGS+=("{\"rule_id\": \"skill-017\", \"level\": \"MAY\", \"certainty\": \"MEDIUM\", \"file\": \"$file\", \"message\": \"Content contains a TODO/FIXME/PLACEHOLDER marker\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-018 MAY: has a `# ` level-1 title heading
    if ! grep -qE "^# " "$file" 2>/dev/null; then
        FINDINGS+=("{\"rule_id\": \"skill-018\", \"level\": \"MAY\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"No '# ' level-1 title heading found\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-019 MAY: has at least one `## ` body heading
    if ! grep -qE "^## " "$file" 2>/dev/null; then
        FINDINGS+=("{\"rule_id\": \"skill-019\", \"level\": \"MAY\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"No '## ' body heading found\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi

    # skill-020 MAY: origin value is non-empty
    if grep -q "^origin:" "$file" 2>/dev/null && [ -z "$origin_field" ]; then
        FINDINGS+=("{\"rule_id\": \"skill-020\", \"level\": \"MAY\", \"certainty\": \"HIGH\", \"file\": \"$file\", \"message\": \"origin field is present but empty\", \"normative_source\": \"lamella skill authoring guide\"}")
    fi
}

# Resolve content root (supports LAMELLA_CONTENT_ROOT and sibling lamella-skills/)
source "$(dirname "${BASH_SOURCE[0]}")/lib/content-root.sh"

# Find and check all SKILL.md files
while IFS= read -r -d '' file; do
    check_skill "$file"
done < <(find "$CONTENT_ROOT/skills" -name "SKILL.md" -print0 2>/dev/null)

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
