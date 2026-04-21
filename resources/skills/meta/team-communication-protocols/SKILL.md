---
name: team-communication-protocols
description: "Defines agent team messaging, approvals, and shutdown protocols."
origin: lamella
---
# Team Communication Protocols

## Message Types

`message` (default) -- Direct to one teammate. Use for task updates, coordination, questions, integration notifications.

`broadcast` -- To ALL teammates. Use only for critical blockers or major shared resource changes. Each broadcast sends N messages (one per teammate), so use sparingly.

`shutdown_request` -- Request graceful termination. Teammate responds with `shutdown_response` (approve/reject).

## Anti-Patterns

| Bad                                | Better                                 |
| ---------------------------------- | -------------------------------------- |
| Broadcasting routine updates       | Direct message to affected teammate    |
| Sending JSON status in messages    | Use TaskUpdate for status changes      |
| Not communicating at integration   | Message when your interface is ready   |
| Micromanaging via messages         | Check in at milestones                 |
| Using UUIDs for teammates          | Always use names                       |
| Ignoring idle teammates            | Assign work or shut down               |

## Plan Approval

When a teammate has `plan_mode_required`:
1. Teammate creates plan using read-only tools
2. Teammate calls `ExitPlanMode` (sends `plan_approval_request` to lead)
3. Lead reviews and responds with `plan_approval_response` (approve or reject with feedback)

## Shutdown Protocol

1. Lead sends `shutdown_request` to each teammate
2. Teammate responds: `approve: true` (exits) or `approve: false` + reason (continues)
3. Lead waits for rejecting teammates to finish, then retries
4. After all shut down, call `Teammate` cleanup

## Negotiation Protocol

For complex queries (comparative, cross-domain, ambiguous), enable negotiation mode. Agents return structured responses with confidence levels (HIGH/MEDIUM/LOW/UNCERTAIN) and identified gaps. The orchestrator evaluates and refines up to 3 rounds before synthesizing a best-effort answer.

See `references/negotiation-protocol.md` for the full protocol specification.

## Teammate Discovery

Read `~/.claude/teams/{team-name}/config.json`. Always use `name` for messaging, never `agentId`.

## Reference Files

- [Messaging Patterns](references/messaging-patterns.md)
