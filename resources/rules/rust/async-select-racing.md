# async-select-racing

> Use `select!` to race futures and handle the first to complete

Use `select!` when timeout, shutdown, or competing futures should race.

## Prefer

- `select!` for timeout-vs-work, shutdown-vs-loop, or first-response-wins logic
- making cancellation behavior explicit for losing branches
- guarding branches only when the condition is part of the contract

## Avoid

- sequential fallback code when the requirement is actually to race
- large `select!` blocks that hide too much branch-specific logic
- assuming losing branches continue running after they are dropped

## See Also

- [async-cancellation-token](./async-cancellation-token.md) - Cooperative shutdown
- [async-watch-latest](./async-watch-latest.md) - Observe changing state while waiting
