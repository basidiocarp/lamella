# lint-workspace-lints

> Configure lints at workspace level for consistent enforcement

Centralize lint policy in multi-crate workspaces.

## Prefer

- workspace-level lint configuration when several crates should follow the same rules
- member crates opting into the shared lint policy explicitly
- per-crate overrides only when there is a real boundary reason

## Avoid

- copy-pasting lint config across many crates
- drift in severity for the same lint without an intentional reason
- central policies so broad that every crate needs a pile of exceptions

## See Also

- [proj-workspace-deps](./proj-workspace-deps.md) - Centralize dependency policy too
- [lint-pedantic-selective](./lint-pedantic-selective.md) - Keep shared lint sets maintainable
