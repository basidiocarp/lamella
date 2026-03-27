# Documentation Templates

Templates for creating documentation and reports.

## Templates

| File | Description |
|------|-------------|
| `HUMAN-MD-TEMPLATE.md` | Template for human-readable documentation |
| `CORRECTION-TEMPLATE.md` | Template for documenting corrections |
| `DECISION.md` | Template for decision records (ADRs) |
| `FINDINGS.md` | Template for audit/research findings |
| `SKILL-MD-TEMPLATE.md` | Template for skill documentation |
| `TRACE.md` | Template for debugging traces |

## Usage

```bash
# Create a decision record
cp resources/templates/docs/DECISION.md docs/decisions/001-architecture.md

# Document findings
cp resources/templates/docs/FINDINGS.md docs/audits/security-findings.md
```

## Best Practices

- Use UPPERCASE names for important documents
- Include dates and authors
- Link to related documents
