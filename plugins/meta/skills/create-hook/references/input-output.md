# Hook Input and Output

How hooks communicate with Claude Code through stdin, stdout, stderr, and exit codes.

## Input format

Hooks receive JSON data via stdin when an event fires. All events include common fields plus event-specific data.

### Common input fields

| Field | Description |
|:------|:------------|
| `session_id` | Current session identifier |
| `transcript_path` | Path to conversation JSON |
| `cwd` | Current working directory |
| `permission_mode` | `"default"`, `"plan"`, `"acceptEdits"`, `"dontAsk"`, or `"bypassPermissions"` |
| `hook_event_name` | Name of the event that fired |

Example input for a `PreToolUse` hook:

```json
{
  "session_id": "abc123",
  "transcript_path": "/home/user/.claude/projects/.../transcript.jsonl",
  "cwd": "/home/user/my-project",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

## Exit codes

The exit code tells Claude Code whether the action should proceed, be blocked, or be ignored.

| Exit code | Meaning | Behavior |
|:----------|:--------|:---------|
| **0** | Success | Action proceeds. JSON output is processed |
| **2** | Blocking error | Action blocked. stderr is fed back to Claude |
| **Other** | Non-blocking error | Action proceeds. stderr shown in verbose mode |

### Exit code 2 behavior by event

| Event | Can block? | What happens on exit 2 |
|:------|:-----------|:----------------------|
| `PreToolUse` | Yes | Blocks the tool call |
| `PermissionRequest` | Yes | Denies the permission |
| `UserPromptSubmit` | Yes | Blocks and erases prompt |
| `Stop` | Yes | Prevents Claude from stopping |
| `SubagentStop` | Yes | Prevents subagent from stopping |
| `PostToolUse` | No | Shows stderr to Claude |
| `PostToolUseFailure` | No | Shows stderr to Claude |
| `Notification` | No | Shows stderr to user only |
| `SubagentStart` | No | Shows stderr to user only |
| `SessionStart` | No | Shows stderr to user only |
| `SessionEnd` | No | Shows stderr to user only |
| `PreCompact` | No | Shows stderr to user only |

## JSON output

For finer-grained control, exit 0 and print a JSON object to stdout. JSON is only processed on exit 0.

### Universal fields

| Field | Default | Description |
|:------|:--------|:------------|
| `continue` | `true` | If `false`, Claude stops entirely |
| `stopReason` | none | Message shown when `continue` is `false` |
| `suppressOutput` | `false` | Hide stdout from verbose mode |
| `systemMessage` | none | Warning message shown to user |

### Decision control patterns

Different events use different patterns for decisions:

| Events | Pattern | Key fields |
|:-------|:--------|:-----------|
| UserPromptSubmit, PostToolUse, PostToolUseFailure, Stop, SubagentStop | Top-level | `decision: "block"`, `reason` |
| PreToolUse | hookSpecificOutput | `permissionDecision`, `permissionDecisionReason` |
| PermissionRequest | hookSpecificOutput | `decision.behavior` |

### Examples

**Top-level decision (PostToolUse, Stop, etc.):**
```json
{
  "decision": "block",
  "reason": "Test suite must pass before proceeding"
}
```

**PreToolUse decision:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Database writes not allowed"
  }
}
```

**PermissionRequest decision:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": { "command": "npm run lint" }
    }
  }
}
```

**Stop execution entirely:**
```json
{
  "continue": false,
  "stopReason": "Build failed, fix errors before continuing"
}
```

## Parsing input in scripts

### Bash with jq

```bash
#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

if echo "$COMMAND" | grep -q "drop table"; then
  echo "Blocked: dropping tables not allowed" >&2
  exit 2
fi

exit 0
```

### Python

```python
#!/usr/bin/env python3
import json
import sys

data = json.loads(sys.stdin.read())
command = data.get("tool_input", {}).get("command", "")

if "drop table" in command.lower():
    print("Blocked: dropping tables not allowed", file=sys.stderr)
    sys.exit(2)

sys.exit(0)
```

## See also

- [hook-events.md](hook-events.md) — Event schemas
- [examples.md](examples.md) — Common patterns
- [troubleshooting.md](troubleshooting.md) — Debug tips
