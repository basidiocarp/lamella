# proj-pub-super-parent

> Use scoped visibility like `pub(super)` or `pub(in path)` when full crate visibility is unnecessary

Use scoped visibility to expose internals only as far as they actually need to
travel.

## Prefer

- `pub(super)` or `pub(in crate::path)` for tightly bounded sharing
- visibility that reflects the real architectural boundary
- revisiting visibility when modules move or responsibilities change

## Avoid

- defaulting straight from private to `pub(crate)` or `pub`
- overengineering visibility when plain private scope is enough
- exposing internal helpers broadly because the module tree is awkward

## See Also

- [proj-pub-crate-internal](./proj-pub-crate-internal.md) - Use `pub(crate)` for crate-wide internals
- [proj-mod-by-feature](./proj-mod-by-feature.md) - Better module boundaries reduce visibility sprawl
