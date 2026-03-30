# anti-expect-lazy

> Don't use expect for recoverable errors

Do not use `expect` where callers could reasonably handle the failure.

## Prefer

- `Result` for recoverable conditions
- `expect` only for local invariants that should never be violated
- messages that explain the asserted invariant when `expect` is justified

## Avoid

- `expect` on input, I/O, config, or network failure
- vague messages like `expect("failed")`
- panic as a substitute for error design

## See Also

- [err-expect-bugs-only](./err-expect-bugs-only.md) - Reserve `expect` for invariants
- [anti-unwrap-abuse](./anti-unwrap-abuse.md) - Avoid unchecked panics generally
