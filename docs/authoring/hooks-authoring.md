# Hooks Authoring Guide

A practical guide for writing hook scripts in Lamella.

## Hook Lifecycle

Claude Code fires hooks at named lifecycle points. The points relevant to most
hooks are:

| Event | When it fires |
|---|---|
| `SessionStart` | At the start of a new session |
| `PreToolUse` | Before a tool call executes |
| `PostToolUse` | After a tool call completes successfully |
| `Stop` | When Claude stops generating |
| `SessionEnd` | When the session ends |

Hooks are scoped to an event and an optional matcher. The matcher is a string or
pattern matched against the tool name for tool-use events, or `"*"` to match
all tools.

## stdin / stdout / stderr Contract

Claude Code delivers hook input as JSON on stdin and reads decisions from stdout.
Stderr goes to the operator's terminal as user-facing messages.

- **stdin**: JSON object describing the event (tool name, inputs, outputs, annotations).
- **stdout**: JSON response for `PreToolUse` hooks that want to block or
  modify. For advisory-only hooks, writing nothing to stdout is fine.
- **stderr**: Human-readable messages shown to the operator. Use this for
  warnings, advisories, and audit lines.

Always read stdin completely before writing any output. Buffer all stdin, parse
it, then write your response and exit.

## Exit Codes

| Code | Meaning |
|---|---|
| 0 | Allow — hook ran successfully, no block |
| 1 | Warn — surface a warning but allow the action to proceed |
| 2 | Block — prevent the tool call or action |

Use 0 for advisory and audit hooks. Reserve 1 and 2 for hooks that actively
gate execution.

## Stdin Schema

A PreToolUse event looks like:

```json
{
  "tool_name": "files/write",
  "tool_input": { "path": "/tmp/out.txt", "content": "hello" },
  "tool_annotations": {
    "readOnlyHint": false,
    "destructiveHint": false,
    "idempotentHint": false
  }
}
```

A PostToolUse event adds the tool output:

```json
{
  "tool_name": "files/read",
  "tool_input": { "path": "/tmp/out.txt" },
  "tool_output": "hello",
  "tool_annotations": {
    "readOnlyHint": true,
    "destructiveHint": false,
    "idempotentHint": true
  }
}
```

Field names may vary by runtime version. Extract with fallbacks:

```js
const toolName = event.tool_name || event.toolName || '(unknown)';
const annotations = event.tool_annotations || event.toolAnnotations || event.annotations || {};
```

## MCP Annotation Inspection Pattern

MCP tools declare their capabilities through annotation fields. Inspect these to
build advisory or audit hooks without hard-coding tool names.

```js
const readOnly   = Boolean(annotations.readOnlyHint);
const destructive = Boolean(annotations.destructiveHint);
const idempotent  = Boolean(annotations.idempotentHint);
```

The annotation-aware templates in Lamella demonstrate this pattern:

- `annotation-advisory.js` — PreToolUse advisory for destructive tools
- `annotation-audit-log.js` — PostToolUse structured audit log

Both are in `scripts/hooks/` and documented in
`resources/hooks/annotation-aware-advisory/README.md`.

## Boilerplate

All hooks should follow this structure:

```js
#!/usr/bin/env node
const MAX_STDIN = 1024 * 1024;
let data = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  if (data.length < MAX_STDIN) {
    const remaining = MAX_STDIN - data.length;
    data += chunk.length > remaining ? chunk.slice(0, remaining) : chunk;
  }
});

process.stdin.on('end', () => {
  try {
    const event = JSON.parse(data);
    // ... your logic here
  } catch {
    // Malformed or empty stdin — exit cleanly.
  }
  process.exit(0);
});
```

Key points:
- Cap stdin at 1 MB to avoid memory issues on large payloads.
- Wrap `JSON.parse` in try/catch. Malformed input should not crash the hook.
- Always call `process.exit(0)` explicitly to avoid hangs.

## Matcher Configuration

Matchers go in `.claude/settings.json` under the relevant event key:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          { "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/my-hook.js\"" }
        ]
      }
    ]
  }
}
```

- `"*"` or omitting `matcher` matches every tool call.
- A literal string like `"Bash"` matches only that tool.
- Multiple matcher objects can appear in the same event array; all matching
  entries run.

## Rules

- Write to stderr for user-facing messages. Do not write prose to stdout unless
  you intend to inject it into the model's context.
- Keep hooks fast. Slow hooks block the tool call.
- Hooks that inspect output (PostToolUse) receive the completed result on
  stdin — they cannot cancel the action, only react to it.
- Test with both well-formed and empty/malformed stdin before shipping.

## Transitional Notes

### session-end.js

The `session-end.js` hook is a transitional shim that delegates to the `cortina`
session-end adapter. It will be replaced by direct cortina wiring in a future
cutover (#67c). Until then, it provides a clean fallback when cortina is
unavailable.

## Related

- [resources/hooks/annotation-aware-advisory/README.md](../../resources/hooks/annotation-aware-advisory/README.md)
- [rules/common/hooks.md](../../resources/rules/common/hooks.md)
- [scripts/hooks/](../../scripts/hooks/)
