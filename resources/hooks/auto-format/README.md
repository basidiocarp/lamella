# Auto-Format Hook

Automatically formats files after Claude edits them.

This folder contains a **standalone Bash example**. The Lamella plugin's shared catalog uses the Node-based [`post-edit-format.js`](/Users/williamnewton/projects/claude-mycelium/lamella/scripts/hooks/post-edit-format.js) hook instead.

## Behavior

The standalone script:
- formats Python with `ruff format` and `ruff check --fix`
- formats Go with `goimports`
- formats other supported files with `prettier`
- exits successfully even if formatting fails, so it does not block Claude

## Platform Notes

Because `auto-format.sh` is Bash-based, it is best on macOS, Linux, or Windows via Git Bash or WSL.

If you want the cross-platform Lamella default on Windows, prefer the plugin-bundled Node hook:

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

### Standalone example

```bash
cp auto-format.sh ~/.claude/hooks/auto-format.sh
chmod +x ~/.claude/hooks/auto-format.sh
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
            "command": "$HOME/.claude/hooks/auto-format.sh"
          }
        ]
      }
    ]
  }
}
```

## Troubleshooting

### Formatter not found

The hook skips missing formatters. Check that they are in your `PATH`.

### Wrong formatter version

The script activates `mise` when available and also checks common local binary paths. If your tools are installed elsewhere, add those paths to the script.

## Related Hooks

- [change-summary](../change-summary/)
- [`post-edit-format.js`](/Users/williamnewton/projects/claude-mycelium/lamella/scripts/hooks/post-edit-format.js)
