---
name: create-plans
description: "Creates hierarchical project plans optimized for solo agentic development."
origin: lamella
---

Use `spec-driven-workflow` when the user needs a formal reviewable spec with acceptance criteria before implementation. Use this skill when the output should be an executable plan for Claude.

## Core Principles

- plan for one human and one implementer
- `PLAN.md` is the execution prompt, not a placeholder artifact
- split aggressively to preserve execution quality
- automate anything with a CLI or API
- use checkpoints only for verification or real decisions
- commit outcomes, not intermediate planning theater

## Core Workflow

1. Scan the current planning and git state.
2. Determine whether domain expertise or research is needed.
3. Create or update the brief and roadmap.
4. Break the next phase into small executable plans.
5. Execute plans, produce summaries, and use milestones to mark shipped boundaries.

## Main References

- [references/scope-estimation.md](references/scope-estimation.md)
- [references/checkpoints.md](references/checkpoints.md)
- [references/cli-automation.md](references/cli-automation.md)
- [references/milestone-management.md](references/milestone-management.md)
- [references/user-gates.md](references/user-gates.md)
- [references/git-integration.md](references/git-integration.md)
- [references/vertical-slices.md](references/vertical-slices.md)
- [references/refactor-planning.md](references/refactor-planning.md)

## Workflow Files

- [workflows/create-brief.md](workflows/create-brief.md)
- [workflows/create-roadmap.md](workflows/create-roadmap.md)
- [workflows/plan-phase.md](workflows/plan-phase.md)
- [workflows/execute-phase.md](workflows/execute-phase.md)
- [workflows/complete-milestone.md](workflows/complete-milestone.md)
- [workflows/research-phase.md](workflows/research-phase.md)
- [workflows/handoff.md](workflows/handoff.md)
