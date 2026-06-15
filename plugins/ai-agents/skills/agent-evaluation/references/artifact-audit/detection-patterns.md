# Detection Patterns

Use these patterns when turning audit criteria into lightweight code checks.

## Common Checks

- Frontmatter parsing
- Required-field presence
- Keyword or trigger detection
- Section extraction
- Approximate token-budget checks
- Simple overlap or duplication heuristics

## Guardrail

Keep automated detection explainable. Prefer small, explicit checks over opaque scoring logic so failures can be interpreted and fixed quickly.
