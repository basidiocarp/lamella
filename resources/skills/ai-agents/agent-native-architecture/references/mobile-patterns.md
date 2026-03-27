# Mobile Patterns for Agent-Native Apps

Use this page as the routing layer for mobile-specific agent architecture.

## Load Order

| Need | Reference |
| --- | --- |
| iCloud-first storage, directory layout, and sync boundaries | `ios-storage-and-sync.md` |
| app suspension, checkpointing, and resume flow | `mobile-checkpoint-and-resume.md` |
| permissions, background time, and model-cost choices | `mobile-permissions-and-costs.md` |

## Core Rules

- Treat mobile as a constrained runtime, not a smaller desktop.
- Keep the agent and user in the same workspace whenever the platform allows
  it.
- Save enough task state that a suspended app can resume without replaying the
  whole session.
- Prefer platform primitives such as iCloud Drive, Files, and system
  permissions before adding custom sync or orchestration layers.
- Separate always-on product goals from background-execution reality. Some work
  must continue on a server or wait for foreground time.

## Mobile Review Checklist

- Does the workspace survive process death?
- Can the app resume an interrupted agent run without losing progress?
- Are permission-dependent tools explicit about missing access?
- Is expensive model usage limited to tasks that truly need it?
- Will users understand what happened if the app is backgrounded mid-task?

If the architecture fails any of those checks, load the focused reference that
matches the gap before proceeding.
