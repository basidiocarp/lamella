---
name: task-linked-council
description: "Runs a fixed two-role technical council for one task using the existing reviewer and architect lanes."
origin: lamella
---

# Task Linked Council

Use this skill when one task needs a bounded council pass rather than a broad
multi-agent swarm.

## When to Use

- a task needs both correctness review and architecture judgment
- you want two fixed technical roles, not open-ended council membership
- the council output needs a stable roster and response shape for later storage
  or UI display

## Use Existing Roles

Do not invent a new agent taxonomy for this workflow.

- the reviewer lane uses the shared `review` capability profile and should map
  to a code-reviewer-style agent focused on correctness, regression risk, and
  missing tests
- `architect` owns shape, tradeoffs, and next-step design guidance
- `business-council` remains for business or board-style decisions, not this
  technical workflow

## Required Shared Context

Give both roles the same:

- task id or task title
- repo or worktree context
- user question or decision to answer
- constraints and known risks
- relevant file or diff references

## Workflow

1. **Lock the roster**: Use exactly two roles, `review` and `architect`.
2. **Frame one task question**: Ask one bounded question tied to the task
   instead of inviting general brainstorming.
3. **Dispatch both roles with shared context**: Keep their prompts aligned so
   the output can be stored and compared later.
4. **Collect role-shaped responses**: Keep each role in its lane instead of
   asking both for everything.
5. **Return one council summary**: Preserve who said what, where they agree,
   where they disagree, and what should happen next.

## Response Convention

Return council results in this shape:

- `Council roster`: list the fixed participants and why they were chosen
- `Task context`: the task id, task question, and worktree or repo context
- `Reviewer verdict`: correctness, regression, security, and test concerns
- `Architect verdict`: design direction, tradeoffs, and integration concerns
- `Agreements`: points both roles support
- `Open tensions`: points where the roles disagree or need more evidence
- `Recommended next step`: the concrete action the main thread should take now

## Boundaries

- **Do**: keep the council task-linked, fixed-role, and easy to store later
- **Ask first**: widen the council beyond two roles or turn it into a general
  discussion surface
- **Never**: create a free-form chat room or replace the narrower reviewer and
  architect workers with a new umbrella role
