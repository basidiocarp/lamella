# err-anyhow-app

> Use `anyhow` for application error handling

Use `anyhow` in binaries and applications where good context matters more than a
stable typed error surface.

## Prefer

- `anyhow::Result` at application boundaries
- `.context(...)` or `.with_context(...)` at steps where the failing operation needs explanation
- typed library errors underneath, converted into `anyhow` in the app layer

## Avoid

- `anyhow` in reusable libraries that should expose typed failure contracts
- bare `?` chains with no context on important I/O or parsing steps
- stringly boxed errors when `anyhow` already solves the problem

## See Also

- [err-thiserror-lib](./err-thiserror-lib.md) - Use typed errors in libraries
- [err-source-chain](./err-source-chain.md) - Preserve underlying causes
