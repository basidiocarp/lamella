# Research Prompt Template

For phases requiring research before planning:

```markdown
---
phase: XX-name
type: research
topic: [research-topic]
---
// ... (96 lines trimmed)

<workflow>
Step 1 - Initialize:
```bash
# Create skeleton file
cat > .planning/phases/XX-name/FINDINGS.md <<'EOF'
# [Topic] Research Findings

## Summary
[Will complete at end]

## Recommendations
[Will complete at end]

## Key Findings
[Append findings here as discovered]

## Code Examples
[Append examples here as found]

## Metadata
[Will complete at end]
EOF
```

Step 2 - Append findings as discovered:
After researching each aspect, immediately append to Key Findings section

Step 3 - Finalize at end:
// ... (77 lines trimmed)
- Quality report distinguishes verified from assumed
- Ready to inform PLAN.md creation
</success_criteria>
```

<when_to_use>
Create RESEARCH.md before PLAN.md when:
- Technology choice unclear
- Best practices needed for unfamiliar domain
- API/library investigation required
- Architecture decision pending
- Multiple valid approaches exist
</when_to_use>

<example>
```markdown
---
phase: 02-auth
type: research
topic: JWT library selection for Next.js App Router
---
// ... (36 lines trimmed)
- Known limitations documented
- Verification checklist completed
</success_criteria>
```
</example>
