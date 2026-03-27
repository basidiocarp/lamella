---
description: Execute a Conductor track plan phase by phase with TDD and verification gates
argument-hint: "[track-id] [--task X.Y] [--phase N]"
---

# Implement Track

Execute tasks from a Conductor track plan using the workflow rules in `conductor/workflow.md`.

## Pre-flight Checks

1. Verify Conductor is initialized:
   - `conductor/product.md`
   - `conductor/workflow.md`
   - `conductor/tracks.md`
2. If any are missing, stop and explain that the project needs Conductor setup first.
3. Read `conductor/workflow.md` before doing any task selection or edits.

Parse the workflow for:
- TDD strictness
- commit expectations
- verification gates
- phase approval rules

## Track Selection

If an argument is provided:
- validate that `conductor/tracks/{track-id}/plan.md` exists
- if not, suggest the closest matches

If no argument is provided:
- read `conductor/tracks.md`
- identify in-progress and pending tracks
- ask the user which track to execute

## Context Loading

Load:
- `conductor/tracks/{trackId}/spec.md`
- `conductor/tracks/{trackId}/plan.md`
- `conductor/tracks/{trackId}/metadata.json`
- `conductor/product.md`
- `conductor/tech-stack.md` when present
- any applicable language style guides under `conductor/code_styleguides/`

Summarize the active phase, next task, and the key acceptance criteria before editing.

## Task Execution Loop

For each selected task:

1. Mark the task in progress in the track plan.
2. If TDD is required:
   - write or update the failing test first
   - confirm the failure is meaningful
   - implement the smallest change that makes it pass
   - refactor while keeping the tests green
3. If TDD is not strict, still prefer tests whenever the behavior is reproducible.
4. Re-run the closest validation loop before marking the task complete.
5. Update the track plan and metadata when the task is done.

## Phase Gates

When a phase completes:
- run the phase verification required by `conductor/workflow.md`
- summarize what passed and what still needs attention
- wait for explicit approval before moving to the next phase if the workflow requires it

## Commit Behavior

Follow the commit strategy defined in `conductor/workflow.md`.

If the workflow expects commits:
- stage only the intended task changes
- use a task-specific commit message
- do not commit unrelated worktree changes

## Guardrails

Stop and ask before continuing if:
- the task description conflicts with the spec or plan
- tests fail in unrelated areas
- the repo has conflicting local changes
- the implementation requires a broader refactor than the track describes

## Completion

When the track is finished:
- run the final verification required by the workflow
- mark the track complete in `tracks.md` and `metadata.json`
- summarize completed work, validation, and recommended next steps
