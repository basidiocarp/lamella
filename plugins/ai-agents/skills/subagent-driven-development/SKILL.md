---
name: subagent-driven-development
description: "Executes implementation plans with fresh subagents for independent tasks and built-in review gates."
origin: lamella
---

# Subagent-Driven Development

Use this skill when implementation should be executed through fresh subagents with explicit review gates.

## When to Use

- a plan has separable tasks that should be delegated
- multiple independent bugs or work items can run in parallel
- you want review between tasks instead of one large risky landing

## Core Rules

1. use fresh subagents instead of reusing polluted implementation context
2. review work after each task or batch
3. do not run parallel edits against the same write surface
4. stop and escalate when tasks turn out to be coupled

## Modes

| Mode | Use when |
|------|----------|
| Sequential | tasks are coupled or must land in order |
| Parallel | tasks are independent by file or subsystem |
| Investigation | multiple root-cause threads can be explored independently |

## Core Workflow

1. load or review the plan
2. break work into independent task units
3. dispatch one subagent per unit
4. review output and fix issues before moving on
5. run a final whole-change review before closing

## References

- [references/implementer-prompt.md](references/implementer-prompt.md)
- [references/code-quality-reviewer-prompt.md](references/code-quality-reviewer-prompt.md)
- [references/spec-reviewer-prompt.md](references/spec-reviewer-prompt.md)
- [references/sequential/task-decomposition.md](references/sequential/task-decomposition.md)
- [references/sequential/prompt-construction.md](references/sequential/prompt-construction.md)
- [references/sequential/execution-protocols.md](references/sequential/execution-protocols.md)
- [references/sequential/context-passing.md](references/sequential/context-passing.md)
- [references/sequential/judge-verification.md](references/sequential/judge-verification.md)
