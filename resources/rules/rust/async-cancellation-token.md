# async-cancellation-token

> Use `CancellationToken` for graceful shutdown and task cancellation

Use `CancellationToken` when async tasks need cooperative shutdown.

## Prefer

- pass a token into long-lived tasks instead of assuming dropping the `JoinHandle` will stop them
- wait on `token.cancelled()` inside `select!` so tasks can stop while blocked on work
- use child tokens for per-task or per-connection shutdown under a shared parent
- cancel first, then await task completion so cleanup has a chance to run

## Avoid

- treating `drop(handle)` as cancellation
- bool flags that cannot wake blocked async work
- cancellation paths that skip cleanup, draining, or final joins
- shutdown code paths that only work for the happy path

## Use It For

- service shutdown
- background workers
- connection handlers
- grouped task trees that should stop together

## See Also

- [async-joinset-structured](./async-joinset-structured.md) - Managing multiple tasks
- [async-select-racing](./async-select-racing.md) - `select!` for cancellation and timeouts
- [async-tokio-runtime](./async-tokio-runtime.md) - Runtime shutdown
