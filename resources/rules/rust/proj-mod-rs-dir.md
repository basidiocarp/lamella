# proj-mod-rs-dir

> Use either `foo.rs` or `foo/mod.rs` consistently with the local project style

Follow the repo's existing module file convention.

## Prefer

- matching the surrounding project style for module layout
- directory modules when the feature naturally owns several submodules
- flatter file modules when one file is enough

## Avoid

- mixing `foo.rs` and `foo/mod.rs` styles arbitrarily
- directory modules with only one tiny child file and no real structure
- style churn that changes paths without improving organization

## See Also

- [proj-mod-by-feature](./proj-mod-by-feature.md) - Split by responsibility, not fashion
- [proj-flat-small](./proj-flat-small.md) - Do not create structure early
