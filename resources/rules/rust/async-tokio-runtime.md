# async-tokio-runtime

> Configure Tokio runtime appropriately for your workload

Treat runtime choice as an application boundary decision.

## Prefer

- the multithread runtime for general servers and concurrent services
- the current-thread runtime when single-threaded execution is intentional
- runtime configuration at app entry points, not inside libraries

## Avoid

- nested runtimes
- runtime flavor decisions made accidentally by copied examples
- assuming runtime shutdown is automatic for detached background tasks

## See Also

- [async-spawn-blocking](./async-spawn-blocking.md) - Keep blocking work off executor threads
- [async-cancellation-token](./async-cancellation-token.md) - Shut down tasks cleanly
