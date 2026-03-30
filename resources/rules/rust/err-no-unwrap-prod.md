# err-no-unwrap-prod

> Avoid `unwrap` in production paths

Do not rely on `unwrap` in code that should fail gracefully.

## Prefer

- `?`, `match`, or explicit fallback handling in production code
- `expect` only for genuine invariants with a clear message
- `unwrap` in tests and short prototypes where panic is acceptable

## Avoid

- `unwrap` on I/O, parsing, env vars, or external input in shipped code
- defending `unwrap` with “this should never fail” when the invariant is not local and obvious
- silent panic paths in libraries

## See Also

- [err-expect-bugs-only](./err-expect-bugs-only.md) - Use `expect` only for invariants
- [err-result-over-panic](./err-result-over-panic.md) - Prefer recoverable failure
