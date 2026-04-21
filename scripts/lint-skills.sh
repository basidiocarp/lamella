#!/usr/bin/env bash
set -euo pipefail

# Lint skill markdown files for required sections.
#
# All SKILL.md files must declare `origin:` in their frontmatter.
# Files missing this field are failed, not skipped.

FAIL=0
PASS=0
CHECKED=0

check_skill() {
    local file="$1"
    local file_fail=0

    # Fail files that have frontmatter but no origin: field.
    # origin: is required for all skill files; missing it is a lint error, not a skip.
    if ! grep -q "^origin:" "$file" 2>/dev/null; then
        echo "FAIL [$file]: missing required 'origin:' field in frontmatter"
        FAIL=$((FAIL + 1))
        return
    fi

    CHECKED=$((CHECKED + 1))

    # Check frontmatter fields
    if ! grep -q "^name:" "$file" 2>/dev/null; then
        echo "FAIL [$file]: missing 'name:' in frontmatter"
        file_fail=1
    fi
    if ! grep -q "^description:" "$file" 2>/dev/null; then
        echo "FAIL [$file]: missing 'description:' in frontmatter"
        file_fail=1
    fi
    # Note: origin: presence is already guaranteed by the early-return above.

    # Check required sections — only enforced for convention: v1 skills.
    # Pre-convention skills (no convention: field) are not required to have
    # these sections yet; they will be migrated incrementally.
    if grep -q "^convention: v1" "$file" 2>/dev/null; then
        if ! grep -q "## When to Activate" "$file" 2>/dev/null; then
            echo "FAIL [$file]: missing '## When to Activate' section"
            file_fail=1
        fi
        if ! grep -q "## How It Works" "$file" 2>/dev/null; then
            echo "FAIL [$file]: missing '## How It Works' section"
            file_fail=1
        fi
    fi

    if [ "$file_fail" -eq 0 ]; then
        PASS=$((PASS + 1))
    else
        FAIL=$((FAIL + 1))
    fi
}

# Check all SKILL.md files under resources/skills/.
# Non-SKILL.md files (references, guides, etc.) are not subject to this lint.
while IFS= read -r -d '' file; do
    check_skill "$file"
done < <(find resources/skills -name "SKILL.md" -print0 2>/dev/null)

# Also check SKILL_TEMPLATE.md is excluded — it lives at the top level
# and is not a real skill, so it is never passed to check_skill above.

echo ""
echo "Skills checked: $CHECKED"
echo "Passed: $PASS, Failed: $FAIL"

[ "$FAIL" -eq 0 ]
