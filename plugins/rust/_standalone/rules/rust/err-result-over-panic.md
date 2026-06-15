# err-result-over-panic

> Prefer `Result` over panic for recoverable failure

Return errors for failures callers can handle.

## Prefer

- `Result` for I/O, parsing, user input, network, and business-rule failure
- panics only for invariant violations or programmer bugs
- error types that help the caller decide what to do next

## Avoid

- panic-based APIs for normal failure modes
- forcing downstream code to catch bugs as control flow
- converting everything into panic just because the current caller does not care

## See Also

- [err-custom-type](./err-custom-type.md) - Model recoverable error kinds
- [err-expect-bugs-only](./err-expect-bugs-only.md) - Reserve panic-style checks for invariants
