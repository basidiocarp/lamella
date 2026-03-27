# Spacing, Icon, and Sizing Tokens

Use this page as the routing layer for spacing, icon, and sizing token
decisions in the design system.

## Load Order

| Need | Reference |
| --- | --- |
| spacing scales, semantic spacing tokens, and layout rhythm | `spacing-systems.md` |
| icon size scales, icon buttons, sprites, and library choices | `icon-systems.md` |
| size tokens, aspect ratios, and radius scales | `sizing-and-radius.md` |

## Core Rules

- Align spacing and sizing scales to a small set of predictable increments.
- Treat icons as UI primitives with accessibility and hit-area rules, not only
  illustration assets.
- Keep component sizing tokens compatible with the same spacing system used for
  layout.

## Smells

- raw pixel values sprinkled through components
- icon buttons without explicit labels or touch-target sizing
- radius or sizing scales that drift away from the rest of the token system
