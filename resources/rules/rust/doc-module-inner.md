# doc-module-inner

> Use inner module docs to explain a module's purpose and shape

Document modules that form part of the navigable API surface.

## Prefer

- inner docs that explain what the module contains and why it exists
- module docs that point to the main entry types and functions
- crate or module overviews where callers need orientation

## Avoid

- empty modules that leave callers guessing where to start
- module docs that only restate the module name
- copying the same explanation into every child item

## See Also

- [doc-all-public](./doc-all-public.md) - Document the public surface
- [doc-link-types](./doc-link-types.md) - Connect readers to the key items
