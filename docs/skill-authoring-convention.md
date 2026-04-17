# Skill Authoring Convention

A new skill file should be readable and usable in under 5 minutes. Follow this
convention for any skill authored against the Lamella format.

---

## Required sections (all skills)

### YAML frontmatter

Every `SKILL.md` must open with YAML frontmatter containing three fields:

```yaml
---
name: skill-name
description: One-sentence description of what this skill does and when it fires.
origin: lamella
---
```

Field rules:
- `name` — lowercase letters, numbers, and hyphens only; max 64 characters
- `description` — non-empty; max 1024 characters; third-person voice; includes
  both what the skill does and when to use it
- `origin` — always `lamella` for skills authored in this repo

### `## When to Activate`

State the trigger conditions clearly. A reader should be able to confirm in
one sentence whether this skill applies to their situation.

### `## How It Works`

Numbered phases. Each phase is one distinct action the agent takes. Keep
phases short and scannable. Aim for 3–7 phases for most skills.

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
