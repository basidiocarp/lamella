# Payload Plugin Development

Use this page as the routing layer for Payload plugin work.

## Load Order

| Need | Reference |
| --- | --- |
| plugin shape, package layout, and publishing boundaries | `plugin-architecture-and-packaging.md` |
| collection transforms, hooks, and runtime config patterns | `plugin-config-and-collections.md` |
| admin UI, exports, and advanced TypeScript extension patterns | `plugin-ui-and-types.md` |

## Core Rules

- plugin entry points should stay `(options) => (config) => Config`
- preserve incoming config and existing hook arrays
- let users override defaults without replacing the whole plugin
- keep package exports explicit for server, client, and type-only entry points
