# anti-unwrap-abuse

> Don't use `.unwrap()` in production code

Unchecked panics do not belong in normal production paths.

## Prefer

- `?`, `match`, or explicit fallback handling
- `expect` only for clear local invariants
- `unwrap` mainly in tests, short scripts, or truly unreachable setup code

## Avoid

- `unwrap` on external input or I/O
- chains of `unwrap` that turn multiple recoverable failures into panics
- normalizing panic as a production error strategy

## See Also

- [err-no-unwrap-prod](./err-no-unwrap-prod.md) - Avoid `unwrap` in shipped code
- [anti-expect-lazy](./anti-expect-lazy.md) - Avoid `expect` for recoverable failure
