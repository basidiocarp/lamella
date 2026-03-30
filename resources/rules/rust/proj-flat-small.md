# proj-flat-small

> Keep small Rust projects flat until structure pressure is real

Do not over-modularize a small crate.

## Prefer

- one or a few modules until responsibilities clearly diverge
- splitting files only when navigation or ownership actually improves
- simple layouts for small binaries and utility crates

## Avoid

- many tiny modules with weak boundaries
- workspace or crate splits before there is real pressure for them
- ceremony borrowed from larger projects without the same scale

## See Also

- [proj-mod-by-feature](./proj-mod-by-feature.md) - Split by feature when the project grows
- [proj-workspace-large](./proj-workspace-large.md) - Move to a workspace when scale justifies it
