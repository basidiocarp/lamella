---
name: cross-conversation-project-manager
description: "Maintains project state across multiple conversations over days or weeks."
requires:
  - hyphae
origin: lamella
---

# Cross-Conversation Project Manager

Maintain project state across multiple conversations spanning days or weeks. Track tasks, decisions, blockers, and progress so context is never lost between sessions.

## When to Use

- User references a multi-session project by name
- Status update requested for ongoing work
- Need to recall decisions or context from a previous conversation
- Generating a project status report or handoff document

## State Management

Maintain a **project state file** (markdown) for each active project, stored where the user can access it (workspace, notes directory, or memory). The file is the single source of truth.

### Project State Schema

```markdown
# Project: {name}

**Status**: active | paused | completed
**Started**: {date}
**Last Updated**: {date}
**Goal**: {one-sentence desired outcome}
**Owner**: {person or team}
**Success Criteria**:
- {criterion 1}
- {criterion 2}

## Current State
- Summary: {where the project stands right now}
- Next Milestone: {nearest meaningful checkpoint}

## Active Tasks
| Task | Status | Owner | Notes |
|---|---|---|---|
| {task} | todo | {owner} | {notes} |

## Blockers
- {blocker or "none"}

## Decisions
- {date}: {decision made}
## Session History
| Date | What Was Done | Open Items Carried Forward |
|---|---|---|
```

## Operating Rules

1. **On first mention of a project** — create the state file, populate with whatever is known
2. **At session start** — if a known project is referenced, load its state file and summarize current status
3. **During work** — update tasks, decisions, and blockers in real time as they occur
4. **At session end** — update the session history row, flag any open items
5. **On status request** — generate a concise report from the state file

## Status Report Format

When asked for a status update:

1. **Progress Summary** — what's been completed since last update
2. **Current Focus** — what's actively being worked on
3. **Blockers** — anything stalled, with suggested resolution
4. **Next Steps** — prioritized list of upcoming tasks
5. **Decisions Needed** — anything that requires the user's input to proceed

## Handoff Document

When a project transitions to another person or tool:

1. Project context and goals
2. Current state of all tasks
3. Key decisions made and their rationale
4. Known risks and open blockers
5. Recommended next actions

## Quality Gate

- [ ] State file is updated before ending any session that touched the project
- [ ] No task exists without a status (completed / in-progress / pending / blocked)
- [ ] Decisions include rationale, not just the outcome
- [ ] Blockers have an owner and a proposed resolution path
- [ ] Session history table has no gaps
