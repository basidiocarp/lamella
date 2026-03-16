# Theming Architecture

## Overview

A robust theming system enables applications to support multiple visual appearances (light/dark modes, brand themes) while maintaining consistency and developer experience.

## CSS Custom Properties Architecture

### Base Setup

```css
/* 1. Define the token contract */
:root {
  /* Color scheme */
  color-scheme: light dark;

// ... (70 lines trimmed)
    /* ... other dark values */
  }
}
```

### Using Tokens in Components

```css
.card {
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-sm);
// ... (21 lines trimmed)
.button-primary:hover {
  background: var(--color-accent-hover);
}
```

## React Theme Provider

### Complete Implementation

```tsx
// theme-provider.tsx
import * as React from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";
// ... (139 lines trimmed)
  }
  return context;
}
```

### Theme Toggle Component

```tsx
// theme-toggle.tsx
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
// ... (31 lines trimmed)
    </div>
  );
}
```

## Multi-Brand Theming

### Brand Token Structure

```css
/* Brand A - Corporate Blue */
[data-brand="corporate"] {
  --brand-primary: #0066cc;
  --brand-primary-hover: #0052a3;
  --brand-secondary: #f0f7ff;
// ... (33 lines trimmed)
  --brand-radius: 0;
  --brand-shadow: none;
}
```

## Accessibility Considerations

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  :root {
    --color-text: #000000;
    --color-text-muted: #000000;
    --color-bg: #ffffff;
// ... (9 lines trimmed)
    --color-accent: #ffff00;
  }
}
```

### Forced Colors

```css
@media (forced-colors: active) {
  .button {
    border: 2px solid currentColor;
  }

  .card {
    border: 1px solid CanvasText;
  }

  .link {
    text-decoration: underline;
  }
}
```

## Server-Side Rendering

### Preventing Flash of Unstyled Content

```tsx
// Inline script to prevent FOUC
const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme') || 'system';
    const isDark = theme === 'dark' ||
// ... (21 lines trimmed)
    </html>
  );
}
```

## Testing Themes

```tsx
// theme.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./theme-provider";

// ... (33 lines trimmed)
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});
```

## Resources

- [Web.dev: prefers-color-scheme](https://web.dev/prefers-color-scheme/)
- [CSS Color Scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Radix UI Colors](https://www.radix-ui.com/colors)
