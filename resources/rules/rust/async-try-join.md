# async-try-join

> Use `try_join!` for concurrent fallible operations with early return on error

Use `try_join!` when several fallible futures can run together and one failure
should fail the whole operation.

## Prefer

- `try_join!` when all branches must succeed
- independent operations that can safely start together
- branch-local context so the first error is still diagnosable

## Avoid

- `try_join!` when later branches depend on earlier results
- hiding partial side effects that need explicit rollback
- plain `join!` when the first error should abort the group

## See Also

- [async-join-parallel](./async-join-parallel.md) - Join independent infallible futures
- [err-anyhow-app](./err-anyhow-app.md) - Add application error context
