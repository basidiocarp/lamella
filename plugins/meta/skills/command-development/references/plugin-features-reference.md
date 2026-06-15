# Plugin Command Features

Use this page as the routing layer for command behavior that is specific to
Claude Code plugins.

## Load Order

| Need | Reference |
| --- | --- |
| command discovery, namespacing, plugin-local file layout, and `${CLAUDE_PLUGIN_ROOT}` usage | `plugin-command-discovery.md` |
| plugin command workflow patterns and integration points | `plugin-command-patterns.md` |
| validation checks for plugin-bundled commands | `plugin-command-validation.md` |

## Core Rules

- Keep plugin-internal paths anchored to `${CLAUDE_PLUGIN_ROOT}`.
- Use namespaces only when the plugin has enough commands to justify them.
- Avoid command names that are too generic or likely to collide.
- Treat validation as part of authoring, not something added after packaging.
