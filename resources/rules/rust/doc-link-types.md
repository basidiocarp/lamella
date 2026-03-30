# doc-link-types

> Use intra-doc links to connect related types and functions

Link the API items callers actually need to navigate between.

## Prefer

- links to constructors, related types, modules, and key trait items
- link targets that match the documented workflow of the API
- rustdoc link checking in CI

## Avoid

- plain text names for important API neighbors
- links that overwhelm the prose instead of guiding it
- broken or stale references that rot silently

## See Also

- [doc-intra-links](./doc-intra-links.md) - Prefer verified intra-doc links generally
- [doc-module-inner](./doc-module-inner.md) - Orient callers at the module level too
