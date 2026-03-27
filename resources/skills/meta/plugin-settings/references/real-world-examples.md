# Real-World Plugin Settings Examples

These examples show how plugins use `.claude/*.local.md` files as lightweight
state and configuration stores.

## Pattern 1: Coordination State

A coordination plugin may store:
- agent or worker identity
- task or ticket number
- coordinator session identifier
- enabled flag
- task body or local instructions

Typical uses:
- hooks that notify a coordinator when work pauses or completes
- commands that seed a worktree with task-specific context
- lightweight handoff data between command and hook phases

## Pattern 2: Loop or Iteration State

A looping plugin may store:
- current iteration count
- max iteration limit
- completion condition
- prompt body for the next loop

Typical uses:
- stop hooks that decide whether to continue the loop
- scripts that increment counters or terminate on a success signal

## Shared Design Patterns

### Quick Exit

Hooks should return immediately if the settings file is missing or disabled.

```bash
if [[ ! -f "$STATE_FILE" ]]; then
  exit 0
fi
```

### Enabled Flag

Use an explicit `enabled` field so the file can stay in place without remaining
active.

### Atomic Updates

Update settings via temp file plus move, not in-place fragile editing, when the
hook may be interrupted.

### Small Frontmatter, Useful Body

Keep frontmatter for machine-readable state. Use the markdown body for human
instructions or task context.

## Good Uses for Local Plugin Files

- hook configuration that changes per project
- task handoff state between commands and hooks
- opt-in local behavior that should not be committed
- bounded loop or coordination state

## Bad Uses

- storing large generated outputs
- replacing a real database or durable queue
- hiding critical required configuration that the plugin cannot run without
- putting secrets in plain text unless the plugin explicitly documents that risk

## Design Rule

Treat the local settings file as a small, human-readable control plane:
- easy to inspect
- safe to ignore when absent
- narrow in scope
- easy for hooks and commands to parse

If the plugin needs richer state, move that logic into a purpose-built store
instead of growing the local markdown file into a fragile mini-database.
