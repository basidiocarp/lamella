#!/usr/bin/env bash
# Verification script for strategic-compact skill
# Checks that SKILL.md has all required content sections and fields

set -e

SKILL_PATH="resources/skills/core/strategic-compact/SKILL.md"

if [ ! -f "$SKILL_PATH" ]; then
  echo "FAIL: Skill file not found at $SKILL_PATH"
  exit 1
fi

echo "Verifying strategic-compact skill..."

CHECKS_PASSED=0
CHECKS_FAILED=0

# Check 1: origin field in frontmatter
if grep -q '^origin:' "$SKILL_PATH"; then
  echo "PASS: origin field present in frontmatter"
  ((CHECKS_PASSED++))
else
  echo "FAIL: origin field missing from frontmatter"
  ((CHECKS_FAILED++))
fi

# Check 2: "When to Activate" section exists
if grep -q '^## When to Activate$' "$SKILL_PATH"; then
  echo "PASS: 'When to Activate' section found"
  ((CHECKS_PASSED++))
else
  echo "FAIL: 'When to Activate' section not found"
  ((CHECKS_FAILED++))
fi

# Check 3: "When to Use" section should NOT exist (renamed to When to Activate)
if ! grep -q '^## When to Use$' "$SKILL_PATH"; then
  echo "PASS: Old 'When to Use' section removed (correctly renamed)"
  ((CHECKS_PASSED++))
else
  echo "FAIL: Old 'When to Use' section still present (should be renamed to 'When to Activate')"
  ((CHECKS_FAILED++))
fi

# Check 4: Context Usage Decision Table with percentage thresholds (80%, 60%)
if grep -q '> 80%' "$SKILL_PATH" && grep -q '60' "$SKILL_PATH" && grep -q 'Context usage' "$SKILL_PATH"; then
  echo "PASS: Context Usage Decision Table with percentage thresholds found"
  ((CHECKS_PASSED++))
else
  echo "FAIL: Context Usage Decision Table with percentage thresholds missing or incomplete"
  ((CHECKS_FAILED++))
fi

# Check 5: annulus statusline reference
if grep -q 'annulus statusline' "$SKILL_PATH"; then
  echo "PASS: annulus statusline reference found"
  ((CHECKS_PASSED++))
else
  echo "FAIL: annulus statusline reference missing"
  ((CHECKS_FAILED++))
fi

# Check 6: PreCompact hook integration section
if grep -q 'PreCompact' "$SKILL_PATH"; then
  echo "PASS: PreCompact hook integration section found"
  ((CHECKS_PASSED++))
else
  echo "FAIL: PreCompact hook integration section missing"
  ((CHECKS_FAILED++))
fi

# Check 7: cortina reference in hook section
if grep -q 'cortina' "$SKILL_PATH"; then
  echo "PASS: cortina reference found"
  ((CHECKS_PASSED++))
else
  echo "FAIL: cortina reference missing"
  ((CHECKS_FAILED++))
fi

echo ""
echo "Summary: $CHECKS_PASSED passed, $CHECKS_FAILED failed"

if [ $CHECKS_FAILED -gt 0 ]; then
  exit 1
fi

exit 0
