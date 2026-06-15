# Advanced Workflow Patterns

Use advanced command workflows when one command needs to guide, persist, or orchestrate multiple steps instead of doing everything in one shot.

## Choose the Right Pattern

```text
Sequential workflow
- user progresses through fixed stages
- good for review, deployment, or release flows

State-carrying workflow
- one command writes state for the next
- good for resumable or checkpointed work

Composition workflow
- a higher-level command coordinates simpler commands
- good for reusable automation building blocks

Conditional workflow
- path changes based on environment or validation status
- good for safety gates and staged rollouts
```

## Practical Rules

Use an advanced workflow when:
- the user benefits from explicit stage boundaries
- the work must survive interruption
- safety checks should happen between phases
- the same lower-level commands are reused in many sequences

Avoid it when:
- one command can finish the task cleanly
- the workflow state would be opaque or fragile
- the extra orchestration adds more complexity than value

## Recommended Structure

```text
1. routing command explains the current stage
2. state file or artifact records what happened
3. next command reads that state and continues
4. recovery command can resume, inspect, or abort
```

## Reference Split

See:
- [`command-composition.md`](./command-composition.md)
- [`workflow-state-recovery.md`](./workflow-state-recovery.md)

Keep this file as the overview. Put detailed examples and templates in those focused references.
