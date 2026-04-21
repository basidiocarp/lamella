---
name: skill-best-practices
description: "Applies Anthropic's official best practices for skill development."
metadata:
  argument-hint: Optional skill name or path to skill being reviewed
origin: lamella
---
# Anthropic's Official Skill Authoring Best Practices

Apply Anthropic's official skill authoring best practices to your skill.

Good Skills are concise, well-structured, and tested with real usage. This guide provides practical authoring decisions to help you write Skills that Claude can discover and use effectively.

## Table of Contents

- [Core Principles](#core-principles)
- [Skill Structure](#skill-structure)
- [Quick Reference](#quick-reference)
- [Checklist for Effective Skills](#checklist-for-effective-skills)

### Reference Files

| File | Description |
|------|-------------|
| [references/naming-and-descriptions.md](references/naming-and-descriptions.md) | Naming conventions and writing effective descriptions |
| [references/progressive-disclosure.md](references/progressive-disclosure.md) | Progressive disclosure patterns and file organization |
| [references/workflows-and-loops.md](references/workflows-and-loops.md) | Workflow examples and feedback loop patterns |
| [references/content-guidelines.md](references/content-guidelines.md) | Avoiding time-sensitive info, consistent terminology |
| [references/common-patterns.md](references/common-patterns.md) | Template and examples patterns |
| [references/evaluation-and-iteration.md](references/evaluation-and-iteration.md) | Testing, iteration, and Claude-assisted development |
| [references/anti-patterns.md](references/anti-patterns.md) | Common mistakes to avoid |
| [references/executable-code.md](references/executable-code.md) | Advanced: Skills with utility scripts |
| [references/technical-notes.md](references/technical-notes.md) | Runtime environment, MCP tools, YAML frontmatter |

---

## Core Principles

### Skill Metadata

At startup, only the metadata (name and description) from all Skills is pre-loaded. Claude reads SKILL.md only when the Skill becomes relevant, and reads additional files only as needed. Being concise in SKILL.md still matters: once Claude loads it, every token competes with conversation history and other context.

### Test with all models you plan to use

Skills act as additions to models, so effectiveness depends on the underlying model:

- **Claude Haiku** (fast, economical): Does the Skill provide enough guidance?
- **Claude Sonnet** (balanced): Is the Skill clear and efficient?
- **Claude Opus** (powerful reasoning): Does the Skill avoid over-explaining?

What works perfectly for Opus might need more detail for Haiku.

---

## Skill Structure

> **YAML Frontmatter**: The SKILL.md frontmatter supports two fields:
> - `name` - Human-readable name (64 characters max)
> - `description` - One-line description of what the Skill does and when to use it (1024 characters max)

### Key Structural Guidelines

1. **Use gerund form** for names: "Processing PDFs", "Analyzing spreadsheets"
2. **Write descriptions in third person**: "Processes Excel files..." not "I can help you..."
3. **Be specific** with key terms and triggers in descriptions
4. **Keep SKILL.md body under 500 lines** - split into reference files when approaching this limit
5. **Keep references one level deep** from SKILL.md

See [references/naming-and-descriptions.md](references/naming-and-descriptions.md) for detailed guidance.

### Directory Structure Example

```
my-skill/
├── SKILL.md              # Main instructions (<500 lines)
├── references/
│   ├── api-reference.md  # Detailed API docs
│   ├── examples.md       # Usage examples
│   └── troubleshooting.md
└── scripts/
    ├── validate.py       # Utility scripts
    └── process.py
```

See [references/progressive-disclosure.md](references/progressive-disclosure.md) for organization patterns.

---

## Quick Reference

### Description Template

```yaml
description: [Action verb] [what it does] from/with [input types]. Use when [specific triggers/contexts].
```

**Example**:
```yaml
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

### Workflow Template

```markdown
## [Task Name] Workflow

Copy this checklist and track your progress:

- [ ] Step 1: [First action]
- [ ] Step 2: [Second action]
- [ ] Step 3: [Validation step]
- [ ] Step 4: [Final action]

**Step 1: [First action]**
[Detailed instructions]

**Step 2: [Second action]**
[Detailed instructions]
```

See [references/workflows-and-loops.md](references/workflows-and-loops.md) for complete examples.

### Template Pattern (Strict)

````markdown
## Report structure

ALWAYS use this exact template structure:

```markdown
# [Analysis Title]

## Executive summary
[One-paragraph overview]

## Key findings
- Finding 1
- Finding 2

## Recommendations
1. Recommendation 1
2. Recommendation 2
```
````

See [references/common-patterns.md](references/common-patterns.md) for more patterns.

### Content Guidelines Summary

| Do | Don't |
|----|-------|
| Use consistent terminology | Mix terms ("field", "box", "element") |
| Put deprecated info in "old patterns" section | Include time-sensitive dates |
| Use forward slashes in paths | Use Windows-style backslashes |
| Provide one recommended approach | Offer too many options |

See [references/content-guidelines.md](references/content-guidelines.md) and [references/anti-patterns.md](references/anti-patterns.md).

---

## Checklist for Effective Skills

### Core Quality

- [ ] Description is specific and includes key terms
- [ ] Description includes both what the Skill does and when to use it
- [ ] SKILL.md body is under 500 lines
- [ ] Additional details are in separate files (if needed)
- [ ] No time-sensitive information (or in "old patterns" section)
- [ ] Consistent terminology throughout
- [ ] Examples are concrete, not abstract
- [ ] File references are one level deep
- [ ] Progressive disclosure used appropriately
- [ ] Workflows have clear steps

### Code and Scripts (if applicable)

- [ ] Scripts solve problems rather than punt to Claude
- [ ] Error handling is explicit and helpful
- [ ] No "voodoo constants" (all values justified)
- [ ] Required packages listed and verified as available
- [ ] Scripts have clear documentation
- [ ] No Windows-style paths (all forward slashes)
- [ ] Validation/verification steps for critical operations
- [ ] Feedback loops included for quality-critical tasks

See [references/executable-code.md](references/executable-code.md) for detailed guidance.

### Testing

- [ ] At least three evaluations created
- [ ] Tested with Haiku, Sonnet, and Opus
- [ ] Tested with real usage scenarios
- [ ] Team feedback incorporated (if applicable)

See [references/evaluation-and-iteration.md](references/evaluation-and-iteration.md) for evaluation-driven development.

---

## Development Workflow

1. **Identify gaps** - Run Claude on tasks without a Skill, document failures
2. **Create evaluations** - Build 3 scenarios testing those gaps
3. **Write minimal instructions** - Just enough to pass evaluations
4. **Test with Claude B** - Fresh instance with Skill loaded
5. **Iterate** - Refine based on observed behavior

See [references/evaluation-and-iteration.md](references/evaluation-and-iteration.md) for the complete Claude A/Claude B workflow.
