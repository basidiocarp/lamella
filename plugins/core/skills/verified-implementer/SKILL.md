---
name: verified-implementer
description: "Run this for complex implementations requiring verification — orchestrates implementation with LLM-as-Judge validation at critical steps."
metadata:
  argument-hint: "Task file [options] (e.g., \"add-validation.feature.md --continue --human-in-the-loop\")"
origin: lamella
---
# Implement Task with Verification

Use this skill when implementation should be orchestrated through worker and judge agents instead of being handled inline.

## Core Rules

1. the orchestrator dispatches and aggregates, it does not do the work itself
2. critical steps require judge validation unless judges are explicitly skipped
3. continue and refine modes should resume from the earliest affected point
4. protect context by reading the task once and delegating the rest

## Core Workflow

1. load the task file and parse implementation steps
2. choose execution and verification level per step
3. dispatch implementation agents
4. dispatch judge agents and iterate until thresholds pass or limits are hit
5. run final definition-of-done verification and report

## References

- [references/arguments.md](references/arguments.md)
- [references/phase-0-task-selection.md](references/phase-0-task-selection.md)
- [references/phase-2-execution-patterns.md](references/phase-2-execution-patterns.md)
- [references/phase-5-aggregation.md](references/phase-5-aggregation.md)
- [references/examples.md](references/examples.md)
- [references/error-handling.md](references/error-handling.md)
- [references/verification-specs.md](references/verification-specs.md)
