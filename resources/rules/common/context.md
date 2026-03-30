---
description: "Context compaction strategy. Compact at logical task boundaries, not arbitrarily."
---

# Context Management

Compact at task boundaries, not in the middle of active implementation.

## Compact When

- switching phases or unrelated tasks
- leaving a dead-end approach behind
- a plan or todo list already captures the next work

## Do Not Compact When

- active implementation still depends on recent file paths, names, or partial state
- context pressure is low and compaction would cost more than it saves

## Preserve

- active task list
- files in flight
- decisions and rejected options
- blockers and open questions
- current verification status
- branch and dirty-worktree state
