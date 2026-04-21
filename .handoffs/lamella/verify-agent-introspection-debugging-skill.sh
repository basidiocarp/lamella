#!/bin/bash
set -e

BASEDIR="$(cd "$(dirname "$0")/../.." && pwd)"

# Define the checks as an array of descriptions and commands
checks=(
  "SKILL.md file exists:!test -f '$BASEDIR/resources/skills/core/agent-introspection-debugging/SKILL.md'"
  "SKILL.md has frontmatter:!grep -q '^---' '$BASEDIR/resources/skills/core/agent-introspection-debugging/SKILL.md'"
  "SKILL.md has name field:!grep -q 'name: agent-introspection-debugging' '$BASEDIR/resources/skills/core/agent-introspection-debugging/SKILL.md'"
  "Claude manifest has skill reference:!grep -q 'core/agent-introspection-debugging' '$BASEDIR/manifests/claude/core-operations.json'"
  "Codex core-operations has skill reference:!grep -q 'core/agent-introspection-debugging' '$BASEDIR/manifests/codex/core-operations.yaml'"
  "Codex all.yaml has skill reference:!grep -q 'core/agent-introspection-debugging' '$BASEDIR/manifests/codex/all.yaml'"
  "Skill directory exists:!test -d '$BASEDIR/resources/skills/core/agent-introspection-debugging'"
  "SKILL.md is not empty:!test -s '$BASEDIR/resources/skills/core/agent-introspection-debugging/SKILL.md'"
  "Manifest JSON is valid:!python3 -m json.tool '$BASEDIR/manifests/claude/core-operations.json' > /dev/null"
)

echo "Running verification checks for agent-introspection-debugging skill..."
echo

passed=0
failed=0

for check in "${checks[@]}"; do
  description="${check%%:*}"
  command="${check#*:}"

  # Evaluate the command (it starts with '!' to negate)
  if eval "${command#!}"; then
    echo "✓ $description"
    ((passed++))
  else
    echo "✗ $description"
    ((failed++))
  fi
done

echo
echo "Results: $passed passed, $failed failed"

if [ "$failed" -eq 0 ]; then
  echo "All verification checks passed."
  exit 0
else
  echo "Some checks failed."
  exit 1
fi
