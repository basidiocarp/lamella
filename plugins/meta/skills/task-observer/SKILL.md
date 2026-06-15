---
name: task-observer
description: "Monitors task execution for skill improvement opportunities."
origin: lamella
---

# Task Observer — Continuous Skill Discovery & Improvement

*Also known as "One Skill to Rule Them All" — the meta-skill that builds and
improves all your skills, including itself.*

A persistent behavioral layer for identifying skill creation and improvement
opportunities during task-oriented work. It doesn't replace the skill-creator
— it feeds it. Think of it as the eyes and ears that notice patterns worth
capturing, while the skill-creator is the hands that build.

**Licence:** CC BY 4.0 — free to share and adapt with attribution.

**Reference Files:**
- [references/observation-logging.md](references/observation-logging.md) — Detailed logging rules, numbering, handoff docs, archival
- [references/weekly-review.md](references/weekly-review.md) — Full weekly review process (Steps 0-8)
- [references/principle-propagation.md](references/principle-propagation.md) — Cross-cutting principles and propagation timing
- [references/skill-taxonomy.md](references/skill-taxonomy.md) — Open-source vs internal, licensing, confidentiality safeguards
- [references/delivering-updates.md](references/delivering-updates.md) — Delivery process and action list format

---

## Quick Start

1. **Install the skill.** Add task-observer to your skills directory.
2. **Add the activation line** to CLAUDE.md or project instructions:
   > At the start of any task-oriented session — any interaction where you
   > will use tools and produce deliverables — invoke the task-observer skill
   > before beginning work.
3. **Do a real task.** Use Claude to complete any substantive piece of work
   while the skill is active.
4. **See your first observation.** At the end of the session, the skill
   surfaces any observations it logged.

No pre-setup or configuration files needed. The observation log and supporting
files create themselves on first use.

---

## Session Start Protocol

Run at the start of each task-oriented session:

1. **Check files exist.** Create observation log and cross-cutting principles
   file if missing (first-time setup).
2. **Scan for relevant context.** Read OPEN observations and active principles.
   Hold in awareness — don't surface unless relevant to current task.
3. **Check weekly review trigger.** Read timestamp in
   `[workspace]/skill-observations/last-review-date.txt`. If >7 days or
   missing, trigger the [Weekly Review](references/weekly-review.md).
4. **Check configuration file.** Verify activation instruction exists in
   CLAUDE.md or equivalent (once per session).

---

## Observation Protocol

### When to Observe

Active throughout the **entire task session** — from first tool use through
post-task feedback until session end:

- **Active task execution** — creating documents, writing code, building
  presentations, similar substantive work
- **Post-task feedback** — user reviews output, provides corrections, suggests
  improvements. Often the highest-signal input.
- **Meta-discussion** — conversation about how work was done, what could
  improve, how skills should be structured
- **Reflective conversations** — strategy sessions, planning, post-work
  reflections

**NOT active** during casual conversation, quick factual questions, or
non-task interactions.

### What to Watch For

**Signals for a NEW skill:**
- Multi-step workflow reusable across projects
- Methodology the user explains that isn't captured in any existing skill
- Recurring task type with similar structure and steps
- Domain-specific process with clear inputs, phases, and outputs
- User describing a refined process ("I always do it this way...")

**Signals for IMPROVING an existing skill:**
- Claude doesn't follow a skill's rules despite documentation
- User corrections revealing missing rules or edge cases
- Skill's recommended workflow less efficient than what emerged naturally
- Technique that works well and deserves explicit recommendation
- New use case the skill handles but doesn't document

**Signals for SIMPLIFYING:**
- Skill section never relevant across multiple sessions
- Rules added from single observation never validated by recurrence
- Elaborate workflows users consistently shortcut or skip
- Sections Claude loads but never acts on (dead context weight)

**Signals to NOT log:**
- One-off corrections that don't generalise
- User preferences already captured in an existing skill
- Tool bugs or temporary issues unrelated to methodology

### Observation Format

```markdown
### Observation [N]: [Short descriptive title]

**Date:** [date]
**Session context:** [brief description of current task]
**Skill:** [existing skill name, or "New skill candidate: [working name]"]
**Trigger:** [what happened that exposed the gap]
**Observation:** [what Claude did or failed to do]
**Evidence:** [specific command, artifact, or user correction]
**Actionable pattern:** [what should be done differently next time]

**Principle:** [Generalisable takeaway — why this matters beyond this
instance. The most important part.]
```

Log silently — do not interrupt the user. See
[references/observation-logging.md](references/observation-logging.md)
for numbering, archival, and handoff doc rules.

---

## Surfacing Protocol

### Default Cadence

Surface all observations at end of session — grouped by skill, with new
skill candidates listed separately.

### Surface Earlier When

- Observation requires user input to be complete
- Observation reveals a skill actively producing wrong output
- Multiple observations cluster around the same skill

### How to Surface

- Present concisely: title, skill, one-sentence summary
- Indicate new skill candidate vs improvement to existing skill
- Indicate suggested type (open-source or internal)
- Ask user which (if any) to act on

---

## Acting on Observations

### Small Improvements (Apply Directly)

Clearly additive, low-risk, no testing needed:
- Adding a new rule or anti-pattern to an existing list
- Clarifying ambiguous existing wording
- Adding a note or edge case
- Fixing a factual error

### Substantial Changes

Requires verification — hand off to skill-creator if available:
- Restructuring phases or workflows
- Adding new capabilities or sections
- Changing core methodology

Without skill-creator, use observations as specification and make changes
directly, flagging them for user review.

---

## The Pre-Flight Principle

Every skill with explicit rules should include a verification step where
Claude re-reads the rules and checks output before delivery. A 30-second
re-read prevents a 30-minute rework cycle.

When creating or improving any skill: "Does this skill have rules? Does it
have a mechanism to enforce them?" If no enforcement mechanism, add one.

### General Debugging Principle

When debugging, always ask: is this a single instance or a pattern? If an
error reveals a pattern, fix the class, not just the instance. Audit the
full scope on first encounter.

---

## Self-Enforcement

Before surfacing observations, verify:

1. Were observations logged throughout the full session (including feedback
   and reflective phases)?
2. Were observations logged silently?
3. Does each follow the format (Issue → Suggested improvement → Principle)?
4. Correct type tagging (open-source or internal)?
5. For existing skills, does improvement reference specific section?
6. For open-source observations, is the Principle field free of identifying
   information?

---

## Quick Reference

| Question | Answer |
|----------|--------|
| When to observe? | Full task session including post-task feedback |
| How to log? | Silently append immediately; don't batch |
| When to surface? | End of session, or earlier if needed |
| Open-source or internal? | Default to open-source |
| Small fix or skill-creator? | Needs testing → skill-creator. Additive → apply directly |
| Format? | Issue → Suggested improvement → Principle |
| Cross-cutting principle? | Add to principles file, enforce during regeneration |
| No persistent storage? | Handoff doc mode — see [observation-logging.md](references/observation-logging.md) |
| Observation numbering? | Mandatory pre-logging search; never use cached numbers |
| Log archival? | Event-driven — resolved entries archived on next write |
| Weekly review? | Auto-triggers after 7 days — see [weekly-review.md](references/weekly-review.md) |
