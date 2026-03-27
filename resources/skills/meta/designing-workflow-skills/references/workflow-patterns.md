# Workflow Patterns

Choose workflow structure based on execution shape, not domain.

## Routing Pattern

- use when one intake step fans out into separate self-contained workflows
- keep prerequisite checks in the intake layer
- route to standalone workflow files and tell the model to follow them exactly

## Sequential Pipeline

- use when each step depends on the output of the previous one
- define entry and exit criteria for every phase
- add auto-detection only to skip already-complete upstream work

## Linear Progression

- use when every execution follows one ordered path
- keep phases numbered and verifiable
- do not force this pattern onto branching work

## Safety Gate

- use for destructive or irreversible actions
- complete analysis first, then gate on review or command approval
- report what changed and what stayed untouched

## Task-Driven

- use when work has dependencies, partial failure, or resumable progress
- declare dependencies up front
- let unrelated tasks proceed independently
