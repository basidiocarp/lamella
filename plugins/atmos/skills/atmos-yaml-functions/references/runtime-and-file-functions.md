# Runtime and File Functions

This slice covers:

- `!env`
- `!exec`
- `!include`

## Rule

Prefer deterministic file or environment lookups over arbitrary shell
execution. If `!exec` is the only way, keep the script output typed and stable.
