# proj-workspace-deps

> Use workspace dependency inheritance for consistent versions across crates

Centralize shared dependency versions in larger workspaces.

## Prefer

- `workspace.dependencies` for crates that should stay version-aligned
- local feature overrides only when a member truly needs them
- one place to review dependency policy and upgrades

## Avoid

- version drift for the same dependency across member crates
- repeating the same dependency declarations everywhere
- workspace-level optional dependency assumptions that member crates still need to express locally

## See Also

- [proj-workspace-large](./proj-workspace-large.md) - Use workspaces when scale warrants them
- [lint-workspace-lints](./lint-workspace-lints.md) - Centralize lint policy too
