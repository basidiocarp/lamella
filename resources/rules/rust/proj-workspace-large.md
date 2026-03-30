# proj-workspace-large

> Use a workspace when the project has multiple crates with shared lifecycle

Reach for a workspace when several crates evolve together and benefit from
shared policy.

## Prefer

- workspaces for multi-crate repos with shared CI, linting, and release concerns
- a workspace root that centralizes dependency and lint policy
- separate crates only when boundaries are meaningful

## Avoid

- workspaces for tiny repos with one real crate and no scaling pressure
- splitting into crates before ownership, release, or dependency boundaries are clear
- using a workspace as a substitute for better module structure inside one crate

## See Also

- [proj-workspace-deps](./proj-workspace-deps.md) - Share dependency policy
- [proj-flat-small](./proj-flat-small.md) - Stay simpler while the project is small
