# name-iter-convention

> Use iter/iter_mut/into_iter for iterator methods

Iterator method names should signal borrowing and ownership consistently.

## Prefer

- `iter` for shared iteration
- `iter_mut` for mutable iteration
- `into_iter` for consuming iteration
- custom iterator names only when the method exposes a materially different view

## Avoid

- custom iterator names that duplicate standard semantics without a reason
- borrowing or ownership behavior hidden behind surprising method names

## See Also

- [name-iter-type-match](./name-iter-type-match.md) - Match iterator type names to source methods
