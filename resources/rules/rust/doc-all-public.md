# doc-all-public

> Document public APIs that others are expected to use

Public items should explain what they are for, not just what they are named.

## Prefer

- docs on public types, traits, functions, and modules meant for reuse
- behavior, invariants, and caller expectations over implementation trivia
- concise docs that still help a new caller use the API correctly

## Avoid

- undocumented public surfaces in reusable crates
- docs that only restate the type signature
- exhaustive prose on items no one outside the crate should call

## See Also

- [lint-missing-docs](./lint-missing-docs.md) - Enforce docs when reuse matters
- [doc-errors-section](./doc-errors-section.md) - Document important failure modes
