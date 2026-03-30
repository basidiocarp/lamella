# own-clone-explicit

> Use explicit `Clone` for types where copying has meaningful cost

Implement or expose `Clone` only when duplicating the value is semantically and
operationally reasonable.

## Prefer

- explicit `Clone` for owned types where duplication is a conscious action
- documenting expensive clones on important public types
- leaving `Copy` off types where duplication is not trivial

## Avoid

- `Clone` as a license to duplicate large or expensive state casually
- cheap-looking APIs that hide meaningful duplication cost
- implementing `Copy` when clone cost is not trivial

## See Also

- [own-copy-small](./own-copy-small.md) - Reserve `Copy` for trivial duplication
- [own-borrow-over-clone](./own-borrow-over-clone.md) - Borrow before cloning
