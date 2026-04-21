---
name: tailwind-design-system
description: "Builds Tailwind CSS design systems with tokens and components."
origin: lamella
---

# Tailwind Design System (v4)

Use this skill when building a Tailwind v4 design system with semantic tokens, typed variants, and responsive component patterns. Keep the big implementation examples in the references.

## When to Use

- Creating a component library with Tailwind v4
- Migrating from Tailwind v3 configuration patterns
- Standardizing tokens, variants, and dark mode behavior
- Building responsive and accessible UI foundations

## Core Defaults

| v3 Pattern | v4 Pattern |
|------------|------------|
| `tailwind.config.ts` | CSS `@theme` |
| `@tailwind ...` directives | `@import "tailwindcss"` |
| class-based dark mode config | `@custom-variant dark` |
| ad hoc palette extension | semantic CSS tokens |

## Minimal Setup

```css
@import "tailwindcss";

@theme {
  --color-background: oklch(98% 0.01 260);
  --color-foreground: oklch(20% 0.02 260);
  --color-primary: oklch(55% 0.22 260);
}

@custom-variant dark (&:where(.dark, .dark *));
```

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## References

- [references/cva-components.md](references/cva-components.md)
- [references/form-layout-patterns.md](references/form-layout-patterns.md)
- [references/animations-theming.md](references/animations-theming.md)
- [references/advanced-patterns.md](references/advanced-patterns.md)
