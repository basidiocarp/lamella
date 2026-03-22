# Getting Started with Hooks

## Set up your first hook

The fastest way to create a hook is through Claude Code's built-in menu. Type `/hooks` to open it:

```
/hooks
```

Claude Code shows a list of hook events. For this walkthrough, select **PostToolUse** (runs after a tool completes) and choose **Add new hook...**

Enter a simple command that logs tool completions:

```bash
echo "Tool completed: $(jq -r '.tool_name')" >> /tmp/tool-log.txt
```

When prompted for a matcher, enter `*` to match all tools. Claude Code adds the hook to your project's `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"Tool completed: $(jq -r '.tool_name')\" >> /tmp/tool-log.txt"
          }
        ]
      }
    ]
  }
}
```

Test it by asking Claude to read a file or run a command. Then check `/tmp/tool-log.txt` to see the logged output.

## Understanding hook structure

A hook configuration has three levels:

1. **Hook event** — the lifecycle point (e.g., `PostToolUse`)
2. **Matcher group** — a filter for when it fires (e.g., `"matcher": "Bash"`)
3. **Hook handler** — the command, prompt, or agent that runs

Each handler within a matcher group runs when the matcher pattern matches the event's context (like tool name).

## Next steps

- See [examples.md](examples.md) for common hook patterns
- Read [configuration.md](configuration.md) for all configuration options
- Check [hook-events.md](hook-events.md) for available events and their schemas
