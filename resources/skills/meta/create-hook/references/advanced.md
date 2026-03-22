# Advanced Hooks

Prompt-based hooks, agent-based hooks, async hooks, and security considerations.

## Prompt-based hooks

For decisions requiring judgment rather than deterministic rules, use `type: "prompt"` hooks. Claude Code sends your prompt and the hook's input to a Claude model (Haiku by default) for a yes/no decision.

### Configuration

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check if all tasks are complete. If not, respond with {\"ok\": false, \"reason\": \"what remains\"}."
          }
        ]
      }
    ]
  }
}
```

| Field | Required | Description |
|:------|:---------|:------------|
| `type` | yes | Must be `"prompt"` |
| `prompt` | yes | Prompt text. Use `$ARGUMENTS` for hook input JSON |
| `model` | no | Model to use (defaults to fast model) |
| `timeout` | no | Timeout in seconds (default: 30) |

### Response schema

The LLM must respond with:

```json
{
  "ok": true | false,
  "reason": "Explanation for the decision"
}
```

- `"ok": true` — allows the action
- `"ok": false` — blocks the action; `reason` is fed back to Claude

### Multi-criteria example

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate whether Claude should stop. Context: $ARGUMENTS\n\nCheck if:\n1. All tasks are complete\n2. No errors need addressing\n3. No follow-up work needed\n\nRespond with {\"ok\": true} to allow stopping, or {\"ok\": false, \"reason\": \"explanation\"} to continue.",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

---

## Agent-based hooks

When verification requires inspecting files or running commands, use `type: "agent"` hooks. Unlike prompt hooks, agent hooks spawn a subagent that can use tools (Read, Grep, Glob, etc.) to verify conditions.

### Configuration

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "agent",
            "prompt": "Verify that all unit tests pass. Run the test suite and check results. $ARGUMENTS",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

| Field | Required | Description |
|:------|:---------|:------------|
| `type` | yes | Must be `"agent"` |
| `prompt` | yes | Prompt describing what to verify |
| `model` | no | Model to use (defaults to fast model) |
| `timeout` | no | Timeout in seconds (default: 60) |

Agent hooks use the same `{ "ok": true/false }` response schema as prompt hooks but allow up to 50 tool-use turns.

### When to use each

- **Prompt hooks:** When hook input data alone is enough to decide
- **Agent hooks:** When you need to verify against actual codebase state

---

## Async hooks

For long-running tasks, set `"async": true` to run in the background while Claude continues working.

### Configuration

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
// ... (9 lines trimmed)
    ]
  }
}
```

### How async hooks work

1. Claude Code starts the hook process and continues immediately
2. The hook receives the same JSON input via stdin
3. After the process exits, `systemMessage` or `additionalContext` is delivered on the next turn

### Limitations

- Only `type: "command"` hooks support async
- Cannot block or return decisions (action already proceeded)
- Output delivered on next conversation turn
- No deduplication across multiple firings

### Example: async test runner

```bash
#!/bin/bash
# run-tests-async.sh
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

// ... (10 lines trimmed)
else
  echo "{\"systemMessage\": \"Tests failed: $RESULT\"}"
fi
```

---

## Security considerations

**Warning:** Hooks run with your full user permissions. They can modify, delete, or access any files your account can access.

### Best practices

- **Validate inputs:** Never trust input data blindly
- **Quote shell variables:** Use `"$VAR"` not `$VAR`
- **Block path traversal:** Check for `..` in file paths
- **Use absolute paths:** Specify full paths using `"$CLAUDE_PROJECT_DIR"`
- **Skip sensitive files:** Avoid `.env`, `.git/`, keys, etc.

### Example: safe command validation

```bash
#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

# Block dangerous patterns
// ... (9 lines trimmed)
fi

exit 0
```

---

## Debugging

### Enable debug mode

```bash
claude --debug
```

Shows hook execution details: which hooks matched, exit codes, and output.

### Verbose mode

Press `Ctrl+O` to toggle verbose mode and see hook output in the transcript.

### Debug output example

```
[DEBUG] Executing hooks for PostToolUse:Write
[DEBUG] Found 1 hook matchers in settings
[DEBUG] Matched 1 hooks for query "Write"
[DEBUG] Hook command completed with status 0: <output>
```

## See also

- [troubleshooting.md](troubleshooting.md) — Common issues and fixes
- [examples.md](examples.md) — Common patterns
- [hook-events.md](hook-events.md) — Event schemas
