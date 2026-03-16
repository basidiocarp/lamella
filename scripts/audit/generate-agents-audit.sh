#!/bin/bash
DIR="agents"
OUTPUT="docs/AGENTS-AUDIT.md"

echo "# Agents Audit List" > "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Generated: $(date +%Y-%m-%d)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

count=$(find "$DIR" -name "*.md" ! -name "README.md" | wc -l | tr -d ' ')
echo "Total agents: $count" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Quick stats
large=$(find "$DIR" -name "*.md" ! -name "README.md" -exec wc -l {} \; 2>/dev/null | awk '$1 >= 200 {count++} END {print count+0}')
medium=$(find "$DIR" -name "*.md" ! -name "README.md" -exec wc -l {} \; 2>/dev/null | awk '$1 >= 50 && $1 < 200 {count++} END {print count+0}')
small=$(find "$DIR" -name "*.md" ! -name "README.md" -exec wc -l {} \; 2>/dev/null | awk '$1 < 50 {count++} END {print count+0}')

echo "## Quick Stats" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "- **Large agents (200+ lines):** $large" >> "$OUTPUT"
echo "- **Medium agents (50-199 lines):** $medium" >> "$OUTPUT"
echo "- **Small agents (<50 lines):** $small" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "## All Agents" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "| Agent | Lines | Description |" >> "$OUTPUT"
echo "|-------|-------|-------------|" >> "$OUTPUT"

find "$DIR" -name "*.md" ! -name "README.md" | sort | while read -r f; do
  [ -f "$f" ] || continue
  category=$(basename "$(dirname "$f")")
  name=$(basename "$f" .md)
  lines=$(wc -l < "$f" | tr -d ' ')
  desc=$(head -50 "$f" | grep -A1 "^description:" | tail -1 | sed 's/^description: //' | cut -c1-100)
  if [ -z "$desc" ]; then
    desc=$(grep -m1 "^[A-Z]" "$f" | head -1 | cut -c1-100)
  fi
  printf "| %s/%s | %6s | %s |\n" "$category" "$name" "$lines" "$desc" >> "$OUTPUT"
done

echo "" >> "$OUTPUT"
echo "Created $OUTPUT with $count agents"
