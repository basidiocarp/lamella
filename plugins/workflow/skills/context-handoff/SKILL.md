---
name: context-handoff
description: "Creates a structured session handoff document for continuity across sessions."
origin: lamella
---

# Session Handoff Skill


## Contents

- [When to Use](#when-to-use)
- [Handoff Process](#handoff-process)
  - [Step 1: Assess Session State](#step-1-assess-session-state)
  - [Step 2: Ask What Matters](#step-2-ask-what-matters)
  - [Step 3: Generate Handoff Document](#step-3-generate-handoff-document)
- [Current State](#current-state)
- [What We Did](#what-we-did)
- [Decisions Made](#decisions-made)
- [Code Changes](#code-changes)
- [Open Questions](#open-questions)
- [Blockers / Issues](#blockers-issues)
- [Context to Remember](#context-to-remember)
- [Next Steps](#next-steps)
- [Files to Review on Resume](#files-to-review-on-resume)
  - [Step 4: Write the File](#step-4-write-the-file)
- [What to Capture](#what-to-capture)
  - [Always Include](#always-include)
  - [Include When Relevant](#include-when-relevant)
  - [Skip](#skip)
- [Format Guidelines](#format-guidelines)
- [Quality Check](#quality-check)
- [Using a Handoff Document](#using-a-handoff-document)
- [Example Handoff](#example-handoff)
- [Current State](#current-state)
- [What We Did](#what-we-did)
- [Decisions Made](#decisions-made)
- [Code Changes](#code-changes)
- [Open Questions](#open-questions)
- [Context to Remember](#context-to-remember)
- [Next Steps](#next-steps)
- [Files to Review on Resume](#files-to-review-on-resume)
- [Key Reminders](#key-reminders)


Create structured documents that enable seamless continuity across Claude
sessions.

## When to Use

- Ending a work session for the day
- Before taking a break mid-task
- Switching to a different project temporarily
- When you want to capture state for a future session
- Before a context reset you know is coming

## Handoff Process

### Step 1: Assess Session State

Quickly assess:

1. **What phase are we in?** (exploration, planning, implementation, debugging,
   review)
2. **What's the active task?** (what we're trying to accomplish)
3. **How far along are we?** (just started, mid-way, almost done)

### Step 2: Ask What Matters

Ask the user:

> "I'll create a handoff document. Is there anything specific you want to make
> sure I capture? (Key decisions, code snippets, context about the problem,
> things you'll forget, etc.)"

### Step 3: Generate Handoff Document

Create a structured document:

```markdown
# Session Handoff: [Brief Description]

**Date:** [YYYY-MM-DD] **Project:** [project name/path] **Session Duration:**
[approximate]

## Current State

- Active task: [what we were trying to finish]
- Current phase: [exploration | planning | implementation | debugging | review]
- Progress: [what is done vs what remains]

## What We Did

- [Important action or milestone]
- [Another completed action]

## Decisions Made

- [Decision] — because [reasoning]
- [Decision] — because [reasoning]

## Code Changes

- `path/to/file.ts` — [what changed and why]
- `path/to/other-file.rs` — [what changed and why]

## Open Questions

- [ ] [Question that still needs an answer]

## Context to Remember

- [Constraint, preference, or domain fact the next session needs]

## Next Steps

- [ ] [First action to take on resume]
- [ ] [Follow-up action]

## Files to Review on Resume

- `path/to/key/file.ts` — [why it matters]
```

### Step 4: Write the File

Write to: `.claude/handoffs/[YYYY-MM-DD]-[brief-description].md`

Confirm location with user:

> "I'll save this to `.claude/handoffs/[filename].md`. Want a different
> location?"

## What to Capture

### Always Include

1. **Decisions with reasoning** — The "why" is often more valuable than the
   "what"
2. **Code changes** — File paths, what changed, the intent
3. **Current progress** — Where in the task we stopped
4. **Next steps** — Clear, actionable items to resume with
5. **User context** — Constraints, preferences, domain knowledge they shared

### Include When Relevant

- **Errors encountered** — And how they were (or weren't) resolved
- **Dead ends** — Approaches tried that didn't work (saves re-exploration)
- **Key files** — Files to read to get back up to speed
- **External dependencies** — APIs, services, tools involved

### Skip

- Verbose tool output (file listings, grep results)
- Intermediate reasoning that reached conclusions
- Repeated similar operations
- Information that's obvious from the code

## Format Guidelines

- **Bullet points** — Scannable over narrative
- **File paths** — `src/foo.ts:42` not "that function"
- **Checkboxes for actions** — `- [ ]` for next steps and open questions
- **Specifics** — "Added retry logic to fetchUser()" not "made improvements"

## Quality Check

Before saving, verify:

1. **Could a fresh Claude pick up from this?** — Enough context to continue?
2. **Are decisions traceable?** — Clear why things were decided?
3. **Are next steps actionable?** — Know exactly what to do first?
4. **Is code work clear?** — Know which files matter?

## Using a Handoff Document

When starting a new session, the user can:

1. Share the handoff file at session start
2. Say "Resume from this handoff: [paste or path]"
3. Reference it with @ mention if supported

The handoff should let you hit the ground running without lengthy
re-explanation.

## Example Handoff

```markdown
# Session Handoff: Auth System Implementation

**Date:** 2025-01-15 **Project:** /path/to/my-api **Session
Duration:** ~2 hours

## Current State

- Active task: finish JWT auth flow and protect private routes
- Current phase: implementation moving into verification
- Progress: middleware and token helpers are in place; tests are incomplete

## What We Did

- Added JWT issue/verify helpers
- Wired auth middleware into protected API routes
- Added login route scaffolding and request validation

## Decisions Made

- Use signed JWTs instead of server sessions to keep the API stateless
- Store auth configuration in environment variables to avoid hardcoded secrets

## Code Changes

- `src/auth/jwt.ts` — token issue/verify helpers
- `src/auth/middleware.ts` — bearer-token guard for protected routes
- `src/routes/auth.ts` — login endpoint and credential validation

## Open Questions

- [ ] Should refresh tokens be part of the first release?
- [ ] Do we need role-based authorization immediately or later?

## Context to Remember

- Existing route tests use Vitest and request fixtures under `tests/helpers/`
- Team prefers explicit auth errors over generic 500 responses

## Next Steps

- [ ] Add integration tests for login and protected routes
- [ ] Verify token expiry and invalid-token handling
- [ ] Update API docs with auth usage examples

- `src/auth/jwt.ts` — Core token logic
- `src/routes/auth.ts` — Current endpoint implementation
```

## Key Reminders

- Ask what matters to the user before generating
- Decisions need reasoning — capture the "why"
- File paths anchor the work — always include them
- Next steps should be immediately actionable
- Better slightly longer and useful than short and vague
