# err-thiserror-lib

> Use `thiserror` for library error handling

Use `thiserror` in libraries that expose typed error contracts.

## Prefer

- `thiserror` derives for small, readable error enums or structs
- explicit variants that callers can match on meaningfully
- `#[from]` and `#[source]` where they preserve useful semantics

## Avoid

- `anyhow` as the primary public error type of a reusable library
- variants that only wrap strings when a real category exists
- overfitting one giant error enum across unrelated subsystems

## See Also

- [err-anyhow-app](./err-anyhow-app.md) - Use `anyhow` in application code
- [err-custom-type](./err-custom-type.md) - Expose domain-relevant failure kinds
