# Theming Architecture

Use this page as the routing layer for design-system theming.

## Load Order

| Need | Reference |
| --- | --- |
| token and CSS variable structure | `theme-token-architecture.md` |
| provider and toggle implementation | `theme-provider-and-toggle.md` |
| accessibility, SSR, and theme testing | `theme-accessibility-ssr-and-testing.md` |

## Core Rules

- theme values should flow from tokens, not one-off component overrides
- support light, dark, and brand variants without duplicating component code
- treat hydration and reduced-motion handling as first-class theming concerns
