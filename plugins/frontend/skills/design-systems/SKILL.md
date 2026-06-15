---
name: design-systems
description: "Builds frontend design systems and visual foundations."
origin: lamella
---

# Design Systems

Use this skill when shaping a UI system that needs consistent tokens, theming, and component standards. Keep the main skill focused on system boundaries and token strategy; use the references for specific implementation patterns.

## When to Use

- Defining design tokens or semantic color systems
- Building theme infrastructure or multi-brand theming
- Standardizing typography, spacing, radius, or icon rules
- Reviewing whether a component library is acting like a real design system

## Core Rules

1. Separate primitive, semantic, and component tokens.
2. Treat token changes as an API surface, not incidental CSS edits.
3. Keep themes accessible across contrast, motion, and SSR contexts.
4. Let component APIs consume system tokens instead of inventing local design languages.

## Core Workflow

1. Define token categories and naming.
2. Build theme architecture and switching behavior.
3. Standardize component composition and variant rules.
4. Add governance, testing, and platform output only after the token model is stable.

## References

- [references/design-tokens.md](references/design-tokens.md)
- [references/token-categories-and-naming.md](references/token-categories-and-naming.md)
- [references/theme-token-architecture.md](references/theme-token-architecture.md)
- [references/theme-provider-and-toggle.md](references/theme-provider-and-toggle.md)
- [references/theming-architecture.md](references/theming-architecture.md)
- [references/theme-accessibility-ssr-and-testing.md](references/theme-accessibility-ssr-and-testing.md)
- [references/typography-systems.md](references/typography-systems.md)
- [references/color-systems.md](references/color-systems.md)
- [references/spacing-iconography.md](references/spacing-iconography.md)
- [references/component-architecture.md](references/component-architecture.md)
- [references/variants-and-composition.md](references/variants-and-composition.md)
