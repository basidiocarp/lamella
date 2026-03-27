# Go Memory and Performance Patterns

Use this page to route Go performance questions by concern instead of loading one mixed checklist.

## Reference Map

| Need | Load |
|------|------|
| Allocation reduction, slice growth, and string building | [allocation-patterns.md](allocation-patterns.md) |
| Tooling, profiling, and linter-driven hygiene | [profiling-and-tooling.md](profiling-and-tooling.md) |

## Rule of Thumb

- Prefer measurement before optimization.
- Fix obvious allocation patterns first.
- Use profiling output to choose the next change, not intuition.
