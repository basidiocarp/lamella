# lint-missing-docs

> Enforce documentation on public APIs when the crate is meant to be consumed

Use missing-docs enforcement when public API quality matters.

## Prefer

- missing-docs checks on published crates and stable internal platform crates
- documenting public items as they are introduced
- scoped exceptions only when the audience is truly private or transient

## Avoid

- enabling missing-docs and then allowing most of the crate
- undocumented public APIs in crates meant for reuse
- forcing exhaustive docs in short-lived binaries that are not real libraries

## See Also

- [doc-all-public](./doc-all-public.md) - Public APIs should explain themselves
- [lint-workspace-lints](./lint-workspace-lints.md) - Apply lint policy consistently
