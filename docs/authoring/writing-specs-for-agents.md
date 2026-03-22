# Writing Specs for AI Agents

Applies directly to writing skills, agent prompts, and commands in lamella.

## Core Insight

Massive specs overwhelm models and waste context. Write "smart specs" that
guide agents clearly while staying within practical limits. Break large tasks
into smaller ones. Plan first, then execute.

## The Six Core Areas

Every spec (skill, agent prompt, or command) should cover the areas relevant
to its scope. From GitHub's analysis of 2,500+ agent config files:

| Area                  | What to Include                                        |
|-----------------------|--------------------------------------------------------|
| **Commands**          | Executable commands with flags, early in the doc       |
| **Testing**           | How to run tests, framework, file locations, coverage  |
| **Project Structure** | Where source, tests, and docs live                     |
| **Code Style**        | One real snippet beats three paragraphs of description |
| **Git Workflow**      | Branch naming, commit format, PR requirements          |
| **Boundaries**        | What the agent should never touch                      |

## Three-Tier Boundary System

The most effective specs use three tiers, not a flat rule list:

- **Always Do** -- actions the agent takes without asking
  (run tests, follow naming conventions, log errors)
- **Ask First** -- actions requiring human approval
  (schema changes, new dependencies, CI/CD config)
- **Never Do** -- hard stops
  (commit secrets, edit vendor dirs, remove failing tests without approval)

## The Curse of Instructions

Research shows that as you pile on more instructions, model performance in
adhering to each one drops. Even top models struggle when satisfying many
requirements simultaneously.

**Implications for skill authors:**

- Keep SKILL.md under 500 lines
- Move detail into `references/` files (progressive disclosure)
- Each section should focus on one concern
- If presenting rules as a list, keep to 5-7 items max per list

## Modular Context, Not Monolithic Prompts

Give agents one focused task at a time:

- Split specs into phases or components (separate files or sections)
- Don't feed frontend spec when working on backend
- Use sub-agents with relevant slice of spec each
- Refresh context per major task -- don't carry stale information

### Extended TOC / Summaries for Large Specs

For skills with heavy reference material:

1. Have the main SKILL.md contain a summary with section references
2. Detailed content goes in `references/*.md`
3. Agent consults summary, loads reference only when needed
4. This is exactly the progressive disclosure pattern

## Self-Verification

Build checks into the spec itself:

- "After implementing, compare result with spec and confirm all
  requirements are met"
- "List any spec items not addressed"
- Include conformance criteria in a Success Criteria section
- Use tests to clarify requirements (TDD approach)

### LLM-as-Judge for Subjective Checks

For criteria hard to test automatically (style, readability, architecture):

- Second agent reviews first agent's output against quality guidelines
- Useful for skill audits (see `skill-stocktake`)

## Degrees of Freedom

Match specificity to task fragility:

| Freedom Level                    | When to Use                                                 | Example                                   |
|----------------------------------|-------------------------------------------------------------|-------------------------------------------|
| **Low** (exact commands)         | Fragile operations: migrations, crypto, destructive actions | "Run exactly this script"                 |
| **Medium** (pseudocode + params) | Preferred patterns where variation is OK                    | "Use this template, customize as needed"  |
| **High** (heuristics)            | Variable tasks: review, exploration, docs                   | "Analyze structure, suggest improvements" |

A single skill can mix freedom levels. Security audit: high freedom for
discovery, low freedom for severity classification.

## Spec as Living Document

- Update when decisions are made or requirements change
- Re-sync agents with changes explicitly
- Keep version-controlled (commit the spec)
- Spec remains single source of truth

## Common Pitfalls

| Pitfall                                 | Fix                                                      |
|-----------------------------------------|----------------------------------------------------------|
| Vague prompts ("make it work")          | Be specific about inputs, outputs, constraints           |
| Dumping 50 pages into prompt            | Use hierarchical summaries or progressive disclosure     |
| Skipping human review                   | Always review critical paths -- passing tests != correct |
| Conflating prototyping with production  | Know which mode you're in                                |
| Ignoring speed + non-determinism + cost | Don't let agent speed outpace your ability to verify     |
| Missing the six core areas              | Use the checklist before handing off                     |

## Applying This to Lamella

### Skills

- SKILL.md = the spec. Keep it focused, structured, under 500 lines.
- Use `references/` for detail (progressive disclosure = modular context).
- Include a Success Criteria section with verifiable checks.
- Set degrees of freedom per phase.

### Agents

- System prompt = the spec for agent behavior.
- Include the three-tier boundary system (Always/Ask/Never).
- Define output format explicitly.
- Keep under 10,000 characters.

### Commands

- Commands are micro-specs. Keep them directive and focused.
- Include inline context only for what's needed right now.
- Use `@file` references to pull in relevant sections on demand.

### Plugin Design

- Each plugin is a collection of specs (skills + agents + hooks).
- Plugin manifest = the organizational spec.
- Use `categorizing-skills.md` decision tree to place content correctly.
