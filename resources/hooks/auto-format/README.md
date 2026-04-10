# Auto-Format Hook

Automatically formats files after Claude edits them.

This folder contains both:
- a standalone cross-platform Node example in [auto-format.js](auto-format.js)
- a standalone Bash variant in [auto-format.sh](auto-format.sh)

The Lamella plugin's shared catalog uses the Node-based [`post-edit-format.js`](../../../scripts/hooks/post-edit-format.js) hook instead.

## Behavior

The standalone Node example:
- formats Python with `ruff format` and `ruff check --fix`
- formats Go with `goimports`
- formats other supported files with `prettier`
- exits successfully even if formatting fails, so it does not block Claude

## Platform Notes

Both variants are supported.

- Use `auto-format.js` for the most portable Windows, macOS, and Linux path.
- Use `auto-format.sh` if you prefer a Bash-based setup on macOS, Linux, or Windows via Git Bash or WSL.

If you want the cross-platform Lamella default instead of the standalone example, prefer the plugin-bundled Node hook:

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/post-edit-format.js\""
}
```

## Prerequisites

```bash
# Python
pip install ruff

# Go
go install golang.org/x/tools/cmd/goimports@latest

# JavaScript/TypeScript/etc
npm install -g prettier
```

## Installation

### Standalone Node example

macOS / Linux:

```bash
cp auto-format.js ~/.claude/hooks/auto-format.js
chmod +x ~/.claude/hooks/auto-format.js
```

PowerShell:

```powershell
Copy-Item .\auto-format.js "$HOME\.claude\hooks\auto-format.js"
```

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$HOME/.claude/hooks/auto-format.js\""
          }
        ]
      }
    ]
  }
}
```

### Standalone Bash variant

```bash
cp auto-format.sh ~/.claude/hooks/auto-format.sh
chmod +x ~/.claude/hooks/auto-format.sh
```

## Troubleshooting

### Formatter not found

The hook skips missing formatters. Check that they are in your `PATH`.

### Wrong formatter version

The Node example relies on your normal `PATH` plus `npx` for prettier. If your tools are installed elsewhere, update your shell or PowerShell environment before running Claude.

## Related Hooks

- [change-summary](../change-summary/)
- [`post-edit-format.js`](../../../scripts/hooks/post-edit-format.js)
