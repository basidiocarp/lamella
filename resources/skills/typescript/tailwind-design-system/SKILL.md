---
name: tailwind-design-system
description: Builds scalable design systems with Tailwind CSS v4, design tokens, component libraries, and responsive patterns. Use when creating component libraries, implementing design systems, or standardizing UI patterns.
---

# Tailwind Design System (v4)

Build production-ready design systems with Tailwind CSS v4, including CSS-first configuration, design tokens, component variants, responsive patterns, and accessibility.

> **Note**: This skill targets Tailwind CSS v4 (2024+). For v3 projects, refer to the [upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Key v4 Changes](#key-v4-changes)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Best Practices](#best-practices)
- [Resources](#resources)

**Reference Files:**
- [references/cva-components.md](references/cva-components.md) — CVA patterns, compound components, utilities
- [references/form-layout-patterns.md](references/form-layout-patterns.md) — Form components, responsive grid system
- [references/animations-theming.md](references/animations-theming.md) — Native CSS animations, dark mode theming
- [references/advanced-patterns.md](references/advanced-patterns.md) — Custom utilities, theme modifiers, migration checklist

## When to Use This Skill

- Creating a component library with Tailwind v4
- Implementing design tokens and theming with CSS-first configuration
- Building responsive and accessible components
- Standardizing UI patterns across a codebase
- Migrating from Tailwind v3 to v4
- Setting up dark mode with native CSS features

## Key v4 Changes

| v3 Pattern                            | v4 Pattern                                                            |
| ------------------------------------- | --------------------------------------------------------------------- |
| `tailwind.config.ts`                  | `@theme` in CSS                                                       |
| `@tailwind base/components/utilities` | `@import "tailwindcss"`                                               |
| `darkMode: "class"`                   | `@custom-variant dark (&:where(.dark, .dark *))`                      |
| `theme.extend.colors`                 | `@theme { --color-*: value }`                                         |
| `require("tailwindcss-animate")`      | CSS `@keyframes` in `@theme` + `@starting-style` for entry animations |

## Quick Start

```css
/* app.css - Tailwind v4 CSS-first configuration */
@import "tailwindcss";

@theme {
  /* Semantic color tokens using OKLCH */
// ... (45 lines trimmed)
  * { @apply border-border; }
  body { @apply bg-background text-foreground antialiased; }
}
```

## Core Concepts

### Design Token Hierarchy

```
Brand Tokens (abstract)
    └── Semantic Tokens (purpose)
        └── Component Tokens (specific)

Example: oklch(45% 0.2 260) → --color-primary → bg-primary
```

### Component Architecture

```
Base styles → Variants → Sizes → States → Overrides
```

### Essential Utility

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Best Practices

### Do's

- **Use `@theme` blocks** — CSS-first configuration is v4's core pattern
- **Use OKLCH colors** — Better perceptual uniformity than HSL
- **Compose with CVA** — Type-safe variants ([see examples](references/cva-components.md))
- **Use semantic tokens** — `bg-primary` not `bg-blue-500`
- **Use `size-*`** — New shorthand for `w-* h-*`
- **Add accessibility** — ARIA attributes, focus states

### Don'ts

- **Don't use `tailwind.config.ts`** — Use CSS `@theme` instead
- **Don't use `@tailwind` directives** — Use `@import "tailwindcss"`
- **Don't use `forwardRef`** — React 19 passes ref as prop
- **Don't use arbitrary values** — Extend `@theme` instead
- **Don't hardcode colors** — Use semantic tokens
- **Don't forget dark mode** — Test both themes

## Migration Checklist (v3 → v4)

- [ ] Replace `tailwind.config.ts` with CSS `@theme` block
- [ ] Change `@tailwind base/components/utilities` to `@import "tailwindcss"`
- [ ] Move color definitions to `@theme { --color-*: value }`
- [ ] Replace `darkMode: "class"` with `@custom-variant dark`
- [ ] Move `@keyframes` inside `@theme` blocks
- [ ] Update `h-10 w-10` to `size-10`
- [ ] Remove `forwardRef` (React 19)

See [references/advanced-patterns.md](references/advanced-patterns.md) for full migration details.

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Tailwind v4 Beta Announcement](https://tailwindcss.com/blog/tailwindcss-v4-beta)
- [CVA Documentation](https://cva.style/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix Primitives](https://www.radix-ui.com/primitives)
