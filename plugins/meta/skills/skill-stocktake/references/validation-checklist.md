# Skill Validation Checklist

Use this checklist when importing or reviewing a single skill before running the broader stocktake.

## Required checks

- `SKILL.md` exists and uses valid frontmatter
- `name` is lowercase kebab-case
- `description` is present, specific, and written in third person
- `SKILL.md` body stays concise and offloads detail to `references/` when needed
- local Markdown links resolve
- bundled Python scripts compile
- example commands match the files that actually ship with the skill

## Useful warnings

- `SKILL.md` is drifting above 500 lines
- the description does not say when to use the skill
- references or assets exist but are never linked from `SKILL.md`
- scripts have no `--help` output or exit unexpectedly on `--help`
- the skill carries source-repo assumptions that do not map to Lamella

## Import review questions

- Should this become a new Lamella skill or merge into an existing one?
- What support files actually add value here?
- What source-specific rules should be dropped instead of preserved?
- Does the skill need PowerShell or shell-neutral guidance?
- What handoff note should be added to nearby Lamella skills, if any?
