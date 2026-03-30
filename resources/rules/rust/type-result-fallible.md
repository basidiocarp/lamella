# type-result-fallible

> Use `Result<T, E>` for operations that can fail

Use `Result` when failure is part of the normal contract.

## Prefer

- `Result` for recoverable parse, I/O, validation, and business-rule failures
- meaningful error types when callers may need to branch
- `Option` only when absence is the entire failure story

## Avoid

- panic for expected failures
- `Option` when the caller needs to know why something failed
- stringly errors when a typed contract is useful

## See Also

- [err-result-over-panic](./err-result-over-panic.md) - Prefer recoverable errors
- [type-option-nullable](./type-option-nullable.md) - Use `Option` for simple absence
