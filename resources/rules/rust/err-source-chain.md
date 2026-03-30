# err-source-chain

> Preserve source errors and causal chains

Keep the underlying cause available when wrapping or promoting errors.

## Prefer

- error variants with `source` fields or transparent wrappers
- context layers that preserve the original error underneath
- display output that reads well as a chain

## Avoid

- replacing a useful source error with a flat string
- losing the original cause during conversion
- duplicate top-level messages that say the same thing as the source

## See Also

- [err-context-chain](./err-context-chain.md) - Add boundary context without losing cause
- [err-thiserror-lib](./err-thiserror-lib.md) - Derive chained library errors cleanly
