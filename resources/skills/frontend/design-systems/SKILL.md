---
name: design-systems
description: "Builds frontend design systems and visual foundations. Use when defining design tokens, theming, typography, color systems, spacing, iconography, or component-library standards."
---

# Design Systems


## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Capabilities](#core-capabilities)
  - [1. Design Tokens](#1-design-tokens)
  - [2. Theming Infrastructure](#2-theming-infrastructure)
  - [3. Component Architecture](#3-component-architecture)
  - [4. Token Pipeline](#4-token-pipeline)
- [Quick Start](#quick-start)
- [Key Patterns](#key-patterns)
  - [Pattern 1: Token Hierarchy](#pattern-1-token-hierarchy)
  - [Pattern 2: Theme Switching with React](#pattern-2-theme-switching-with-react)
  - [Pattern 3: Variant System with CVA](#pattern-3-variant-system-with-cva)
  - [Pattern 4: Style Dictionary Configuration](#pattern-4-style-dictionary-configuration)
- [Best Practices](#best-practices)
- [Common Issues](#common-issues)
- [Resources](#resources)


Master design system architecture to create consistent, maintainable, and scalable UI foundations across web and mobile applications.

## When to Use This Skill

- Creating design tokens for colors, typography, spacing, and shadows
- Implementing light/dark theme switching with CSS custom properties
- Building multi-brand theming systems
- Architecting component libraries with consistent APIs
- Establishing design-to-code workflows with Figma tokens
- Creating semantic token hierarchies (primitive, semantic, component)
- Setting up design system documentation and guidelines

## Core Capabilities

### 1. Design Tokens

- Primitive tokens (raw values: colors, sizes, fonts)
- Semantic tokens (contextual meaning: text-primary, surface-elevated)
- Component tokens (specific usage: button-bg, card-border)
- Token naming conventions and organization
- Multi-platform token generation (CSS, iOS, Android)

### 2. Theming Infrastructure

- CSS custom properties architecture
- Theme context providers in React
- Dynamic theme switching
- System preference detection (prefers-color-scheme)
- Persistent theme storage
- Reduced motion and high contrast modes

### 3. Component Architecture

- Compound component patterns
- Polymorphic components (as prop)
- Variant and size systems
- Slot-based composition
- Headless UI patterns
- Style props and responsive variants

### 4. Token Pipeline

- Figma to code synchronization
- Style Dictionary configuration
- Token transformation and formatting
- CI/CD integration for token updates

## Quick Start

```typescript
// Design tokens with CSS custom properties
const tokens = {
  colors: {
    // Primitive tokens
    gray: {
// ... (26 lines trimmed)
    },
  },
};
```

## Key Patterns

### Pattern 1: Token Hierarchy

```css
/* Layer 1: Primitive tokens (raw values) */
:root {
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --color-gray-50: #fafafa;
// ... (30 lines trimmed)
  --button-padding-x: var(--space-4);
  --button-padding-y: var(--space-2);
}
```

### Pattern 2: Theme Switching with React

```tsx
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
// ... (51 lines trimmed)
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
```

### Pattern 3: Variant System with CVA

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
// ... (40 lines trimmed)
    />
  );
}
```

### Pattern 4: Style Dictionary Configuration

```javascript
// style-dictionary.config.js
module.exports = {
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
// ... (43 lines trimmed)
    },
  },
};
```

## Best Practices

1. **Name Tokens by Purpose**: Use semantic names (text-primary) not visual descriptions (dark-gray)
2. **Maintain Token Hierarchy**: Primitives > Semantic > Component tokens
3. **Document Token Usage**: Include usage guidelines with token definitions
4. **Version Tokens**: Treat token changes as API changes with semver
5. **Test Theme Combinations**: Verify all themes work with all components
6. **Automate Token Pipeline**: CI/CD for Figma-to-code synchronization
7. **Provide Migration Paths**: Deprecate tokens gradually with clear alternatives

## Common Issues

- **Token Sprawl**: Too many tokens without clear hierarchy
- **Inconsistent Naming**: Mixed conventions (camelCase vs kebab-case)
- **Missing Dark Mode**: Tokens that don't adapt to theme changes
- **Hardcoded Values**: Using raw values instead of tokens
- **Circular References**: Tokens referencing each other in loops
- **Platform Gaps**: Tokens missing for some platforms (web but not mobile)

## Visual Design Foundations

For typography scales, color theory, spacing systems, and iconography principles, see [references/visual-foundations.md](references/visual-foundations.md).

**Additional visual design references:**
- [typography-systems.md](references/typography-systems.md) — Font scales, pairings, responsive typography
- [color-systems.md](references/color-systems.md) — Color theory, palette generation, accessibility
- [spacing-iconography.md](references/spacing-iconography.md) — Grid systems, spacing scales, icon design

## Resources

- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [Tokens Studio for Figma](https://tokens.studio/)
- [Design Tokens W3C Spec](https://design-tokens.github.io/community-group/format/)
- [Radix UI Themes](https://www.radix-ui.com/themes)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
### Additional Resources

- [Component Architecture](references/component-architecture.md)
- [Design Tokens](references/design-tokens.md)
- [Theming Architecture](references/theming-architecture.md)
