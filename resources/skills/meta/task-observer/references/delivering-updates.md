# Delivering Updates

How to present skill updates and new skills to the user after a weekly review
or ad-hoc improvement session.

## Delivery Process

After applying updates during a weekly review:

1. Save new or modified skill files to the appropriate workspace location
   following the project's directory structure.
2. Verify each file is syntactically valid and follows the SKILL.md template.
3. Present the user with an action list summarising all changes.

## Action List Format

```markdown
# Skill Update Delivery

**Date:** [date]
**Review type:** Weekly review | Ad-hoc update

## Changes Made

### Updated Skills
| Skill | File | Change Summary |
|-------|------|----------------|
| [name] | [path] | [what changed] |

### New Skills
| Skill | File | Purpose |
|-------|------|---------|
| [name] | [path] | [one-line description] |

## Observations Applied
- Observation [N]: [title] → applied to [skill-name]
- Observation [M]: [title] → applied to [skill-name]

## Observations Skipped
- Observation [X]: [title] → [reason for skipping]

## No Changes Needed
- Observation [Y]: [title] → [reason no change was required]
```

## Best Practices

- Keep the action list concise. The user should be able to scan it in under
  a minute.
- Group related changes together.
- For each updated skill, include a one-line diff summary so the user can
  decide whether to review the full change.
- If a change is large (>20 lines modified), flag it for explicit user
  review before finalising.
- Never commit or deploy changes without user confirmation — the action list
  is a proposal, not a fait accompli.
