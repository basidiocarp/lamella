# Agent-Native Architecture Patterns

Use this page as the routing layer for common system shapes in agent-native
products.

## Load Order

| Need | Reference |
| --- | --- |
| event-driven loops and using generated artifacts as the output surface | `event-driven-agent-and-site-output.md` |
| self-modifying systems, shared code, and per-instance isolation | `git-and-instance-architecture.md` |
| risky operations that need propose-versus-apply separation | `approval-gates.md` |
| shared orchestrators, lifecycle control, and immediate UI reflection | `orchestrator-and-ui-communication.md` |

## Core Rules

- Features should be prompt-defined outcomes, not hardcoded workflows.
- Persist state in files or services the agent can revisit across turns.
- Keep dangerous operations behind explicit approval boundaries.
- Separate reusable engine behavior from instance-specific data.
- Make agent actions visible to the user as quickly as possible.

## Pattern Selection

- Choose event-driven if external events trigger agent turns.
- Choose git-and-instance when code is shared but data and configuration vary.
- Choose approval gates whenever the agent can change code, secrets, or other
  high-risk assets.
- Choose orchestrator-and-ui patterns when the same app hosts multiple agent
  types or long-running sessions.
