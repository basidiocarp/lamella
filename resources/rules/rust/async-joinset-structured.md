# async-joinset-structured

> Use `JoinSet` for managing dynamic collections of spawned tasks

Use `JoinSet` when the task count is dynamic and you need structured ownership
of spawned work.

## Prefer

- `JoinSet` for fan-out task groups created in loops or from incoming work
- draining the set so panics and task errors are observed
- pairing `JoinSet` with cancellation or shutdown handling

## Avoid

- collecting detached `JoinHandle`s in ad hoc vectors
- spawning tasks you never rejoin or inspect
- using `JoinSet` when `join!` over a fixed set is simpler

## See Also

- [async-join-parallel](./async-join-parallel.md) - Join a fixed set of futures
- [async-cancellation-token](./async-cancellation-token.md) - Stop task groups cleanly
