# Plugin Command Discovery

Claude Code discovers plugin commands from paths declared in the plugin
manifest. Keep the layout predictable.

## Common Layout

```text
plugin-name/
├── commands/
│   ├── analyze.md
│   └── deploy.md
└── .claude-plugin/plugin.json
```

## Namespacing Guidance

- Flat command directories are enough for small plugins.
- Add subdirectories only when the plugin has clear command families.
- Keep names descriptive and action-led.

Examples:

- good: `analyze-performance`
- good: `sync-cache`
- avoid: `run`
- avoid: `test`

## `${CLAUDE_PLUGIN_ROOT}`

`${CLAUDE_PLUGIN_ROOT}` resolves to the absolute path of the current plugin.
Use it for plugin-local resources inside a command.

### Good Uses

- shelling out to a plugin script
- loading a template or fixture file
- reading plugin-owned config

```markdown
Run: !`node ${CLAUDE_PLUGIN_ROOT}/scripts/analyze.js`
Template: @${CLAUDE_PLUGIN_ROOT}/templates/report.md
```

### Rules

- Prefer `${CLAUDE_PLUGIN_ROOT}` over relative paths for plugin-internal files.
- Validate existence before assuming optional files are present.
- Keep the path inside the plugin boundary.
