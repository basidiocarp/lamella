# Hook Events Reference

Complete reference for all hook events, their input schemas, and decision control options.

## Event lifecycle

| Event | When it fires |
|:------|:-------------|
| `SessionStart` | When a session begins or resumes |
| `UserPromptSubmit` | When you submit a prompt, before Claude processes it |
| `PreToolUse` | Before a tool call executes. Can block it |
| `PermissionRequest` | When a permission dialog appears |
| `PostToolUse` | After a tool call succeeds |
| `PostToolUseFailure` | After a tool call fails |
| `Notification` | When Claude Code sends a notification |
| `SubagentStart` | When a subagent is spawned |
| `SubagentStop` | When a subagent finishes |
| `Stop` | When Claude finishes responding |
| `PreCompact` | Before context compaction |
| `SessionEnd` | When a session terminates |

---

## SessionStart

Runs when Claude Code starts a new session or resumes an existing session.

### Matcher values
| Matcher | When it fires |
|:--------|:-------------|
| `startup` | New session |
| `resume` | `--resume`, `--continue`, or `/resume` |
| `clear` | `/clear` |
| `compact` | Auto or manual compaction |

### Input
```json
{
  "session_id": "abc123",
  "cwd": "/Users/.../project",
  "hook_event_name": "SessionStart",
  "source": "startup",
  "model": "claude-sonnet-4-5-20250929"
}
```

### Decision control
| Field | Description |
|:------|:------------|
| `additionalContext` | String added to Claude's context |

**Environment variables:** `CLAUDE_ENV_FILE` is available for persisting environment variables to subsequent Bash commands.

---

## UserPromptSubmit

Runs when the user submits a prompt, before Claude processes it.

### Input
```json
{
  "hook_event_name": "UserPromptSubmit",
  "prompt": "Write a function to calculate factorial"
}
```

### Decision control
| Field | Description |
|:------|:------------|
| `decision` | `"block"` prevents the prompt from being processed |
| `reason` | Shown to user when blocking |
| `additionalContext` | String added to Claude's context |

---

## PreToolUse

Runs before a tool call executes. Matches on tool name.

### Tool input schemas

**Bash:**
| Field | Type | Description |
|:------|:-----|:------------|
| `command` | string | Shell command to execute |
| `description` | string | Optional description |
| `timeout` | number | Optional timeout in milliseconds |

**Write:**
| Field | Type | Description |
|:------|:-----|:------------|
| `file_path` | string | Absolute path to the file |
| `content` | string | Content to write |

**Edit:**
| Field | Type | Description |
|:------|:-----|:------------|
| `file_path` | string | Absolute path to the file |
| `old_string` | string | Text to find and replace |
| `new_string` | string | Replacement text |

**Read:**
| Field | Type | Description |
|:------|:-----|:------------|
| `file_path` | string | Absolute path to the file |
| `offset` | number | Optional line number to start |
| `limit` | number | Optional number of lines |

**Glob:**
| Field | Type | Description |
|:------|:-----|:------------|
| `pattern` | string | Glob pattern to match |
| `path` | string | Optional directory to search |

**Grep:**
| Field | Type | Description |
|:------|:-----|:------------|
| `pattern` | string | Regular expression pattern |
| `path` | string | Optional file or directory |
| `glob` | string | Optional glob to filter files |

### Decision control
| Field | Description |
|:------|:------------|
| `permissionDecision` | `"allow"`, `"deny"`, or `"ask"` |
| `permissionDecisionReason` | Reason for the decision |
| `updatedInput` | Modifies tool input before execution |
| `additionalContext` | String added to Claude's context |

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Database writes not allowed"
  }
}
```

---

## PermissionRequest

Runs when a permission dialog is about to be shown.

### Input
```json
{
  "hook_event_name": "PermissionRequest",
  "tool_name": "Bash",
  "tool_input": { "command": "rm -rf node_modules" },
  "permission_suggestions": [
    { "type": "toolAlwaysAllow", "tool": "Bash" }
  ]
}
```

### Decision control
| Field | Description |
|:------|:------------|
| `behavior` | `"allow"` or `"deny"` |
| `updatedInput` | For `"allow"`: modifies tool input |
| `updatedPermissions` | For `"allow"`: applies permission rules |
| `message` | For `"deny"`: tells Claude why |

---

## PostToolUse

Runs after a tool completes successfully.

### Input
```json
{
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": { "file_path": "/path/to/file.txt", "content": "..." },
  "tool_response": { "filePath": "/path/to/file.txt", "success": true }
}
```

### Decision control
| Field | Description |
|:------|:------------|
| `decision` | `"block"` prompts Claude with the reason |
| `reason` | Explanation shown to Claude |
| `additionalContext` | Additional context for Claude |

---

## PostToolUseFailure

Runs when a tool execution fails.

### Input
```json
{
  "hook_event_name": "PostToolUseFailure",
  "tool_name": "Bash",
  "tool_input": { "command": "npm test" },
  "error": "Command exited with non-zero status code 1",
  "is_interrupt": false
}
```

### Decision control
| Field | Description |
|:------|:------------|
| `additionalContext` | Context for Claude about the failure |

---

## Notification

Runs when Claude Code sends notifications.

### Matcher values
`permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`

### Input
```json
{
  "hook_event_name": "Notification",
  "message": "Claude needs your permission to use Bash",
  "title": "Permission needed",
  "notification_type": "permission_prompt"
}
```

---

## SubagentStart

Runs when a subagent is spawned via the Task tool.

### Input
```json
{
  "hook_event_name": "SubagentStart",
  "agent_id": "agent-abc123",
  "agent_type": "Explore"
}
```

---

## SubagentStop

Runs when a subagent has finished.

### Input
```json
{
  "hook_event_name": "SubagentStop",
  "stop_hook_active": false,
  "agent_id": "def456",
  "agent_type": "Explore",
  "agent_transcript_path": "~/.claude/projects/.../subagents/agent-def456.jsonl"
}
```

Uses same decision control as Stop hooks.

---

## Stop

Runs when the main Claude Code agent finishes responding.

### Input
```json
{
  "hook_event_name": "Stop",
  "stop_hook_active": false
}
```

### Decision control
| Field | Description |
|:------|:------------|
| `decision` | `"block"` prevents Claude from stopping |
| `reason` | Required when blocking; tells Claude why |

**Important:** Check `stop_hook_active` field to prevent infinite loops.

---

## PreCompact

Runs before context compaction.

### Matcher values
| Matcher | When it fires |
|:--------|:-------------|
| `manual` | `/compact` |
| `auto` | Auto-compact when context is full |

### Input
```json
{
  "hook_event_name": "PreCompact",
  "trigger": "manual",
  "custom_instructions": ""
}
```

---

## SessionEnd

Runs when a Claude Code session ends.

### Matcher values
| Reason | Description |
|:-------|:------------|
| `clear` | Session cleared with `/clear` |
| `logout` | User logged out |
| `prompt_input_exit` | User exited while prompt input visible |
| `bypass_permissions_disabled` | Bypass permissions mode disabled |
| `other` | Other exit reasons |

### Input
```json
{
  "hook_event_name": "SessionEnd",
  "reason": "other"
}
```

SessionEnd hooks cannot block termination but can perform cleanup tasks.

---

## See also

- [input-output.md](input-output.md) — I/O formats and exit codes
- [configuration.md](configuration.md) — Configuration options
- [examples.md](examples.md) — Common patterns
