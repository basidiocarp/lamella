#!/usr/bin/env bash
# Check SKILL.md files for token budget compliance.
# Warns (does not fail) if any SKILL.md exceeds the recommended 200-line budget.
WARN_LIMIT=200
OVER_BUDGET=0

while IFS= read -r -d '' f; do
    lines=$(wc -l < "$f")
    if [ "$lines" -gt "$WARN_LIMIT" ]; then
        echo "WARN: $f has $lines lines (budget: $WARN_LIMIT) — consider moving extended content to references/"
        OVER_BUDGET=$((OVER_BUDGET + 1))
    fi
done < <(find . -name "SKILL.md" -not -path "*/archive/*" -print0)

echo ""
if [ "$OVER_BUDGET" -gt 0 ]; then
    echo "$OVER_BUDGET skill(s) exceed the recommended budget. Review for references/ candidates."
else
    echo "All SKILL.md files within budget."
fi
