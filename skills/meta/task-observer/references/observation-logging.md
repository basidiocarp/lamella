# Observation Logging Details

Detailed rules for logging observations, numbering, archival, and handoff docs.

## How to Log

Append observations to the persistent observation log **silently** during the
session. The user should not be interrupted by the logging process.

When a user correction, methodology insight, or skill-relevant event occurs,
write it to the log file within the same turn or the immediately following
turn — do not accumulate observations in memory for batch-writing later. The
act of writing is the enforcement mechanism; mental notes are not observations.

Tie observation flushing to existing workflow checkpoints — e.g., when marking
a TodoWrite item as completed, check whether any unlogged observations have
accumulated and write them before proceeding.

## Observation Numbering

**Before assigning any observation number, run a mandatory pre-logging step:**
Search the entire log file for all lines matching `### Observation \d+:`,
extract the highest observation number already in use, and increment from there.
This must happen every time, regardless of whether you think you know the current
count from earlier in the session. Never rely on session memory or summaries for
the next number. Always read the actual log file:

```bash
# GNU grep (Linux, Cowork):
grep -oP '### Observation \K\d+' log.md | sort -n | tail -1

# macOS / POSIX-compatible alternative:
grep -o '### Observation [0-9]*' log.md | grep -o '[0-9]*' | sort -n | tail -1
```

**Format and insertion rules:** Always use the `### Observation NNN:` format.
Always append to the END of the log file. Never insert mid-file. Never use
alternative ID formats. One format, one insertion point.

## Context Preservation

When logging an observation, verify that all information needed to act on it
is available in the shared folder. If the observation depends on uploaded
files, API responses, or session-local data, save that context to the
appropriate workspace location BEFORE logging. Add a `**Reference file:**`
line pointing to where the context lives. Observations that reference data
only available in the current session are incomplete.

## Handoff Doc Analysis

When a handoff doc arrives for observation logging:

1. **Log all explicitly stated observations first.**
2. **Then systematically analyse the full document.** Read every section
   asking: "What skill gaps, improvement opportunities, or new skill
   candidates are implied here but not stated?"
3. **Pay special attention to:**
   - Action items (each may imply a missing skill or workflow)
   - Open questions (unresolved ambiguity signals a decision framework gap)
   - The "work completed" narrative (patterns may reveal meta-skills)
   - Session notes (reflective insights about process)
4. **Log additional observations with clear attribution** — derived from
   handoff doc analysis, not the original session.

## Archival on Write

The log is kept lean through event-driven archival on every log write, not
periodic batch cleanup.

**"From a previous update"** means entries whose status was already resolved
in a *previous SESSION or prior log write*, not entries marked ACTIONED or
DECLINED in the current session.

Entries marked ACTIONED or DECLINED during the current session's weekly review
must NOT be archived during that same session. They earn one round of
visibility — archival happens on the NEXT session's log write.

**Archive location:**
```
[workspace]/skill-observations/archive/log-[date].md
```

**Safety Check:** Before moving any entry to the archive, verify it was NOT
marked ACTIONED or DECLINED in the current session. Track a set of entry IDs
resolved in the current session and exclude them from the archival pass.

## Log Location and Structure

Default path: `[workspace]/skill-observations/log.md`

```markdown
# Skill Observation Log

Observations captured during task-oriented work. Each entry identifies a
potential skill improvement or new skill opportunity.

**Status key:** OPEN = not yet actioned | ACTIONED = skill updated/created |
DECLINED = user decided not to pursue

---

## [Date or Session Identifier]

### Observation 1: [Title]
**Status:** OPEN
[... full observation format ...]
```

## Handoff Doc Mode (No Persistent Storage)

In environments without file system access, the skill shifts into handoff
doc mode:

- Observations are collected in-session and presented in a structured
  **handoff document** before the session ends
- User copies to their own storage and pastes into the next session
- Cross-cutting principles should be included

**Handoff doc format:**

```markdown
# Session Handoff: [Session Topic]

**Date:** [date]
**Context:** [what was worked on and what the next session needs to know]

// ... (11 lines trimmed)

## Working Artifacts
[any drafts, analyses, or intermediate work products in full]
```

Proactively offer a handoff doc when the conversation starts winding down —
don't wait for the user to request one.
