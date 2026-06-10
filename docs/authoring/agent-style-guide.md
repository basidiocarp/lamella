# Agent Markdown Style Guide

Standard template and voice rules for all agent `.md` files in lamella.

See also:
- [writing-specs-for-agents.md](writing-specs-for-agents.md) -- six core areas, three-tier boundaries, degrees of freedom, self-verification
- [best-practices.md](best-practices.md) -- Anthropic's official authoring guide (conciseness, progressive disclosure)
- [skills-spec.md](skills-spec.md) -- frontmatter validation rules

## Voice Rules

- **Second person, imperative.** Address the agent as "you."
  - Good: "You analyze code for performance bottlenecks."
  - Bad: "This agent analyzes code..." / "An expert system that..."
- **Cut filler.** No "ultra-specialized", "comprehensive", "elite", "expert in".
  The agent's capabilities come from its instructions, not adjectives.
- **One sentence per bullet.** No compound bullets.
- **Active voice only.** "Analyze the code" not "The code should be analyzed."
- **No capability lists.** The base model already knows tools, frameworks, and
  APIs. Only list what's non-obvious or project-specific.

## Description Field

- Start with an action verb in third person: "Analyzes...", "Reviews...",
  "Generates...", "Plans..."
- Include trigger keywords for when Claude should activate this agent.
- Max 1024 characters.
- Pattern: `[Action verb] [what it does]. Use when [trigger conditions].`

```yaml
# Good
description: Reviews code for quality, security, and performance issues. Use after implementing features or before commits.

# Bad
description: Ultra-specialized elite code quality agent with comprehensive review capabilities for enterprise-grade applications.
```

## Frontmatter Order

```yaml
---
name: kebab-case-name
description: Action verb first. Trigger conditions.
model: inherit | haiku | sonnet | opus
color: blue | cyan | green | yellow | magenta | red
tools: Read, Grep, Glob
disallowedTools: [Write, Edit, Bash, Agent]   # optional; read-only/report-only agents only
---
```

For read-only and report-only subagents, add `disallowedTools` with a list of prohibited tool names to enforce the read-only posture at runtime. The `tools` allowlist remains your primary constraint; `disallowedTools` is an additive denylist that blocks specific tools even if they appear in `tools`. Use this pattern for review agents and auditors that must not modify state: `disallowedTools: [Write, Edit, Bash, Agent]`.

## Body Structure

Every agent follows this skeleton. Omit sections that don't apply, but
keep the order.

```markdown
# [Agent Name]

[One sentence: what you do and how you differ from similar agents.]

## Scope

[What this agent covers vs. what to delegate elsewhere. Use a brief
"For X, use Y" pattern for related agents.]

## Workflow

1. **Step name**: What to do
2. **Step name**: What to do
3. ...

## Boundaries

- **Do**: [actions to take without asking]
- **Ask first**: [actions requiring confirmation]
- **Never**: [hard stops]

## Output Format

[Template or structure of what the agent produces.]
```

## Section Rules

| Section | Required | Max Lines | Notes |
|---------|----------|-----------|-------|
| Title + one-liner | Yes | 2 | `# Name` + one sentence |
| Scope | Yes | 5 | Differentiate from siblings |
| Workflow | Yes | 15 | Numbered steps, imperative |
| Boundaries | Recommended | 8 | Do / Ask first / Never |
| Output Format | Recommended | 15 | Template or bullet spec |
| Anti-patterns | Optional | 8 | Only if non-obvious |
| Model Rationale | Optional | 3 | Only if model != inherit |

## Size Targets

| Agent Type | Target Lines | Max Lines |
|------------|-------------|-----------|
| Focused executor | 40-60 | 80 |
| Reviewer/auditor | 60-100 | 150 |
| Architect/planner | 60-120 | 150 |
| Multi-mode agent | 80-150 | 200 |

Agents over 200 lines should split detail into referenced skills.

## Degrees of Freedom

Match instruction specificity to task fragility
(from [writing-specs-for-agents.md](writing-specs-for-agents.md)):

| Freedom | When | Example |
|---------|------|---------|
| **Low** (exact commands) | Fragile: migrations, crypto, destructive ops | "Run exactly this script" |
| **Medium** (pseudocode) | Preferred patterns, variation OK | "Use this template, customize" |
| **High** (heuristics) | Variable: review, exploration, docs | "Analyze and suggest" |

A single agent can mix levels. An audit agent uses high freedom for
discovery and low freedom for the severity classification table.

## What NOT to Include

- **Capability lists**: "Expert in AWS, Azure, GCP, Docker, Kubernetes..."
  The model already knows these. Only list project-specific tools or
  non-obvious constraints.
- **Purpose sections that repeat the description**: The description already
  says what the agent does.
- **Example interactions**: These belong in the description's `<example>`
  blocks, not the body.
- **Framework/tool documentation**: Reference a skill or external doc instead.
- **Verbose code examples**: One short example max. Link to skills for more.

## Color Scheme

| Color | Meaning | Categories |
|-------|---------|------------|
| blue | Architecture, planning, infrastructure | architecture, planning, business, devops (infra), data (infra), languages, frontend (dev) |
| cyan | Analysis, research, exploration | analysis, research, ai-ml, devops (observability) |
| green | Testing, quality, implementation | testing, code-quality (non-audit), teams (builders) |
| yellow | Audit, review, validation | auditors, meta reviewers, validators |
| magenta | Creation, writing, generation | content, documentation, meta (creators), frontend (design) |
| red | Security, debugging, incidents | security, debugging, devops (SRE) |
