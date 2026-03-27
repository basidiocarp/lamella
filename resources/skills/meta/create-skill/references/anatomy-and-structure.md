# Skill Anatomy and Structure

Every skill has a required `SKILL.md` and optional bundled resources.

## Minimal Shape

```text
skill-name/
├── SKILL.md
├── scripts/
├── references/
└── assets/
```

## `SKILL.md` Requirements

- frontmatter with `name` and `description`
- concise trigger guidance
- clear workflow or routing guidance
- references to bundled resources when relevant

## Resource Rules

- `scripts/`: executable helpers
- `references/`: load-on-demand docs
- `assets/`: output resources such as templates or media

Keep core instructions in `SKILL.md` and move detail into `references/`.
