# Hook Examples

Common patterns for automating Claude Code workflows with hooks.

## Example Patterns

- desktop notifications on completion
- auto-format after writes
- protect critical files
- inject context on session start
- log shell commands
- match MCP tools by server prefix
- clean up on session end
- block destructive commands

## Protected Files Example

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | grep -qE '(\\.env|package-lock\\.json)$' && echo 'Protected file' >&2 && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```
