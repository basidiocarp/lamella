---
name: visual-design-foundations
description: Apply typography, color, spacing, and iconography fundamentals to
  create cohesive, accessible visual systems.
---

# Visual Design Foundations

Use this reference to define the core visual systems before styling individual
components.

## Core Systems

### Typography

Establish:
- a base body size
- a heading scale
- predictable line-height rules
- a readable measure for long-form text

Useful defaults:
- body text line height: `1.5` to `1.7`
- heading line height: `1.1` to `1.3`
- paragraph width: around `65ch`

### Spacing

Pick one spacing rhythm and use it consistently. An 8-point scale works well for
most interfaces.

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
}
```

### Color

Prefer semantic tokens over hard-coded palette use.

```css
:root {
  --color-primary: #2563eb;
  --color-surface: #ffffff;
  --color-text: #111827;
  --color-muted: #6b7280;
  --color-border: #e5e7eb;
}
```

This makes theming and accessibility review easier.

## Tailwind Token Setup

Expose tokens through the design system instead of scattering ad hoc utility
choices.

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
      },
      spacing: {
        6: "var(--space-6)",
        8: "var(--space-8)",
      },
    },
  },
};
```

## Accessibility Rules

- body text should meet at least WCAG AA contrast
- UI component boundaries need visible contrast too
- do not rely on color alone for state
- dark mode needs deliberate tokens, not inverted colors by accident

## Iconography

Treat icons as part of the system:
- define a small size scale
- keep stroke and optical weight consistent
- avoid mixing unrelated icon families
- pair icons with text where meaning could be ambiguous

## Common Failures

- too many unrelated font sizes
- spacing tuned component-by-component instead of by system
- palette values used directly without semantic meaning
- decorative icons that compete with content hierarchy
- dark mode added after the palette is already brittle

Visual foundations work best when the system is simple enough to repeat without
debate on every component.
