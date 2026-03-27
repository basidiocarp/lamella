# Plugin Manifest Reference

Use this page as the routing layer for `plugin.json` structure.

## Load Order

| Need | Reference |
| --- | --- |
| identity and metadata fields | `manifest-core-and-metadata.md` |
| component path fields | `manifest-component-paths.md` |
| packaging and distribution details | `manifest-distribution-fields.md` |

## Core Rules

- the manifest lives at `.claude-plugin/plugin.json`
- fields should describe the plugin clearly without turning the manifest into a
  second README
- keep paths explicit and stable across plugin builds
