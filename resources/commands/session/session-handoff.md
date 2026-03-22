---
description: "Produce a handoff document capturing session state for continuity across sessions. Triggers on 'session handoff', 'end of session', 'write handoff'."
argument-hint: "[output file path]"
---

# Session Handoff

Capture the current session's state so a future session can resume without losing context.

## Context

Output destination: `$ARGUMENTS`

If no path is given, output the handoff as a fenced markdown block for the user to save manually. If a path is given, write the document there.

## Workflow

### 1. Assess Current State

Review the conversation to identify:
- Completed work with commit references and files touched
- In-progress tasks and their completion percentage
- Blockers discovered during the session
- Git state (current branch, uncommitted changes, recent commits)

### 2. Capture Decisions

Extract every architectural or design decision made during this session:
- What was decided and why
- Alternatives that were considered and rejected
- Constraints discovered (library limitations, compatibility requirements, performance bounds)
- Domain knowledge or business rules surfaced during implementation

### 3. Identify Next Steps

Build a prioritized list of what comes next:
- Rank by urgency (high, medium, low)
- Include the specific file or function to start with
- Note any dependencies between steps

### 4. Capture Technical State

Record the technical environment:
- Active branches and their purpose
- Dependency changes (added, removed, upgraded packages)
- Configuration changes made
- Test status (passing, failing, skipped)

### 5. Note User Preferences

Record workflow preferences observed during the session:
- Communication style (terse vs. detailed, preferred formats)
- Tool preferences (testing framework, package manager, editor conventions)
- Coding conventions not captured in project config (naming, structure, patterns)

### 6. Write Resume Checklist

End with a concrete checklist for the next session:
- Load this handoff document
- Check git status and branch state
- Verify tests still pass
- Start with the highest-priority next step

## Output Sections

Structure the handoff document with these sections:

Current State: completed work (with commits), in-progress tasks (with percentage and blockers), git state summary.

Decisions Made: each decision as a plain entry with rationale. Include rejected alternatives.

What's Next: prioritized action list. Mark the single best starting point for the next session.

Technical State: branches, dependency changes, config changes, test status.

User Preferences: communication style, tool choices, coding conventions observed.

Quick Resume Checklist: numbered steps to get back up to speed in under a minute.
