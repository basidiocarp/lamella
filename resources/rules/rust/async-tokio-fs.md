# async-tokio-fs

> Use `tokio::fs` instead of `std::fs` in async code

Prefer async filesystem APIs in async contexts.

## Prefer

- `tokio::fs` for file reads, writes, metadata, and directory traversal inside async code
- isolating any unavoidable blocking filesystem work behind `spawn_blocking`
- consistent async call chains instead of mixing blocking std APIs into them

## Avoid

- `std::fs` in hot async paths
- sprinkling blocking filesystem calls through request handlers or workers
- assuming filesystem I/O is cheap enough to ignore runtime impact

## See Also

- [async-spawn-blocking](./async-spawn-blocking.md) - Offload unavoidable blocking work
- [async-tokio-runtime](./async-tokio-runtime.md) - Protect executor threads
