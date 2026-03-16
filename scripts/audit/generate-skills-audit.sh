#!/bin/bash
cd /Users/williamnewton/projects/_examples/claude/_lamella

# Generate skills data (two-level: skills/category/skill-name/)
for category_dir in skills/*/; do
  [[ -d "$category_dir" ]] || continue
  category=$(basename "$category_dir")
  for d in "$category_dir"*/; do
    [[ -d "$d" ]] || continue
    name=$(basename "$d")
    skill_file="$d/SKILL.md"
    if [[ -f "$skill_file" ]]; then
      lines=$(wc -l < "$skill_file")
      desc=$(grep -m1 "^description:" "$skill_file" 2>/dev/null | sed 's/description: *//' | sed 's/"//g' | cut -c1-100)
      [[ -z "$desc" ]] && desc="(no description)"
      echo "$category/$name|$lines|$desc"
    else
      echo "$category/$name|0|NO SKILL.md"
    fi
  done
done | sort > /tmp/skills-audit.txt

# Generate markdown
{
  echo "# Skills Audit List"
  echo ""
  echo "Generated: $(date +%Y-%m-%d)"
  echo ""
  total=$(wc -l < /tmp/skills-audit.txt | tr -d ' ')
  echo "Total skills: $total"
  echo ""
  echo "## Quick Stats"
  echo ""
  large=$(awk -F'|' '$2 >= 200' /tmp/skills-audit.txt | wc -l | tr -d ' ')
  medium=$(awk -F'|' '$2 >= 50 && $2 < 200' /tmp/skills-audit.txt | wc -l | tr -d ' ')
  small=$(awk -F'|' '$2 > 0 && $2 < 50' /tmp/skills-audit.txt | wc -l | tr -d ' ')
  missing=$(awk -F'|' '$2 == 0' /tmp/skills-audit.txt | wc -l | tr -d ' ')
  echo "- **Large skills (200+ lines):** $large"
  echo "- **Medium skills (50-199 lines):** $medium"
  echo "- **Small skills (<50 lines):** $small"
  echo "- **Missing SKILL.md:** $missing"
  echo ""
  echo "## All Skills"
  echo ""
  echo "| Skill | Lines | Description |"
  echo "|-------|-------|-------------|"
  awk -F'|' '{gsub(/\|/, "\\|", $3); printf "| %s | %s | %s |\n", $1, $2, $3}' /tmp/skills-audit.txt
} > docs/SKILLS-AUDIT.md

echo "Created docs/SKILLS-AUDIT.md with $total skills"
