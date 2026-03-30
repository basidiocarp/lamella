# async-join-parallel

> Use `join!` or `try_join!` for concurrent independent futures

Use `join!` when several in-scope futures can run together and you need all of
their results.

## Prefer

- `join!` for independent futures that all must complete
- direct concurrency without spawning when the work belongs to the current task
- `try_join!` instead when the first error should stop the group

## Avoid

- `join!` when later work depends on earlier results
- spawning tasks just to regain parallelism that `join!` already gives you
- using `join!` for dynamic task sets; use `JoinSet` or streams there

## See Also

- [async-try-join](./async-try-join.md) - Fail fast on the first error
- [async-joinset-structured](./async-joinset-structured.md) - Manage dynamic spawned tasks
