# Annotation-Aware Hook Templates

Two companion hooks that inspect MCP tool annotation metadata at the PreToolUse
and PostToolUse boundaries.

## What They Do

### annotation-advisory.js (PreToolUse)

Runs before each tool call. Reads the MCP annotation fields from the event and,
if the tool declares `destructiveHint: true`, writes an advisory message to
stderr so the operator can see it before approving the action.

The hook always exits 0 — it is advisory only and never blocks execution.

Example output:

```
[annotation-advisory] tool=files/delete destructive=true readOnly=false idempotent=false — review before approving
```

### annotation-audit-log.js (PostToolUse)

Runs after each tool call completes. Reads the MCP annotation fields and writes
one structured log line to stderr recording the tool name and its declared
capabilities.

The hook always exits 0.

Example output:

```
[annotation-audit] tool=files/read readOnly=true destructive=false idempotent=true
```

## Annotation Fields Inspected

| Field | Meaning |
|---|---|
| `readOnlyHint` | Tool does not modify external state |
| `destructiveHint` | Tool may perform destructive updates (delete, overwrite) |
| `idempotentHint` | Repeated calls with the same input produce the same effect |

These fields come from the MCP tool definition and are forwarded in the hook
event by the Claude Code runtime.

## Wiring Into Settings

Add both hooks to `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/annotation-advisory.js\""
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/annotation-audit-log.js\""
          }
        ]
      }
    ]
  }
}
```

The `"*"` matcher runs the hook for every tool call. Narrow the matcher to a
specific tool name or pattern if you only want coverage for certain tools.

## When to Use Each

Use `annotation-advisory.js` when you want a visible warning before any
destructive MCP tool fires. This is useful in environments where operators
review tool approvals manually.

Use `annotation-audit-log.js` when you want a persistent record of which
annotated tools ran and what their declared capabilities were. Pipe or redirect
stderr to a log file for persistent audit trails.

Both hooks can run together — the advisory fires first at PreToolUse, and the
audit log fires after completion at PostToolUse.

## Related

- [scripts/hooks/annotation-advisory.js](../../../scripts/hooks/annotation-advisory.js)
- [scripts/hooks/annotation-audit-log.js](../../../scripts/hooks/annotation-audit-log.js)
- [docs/authoring/hooks-authoring.md](../../../docs/authoring/hooks-authoring.md)
- [rules/common/hooks.md](../../rules/common/hooks.md)
