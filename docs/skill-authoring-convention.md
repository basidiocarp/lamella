# Skill Authoring Convention

A new skill file should be readable and usable in under 5 minutes. Follow this
convention for any skill authored against the Lamella format.

---

## Required sections (all skills)

### YAML frontmatter

Every `SKILL.md` must open with YAML frontmatter containing three required fields:

```yaml
---
name: skill-name
description: One-sentence description of what this skill does and when it fires.
origin: lamella
type: pipeline
---
```

Field rules:
- `name` — lowercase letters, numbers, and hyphens only; max 64 characters
- `description` — non-empty; max 1024 characters; third-person voice; includes
  both what the skill does and when to use it
- `origin` — always `lamella` for skills authored in this repo
- `type` — `reference` or `pipeline` (lowercase); **recommended** for all new skills
  - `reference` — always-loaded context; contributes to ambient context window; fires based on trigger conditions in `description`; may not have side effects
  - `pipeline` — invoked on demand by name; executes a workflow; may have side effects (file writes, tool calls, API calls)

### `## When to Activate`

State the trigger conditions clearly. A reader should be able to confirm in
one sentence whether this skill applies to their situation.

### `## How It Works`

Numbered phases. Each phase is one distinct action the agent takes. Keep
phases short and scannable. Aim for 3–7 phases for most skills.

---

## Skill Type (`type`)

The `type` field distinguishes two behavioral profiles:

**`reference`** skills provide background context. They are always loaded when
their trigger conditions match. They must not have side effects. Use `reference`
for architecture notes, team conventions, coding standards, or background context
that answers "what is this?" questions.

**`pipeline`** skills execute a workflow on demand. They are invoked explicitly
by name. They may write files, call APIs, or run tools. Use `pipeline` for
test-run workflows, commit helpers, format-and-lint sequences, or any skill that
"does something."

If you are unsure, `pipeline` is the safer default for new skills.

---

## Required for autonomous or long-running skills only

### `## Operating Contract`

Required when the skill runs a loop, manages retries, or can run without
further human input for more than a single turn. Include:

- **Loop invariants** — what must stay true throughout execution
- **Crash triage** — what to do on unrecoverable error
- **Timeout policy** — when to stop and report
- **NEVER STOP** — conditions under which the skill must continue regardless
  of obstacles

Remove this section entirely for simple one-shot skills.

---

## Optional

### `## Handoff Pointers`

Related skills, dependencies, or follow-up handoffs. Use when the skill is
commonly used in sequence or as a prerequisite.

---

## Validation

New skills authored in this repo are checked by `make lint-skills`. The check
scans for the required frontmatter fields and required sections. Skills
without `origin: lamella` in their frontmatter are skipped.

Run before committing:

```bash
make lint-skills
```
