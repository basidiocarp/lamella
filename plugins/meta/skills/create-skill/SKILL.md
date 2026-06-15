---
name: create-skill
description: "Guides effective skill creation."
origin: lamella
---

# Create Skill Command

## Contents

- [Overview](#overview)
- [What is a Skill?](#what-is-a-skill)
- [When to Create a Skill](#when-to-create-a-skill)
- [Skill Types](#skill-types)
- [Directory Structure](#directory-structure)
- [SKILL.md Template](#skillmd-template)
- [Quick Workflow](#quick-workflow)
- [Skill Creation Checklist](#skill-creation-checklist)
- [The Bottom Line](#the-bottom-line)
- [Reference Files](#reference-files)

## Overview

**Writing skills IS Test-Driven Development applied to process documentation.**

You write test cases (pressure scenarios with subagents), watch them fail (baseline behavior), write the skill (documentation), watch tests pass (agents comply), and refactor (close loopholes).

**Core principle:** If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing.

**REQUIRED BACKGROUND:** understand Test-Driven Development before using this skill. That skill defines the fundamental RED-GREEN-REFACTOR cycle. This skill adapts TDD to documentation.

**Personal skills location:** `~/.claude/skills` for Claude Code, `~/.codex/skills` for Codex

## What is a Skill?

A **skill** is a reference guide for proven techniques, patterns, or tools. Skills help future Claude instances find and apply effective approaches.

**Skills are:** Reusable techniques, patterns, tools, reference guides

**Skills are NOT:** Narratives about how you solved a problem once

### What Skills Provide

1. **Specialized workflows** - Multi-step procedures for specific domains
2. **Tool integrations** - Instructions for working with specific file formats or APIs
3. **Domain expertise** - Company-specific knowledge, schemas, business logic
4. **Bundled resources** - Scripts, references, and assets for complex tasks

## When to Create a Skill

**Create when:**

- Technique wasn't intuitively obvious to you
- You'd reference this again across projects
- Pattern applies broadly (not project-specific)
- Others would benefit

**Don't create for:**

- One-off solutions
- Standard practices well-documented elsewhere
- Project-specific conventions (put in CLAUDE.md)

### Before creating: check for overlap

Before writing a new skill, scan the existing catalog (search skill names and `description` fields for the technique, the tool, and the problem) and classify what you find:

- **Full overlap** — existing skill already covers this → **reuse** it; do not create.
- **Partial overlap, generalizable** — existing skill is close and could absorb this *without blurring its single responsibility* → **extend** the existing skill. If absorbing this would make that skill vague or grab-bag, do not extend — treat it as specialization below.
- **Intentional specialization** — overlap exists but a distinct, narrower skill is warranted *and still meets the "Create when" bar above* (broadly reusable, not a one-off) → **create new**, and note how it differs in its `description`.
- **No overlap** — nothing covers this → **create new**.

The bias runs both ways: don't extend a focused skill into a grab-bag, and don't spin off a narrow skill that has no reuse value on its own.

## Skill Types

| Type | Description | Examples |
|------|-------------|----------|
| **Technique** | Concrete method with steps | condition-based-waiting, root-cause-tracing |
| **Pattern** | Way of thinking about problems | flatten-with-flags, test-invariants |
| **Reference** | API docs, syntax guides | office docs, tool documentation |

## Directory Structure

```
skills/
  skill-name/
    SKILL.md              # Main reference (required)
    scripts/              # Executable code (optional)
    references/           # Documentation loaded on demand (optional)
    assets/               # Files used in output (optional)
```

**Flat namespace** - all skills searchable. Keep inline unless heavy reference (100+ lines) or reusable tools needed.

## SKILL.md Template

```markdown
---
name: skill-name-with-hyphens
description: Use when [specific triggers and symptoms] - [what the skill does, third person]
---

## Purpose
State what the skill helps Claude do and what it should not try to cover.

## When to Use
- Trigger 1
- Trigger 2

## Workflow
1. Triage the task.
2. Read the minimum supporting references.
3. Execute or explain the task in the intended order.

## References
- Point to adjacent `references/`, `assets/`, or `scripts/` only when needed.

## Common Mistakes
What goes wrong + fixes.
```

**Frontmatter Rules:**
- Only `name` and `description` fields supported
- Max 1024 characters total
- `name`: letters, numbers, hyphens only (no special chars)
- `description`: Start with "Use when...", third person, include triggers

## Quick Workflow

1. **RED:** Run pressure scenarios WITHOUT skill, document baseline failures/rationalizations
2. **GREEN:** Write minimal skill addressing those specific failures
3. **REFACTOR:** Find new loopholes → add explicit counters → re-test

**Key insight:** see what agents naturally fail at BEFORE writing the skill.

## Skill Creation Checklist

**Use TodoWrite to track each item.**

### RED Phase - Baseline Testing

- [ ] Create pressure scenarios (3+ combined pressures for discipline skills)
- [ ] Run scenarios WITHOUT skill - document baseline behavior verbatim
- [ ] Identify patterns in rationalizations/failures

### GREEN Phase - Write Skill

- [ ] Name uses only letters, numbers, hyphens
- [ ] YAML frontmatter with only name and description (max 1024 chars)
- [ ] Description starts with "Use when..." in third person
- [ ] Clear overview with core principle
- [ ] Address specific baseline failures
- [ ] One excellent code example (not multi-language)
- [ ] Run scenarios WITH skill - verify compliance

### REFACTOR Phase - Close Loopholes

- [ ] Identify NEW rationalizations from testing
- [ ] Add explicit counters (if discipline skill)
- [ ] Build rationalization table
- [ ] Create red flags list
- [ ] Re-test until bulletproof

### Quality & Deploy

- [ ] Small flowchart only if decision non-obvious
- [ ] Quick reference table included
- [ ] Common mistakes section
- [ ] No narrative storytelling
- [ ] Commit and push

## The Bottom Line

**Creating skills IS TDD for process documentation.**

Same Iron Law: No skill without failing test first.
Same cycle: RED (baseline) → GREEN (write skill) → REFACTOR (close loopholes).
Same benefits: Better quality, fewer surprises, bulletproof results.

If you follow TDD for code, follow it for skills. It's the same discipline applied to documentation.

---

## Reference Files

Detailed documentation for specific aspects of skill creation:

| Reference | Contents |
|-----------|----------|
| [references/anatomy-and-structure.md](references/anatomy-and-structure.md) | Detailed skill anatomy, SKILL.md structure, bundled resources (scripts/references/assets), progressive disclosure, file organization patterns |
| [references/tdd-methodology.md](references/tdd-methodology.md) | TDD mapping, testing all skill types, RED-GREEN-REFACTOR cycle, bulletproofing against rationalization, loophole closing |
| [references/cso-and-discovery.md](references/cso-and-discovery.md) | Claude Search Optimization, rich descriptions, keyword coverage, naming conventions, token efficiency, cross-referencing, discovery workflow |
| [references/creation-process.md](references/creation-process.md) | Step-by-step creation process: understanding with examples, planning contents, creating directory, editing, validating, iterating |
| [references/examples-and-anti-patterns.md](references/examples-and-anti-patterns.md) | Code example guidelines, flowchart usage rules, anti-patterns to avoid (narrative examples, multi-language dilution, generic labels) |
