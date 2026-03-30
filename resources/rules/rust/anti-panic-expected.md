# anti-panic-expected

> Don't panic on expected or recoverable errors

Do not panic for failures the caller should anticipate.

## Prefer

- `Result` or domain-level fallback behavior for expected failure
- panic only for violated invariants or impossible states
- public contracts that let callers recover

## Avoid

- panic on validation, I/O, network, or user input failure
- using panic to simplify application control flow
- panic paths hidden inside library helpers

## See Also

- [err-result-over-panic](./err-result-over-panic.md) - Prefer recoverable errors
- [anti-expect-lazy](./anti-expect-lazy.md) - Do not use `expect` for recoverable failures
