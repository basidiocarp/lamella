# Session Handoff Template

> **Purpose**: Structured context handoff to preserve intent when approaching context limits.
> Trigger at **85%** context usage to prevent auto-compact quality degradation.
>
> Inspired by [Robin Lorenz's Context Engineering approach](https://www.linkedin.com/posts/robin-lorenz-54055412a_claudecode-contextengineering-aiengineering-activity-7425136701515251713)

## Session: {{DATE}} — {{BRIEF_DESCRIPTION}}

**Project**: {{Project Name}}
**Context**: {{X%}} usage (recommended trigger: 85%)

---

## Current State

**What we were working on:**
{{One sentence describing the active task/goal}}

**Where we stopped:**
{{Specifically where — file, function, step}}

**State of the work:**
- [ ] Not started
- [ ] In progress — {{percentage or description}}
- [ ] Blocked on {{what}}
- [ ] Complete, needs review
- [ ] Complete and verified

**Files changed this session:**
- {{file1}} — {{what changed}}
- {{file2}} — {{what changed}}

---

## Decisions Made

| Decision | Reasoning | Confidence |
|----------|-----------|------------|
| {{Decision 1}} | {{Why}} | High/Medium/Low |

**Open questions (NOT decided):**
- {{Question 1 — unresolved}}

---

## What's Next

**Immediate next step:**
{{The very next action to take}}

**After that:**
1. {{Step 2}}
2. {{Step 3}}

**Blocked on:**
{{Anything needed before work can continue}}

---

## Context That Matters

**Architectural decisions:**
- {{Decision}} — {{rationale}}

**Constraints discovered:**
- {{Constraint — something we learned we can't/must do}}

**Patterns to follow:**
- {{Pattern — established approach to continue using}}

**Domain knowledge:**
- {{Business rule or edge case discovered}}

---

## Technical State

**Branch:** {{Current git branch}}
**Uncommitted changes:** Yes / No — {{details if yes}}
**Tests passing:** Yes / No / Not run — {{details if no}}
**Build status:** Passing / Failing / Unknown
**Dependencies changed:** Yes / No — {{details if yes}}

---

## Relationship Notes

**What I learned about {{human's name}}:**
- {{Preference, communication style, or value}}

**What worked / what to adjust:**
- {{Effective patterns or things to change}}

---

## Resume Checklist

1. [ ] Read this handoff document
2. [ ] Check files mentioned in "Files changed"
3. [ ] Verify technical state (tests, build)
4. [ ] Start with "Immediate next step"
5. [ ] Ask if anything changed since handoff

---

## Compaction Priorities

When compacting context mid-session, follow these priorities:

**Always Preserve:**
1. Decisions with reasoning
2. Code changes — file paths, what changed, the intent
3. Current task state and progress
4. Errors encountered and how resolved
5. User-provided constraints and preferences
6. Open questions

**Compress or Drop:**
1. Exploration dead ends — keep conclusion, drop journey
2. Verbose tool output — summarize, don't include raw
3. Intermediate reasoning — keep conclusions
4. Repeated operations — summarize patterns
5. Superseded info — drop things no longer true

---

## Session Stats

**Duration:** {{time}} | **Commits:** {{count}} | **Files touched:** {{count}}

**Major accomplishments:**
- {{Accomplishment 1}}
- {{Accomplishment 2}}

---

*Handoff created: {{TIMESTAMP}}*
