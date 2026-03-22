---
description: "Scaffold a complete SKILL.md file from a name and brief description. Triggers on 'create a skill', 'new skill', 'scaffold a skill'."
argument-hint: "<skill-name> [brief description]"
---

# Create Skill

Generate a production-ready SKILL.md for a new skill.

## Context

Create a skill from: `$ARGUMENTS`

## Workflow

### 1. Parse Arguments

Extract the skill name (required) and optional description from the arguments. The skill name should be kebab-case. If only a name is given, infer the description from the name.

### 2. Draft Frontmatter

Write YAML frontmatter with:
- `name` matching the skill directory name (kebab-case)
- `description` as a complete sentence explaining what the skill does and when to trigger it, including specific scenarios, file types, or tasks

### 3. Write the Heading and Intro

Use the skill name as a title-cased heading. Follow with 1-2 sentences explaining what the skill enables. No filler headers like "Overview."

### 4. Write When to Use / When NOT to Use

`## When to Use` lists specific scenarios where this skill applies. Each item is a concrete trigger, not a vague category.

`## When NOT to Use` lists scenarios that seem related but fall outside scope. This prevents false activation.

### 5. Write Body Sections

Choose the structure that fits the skill's purpose:

Workflow-based (sequential processes): step-by-step sections numbered with headings. Best when the skill guides a process from start to finish.

Task-based (tool collections): separate sections per operation. Best when the skill offers distinct capabilities.

Reference/guidelines (standards): specification sections. Best for coding standards, brand guidelines, or requirements.

Capabilities-based (integrated systems): numbered feature list. Best for skills with interrelated features.

Most skills combine patterns. Include concrete examples, code samples where relevant, and decision trees for complex workflows.

### 6. Verify Against Quality Bar

Before outputting, check:
- Frontmatter `description` includes trigger scenarios
- `## When to Use` and `## When NOT to Use` are both present
- No `**bold label**:` patterns in body text
- No ` - ` (space-hyphen-space) mid-sentence
- No filler headers like "Key Features:", "Benefits:", "Overview:"
- No marketing language, emojis, or AI adjectives
- Imperative voice throughout (instructions to Claude, not advice to the user)
- Sections use plain-text labels; bold is reserved for emphasis on individual words only

### 7. Output

Emit the completed SKILL.md inside a fenced code block so the user can review before writing to disk. Include a note about which directory to place it in (`skills/<skill-name>/SKILL.md` or a plugin path).
