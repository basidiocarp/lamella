# err-expect-bugs-only

> Use `expect` only for invariant violations and impossible states

`expect` is for programmer bugs, not normal runtime failure.

## Prefer

- `expect` with messages that explain the invariant being asserted
- recoverable errors returned as `Result`
- narrow invariant checks at the point the assumption matters

## Avoid

- `expect` on user input, network calls, or filesystem operations
- vague messages like `expect("failed")`
- using `expect` to avoid designing proper error handling

## See Also

- [err-no-unwrap-prod](./err-no-unwrap-prod.md) - Keep production code off `unwrap`
- [err-result-over-panic](./err-result-over-panic.md) - Return errors for recoverable failure
