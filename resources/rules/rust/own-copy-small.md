# own-copy-small

> Implement `Copy` for small, simple types

Use `Copy` only when duplication is trivial and unsurprising.

## Prefer

- `Copy` on tiny plain-data value types
- `Clone` without `Copy` when duplication should stay explicit
- deriving `Copy` only when every field and semantic expectation fits

## Avoid

- `Copy` on types with heap ownership or non-trivial semantics
- making duplication implicit when callers should notice it
- treating `Copy` as a convenience flag without cost or semantic review

## See Also

- [own-clone-explicit](./own-clone-explicit.md) - Keep non-trivial duplication explicit
- [api-common-traits](./api-common-traits.md) - Derive only traits that fit semantics
