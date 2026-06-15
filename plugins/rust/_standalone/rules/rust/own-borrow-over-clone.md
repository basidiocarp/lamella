# own-borrow-over-clone

> Prefer `&T` borrowing over `.clone()`

Borrow by default when ownership transfer is unnecessary.

## Prefer

- references for read-only access
- owned clones only at true lifetime or ownership boundaries
- API shapes that make borrowing easy
- measuring before treating clones as a performance bug

## Avoid

- cloning to satisfy the borrow checker reflexively
- expensive hidden clones in hot paths
- complicated lifetimes when one explicit clone is the clearer tradeoff

## See Also

- [own-clone-explicit](./own-clone-explicit.md) - Make clone cost intentional
