# Workflow State and Recovery

Use stateful workflows when a command sequence must survive interruptions or enforce ordered stages.

## State-Carrying Workflow

```markdown
---
description: Initialize deployment workflow
allowed-tools: Write, Bash(git:*)
---

Write:
.claude/plugin-name-workflow.local.md

State:
- workflow: deployment
- stage: testing
- branch: release/1.2.0
- started-at: 2026-03-26T10:00:00Z
```

Next commands read that state and continue:
- `/deploy-test`
- `/deploy-build`
- `/deploy-release`

## Recovery Command

```markdown
---
description: Resume deployment workflow
allowed-tools: Read
---

Detected:
- workflow: deployment
- current stage: testing
- last successful step: unit tests

Choose:
1. continue
2. restart current stage
3. abort and clean up
```

Recovery matters when:
- long-running workflows get interrupted
- a user switches sessions
- safety requires visible checkpoints

## Workflow Locks

```markdown
---
description: Start deployment
allowed-tools: Read, Write, Bash
---

Create lock:
.claude/plugin-name-workflow.lock

If lock exists:
- show owner
- show start time
- refuse concurrent execution
```

Use locks when overlapping runs would corrupt state or confuse the user.

## State Design Rules

```text
Store only what the next step truly needs
Make the stage human-readable
Keep resume and abort paths explicit
Clear locks and stale state on completion
```
