# Error Handling in Rust

Use this page to choose the right error strategy for the layer you are in.

## Reference Map

| Need | Load |
|------|------|
| `Result`, `Option`, and combinators | [result-option-and-combinators.md](result-option-and-combinators.md) |
| Domain error types and `thiserror` | [typed-errors.md](typed-errors.md) |
| Application errors with `anyhow` and context | [application-error-patterns.md](application-error-patterns.md) |

## Rule

Use typed errors at library boundaries and `anyhow`-style aggregation at the application edge.
