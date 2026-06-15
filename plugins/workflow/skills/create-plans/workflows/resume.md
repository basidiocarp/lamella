# Workflow: Resume from Handoff

Use this workflow when a `.continue-here.md` handoff exists and work should resume from it.

## Core Workflow

1. locate the handoff file
2. parse status, context, and remaining work
3. show a short summary to the user
4. wait for confirmation
5. load referenced files
6. delete the handoff
7. continue from the recorded next action

## Guardrails

- warn if the handoff is older than two weeks
- if multiple handoffs exist, ask which one to use
- do not auto-proceed without confirmation
