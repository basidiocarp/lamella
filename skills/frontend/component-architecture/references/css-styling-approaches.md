# CSS Styling Approaches Reference

## Comparison Matrix

| Approach          | Runtime | Bundle Size    | Learning Curve | Dynamic Styles | SSR   |
| ----------------- | ------- | -------------- | -------------- | -------------- | ----- |
| CSS Modules       | None    | Minimal        | Low            | Limited        | Yes   |
| Tailwind          | None    | Small (purged) | Medium         | Via classes    | Yes   |
| styled-components | Yes     | Medium         | Medium         | Full           | Yes\* |
| Emotion           | Yes     | Medium         | Medium         | Full           | Yes   |
| Vanilla Extract   | None    | Minimal        | High           | Limited        | Yes   |

## CSS Modules

Scoped CSS with zero runtime overhead.

### Setup

```tsx
// Button.module.css
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
// ... (27 lines trimmed)
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}
```

```tsx
// Button.tsx
import styles from "./Button.module.css";
import { clsx } from "clsx";

interface ButtonProps {
// ... (22 lines trimmed)
    </button>
  );
}
```

### Composition

```css
/* base.module.css */
.visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
// ... (8 lines trimmed)
.srOnly {
  composes: visuallyHidden from "./base.module.css";
}
```

## Tailwind CSS

Utility-first CSS with design system constraints.

### Class Variance Authority (CVA)

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
// ... (43 lines trimmed)
    );
  },
);
```

### Tailwind Merge Utility

```tsx
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage - handles conflicting classes
cn("px-4 py-2", "px-6"); // => 'py-2 px-6'
cn("text-red-500", condition && "text-blue-500"); // => 'text-blue-500' if condition
```

### Custom Plugin

```js
// tailwind.config.js
const plugin = require("tailwindcss/plugin");

module.exports = {
  plugins: [
// ... (24 lines trimmed)
    }),
  ],
};
```

## styled-components

CSS-in-JS with template literals.

```tsx
import styled, { css, keyframes } from "styled-components";

// Keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
// ... (97 lines trimmed)
    Click me
  </Button>
</ThemeProvider>;
```

## Emotion

Flexible CSS-in-JS with object and template syntax.

```tsx
/** @jsxImportSource @emotion/react */
import { css, Theme, ThemeProvider, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// Theme typing
// ... (67 lines trimmed)
    <Alert>Important message</Alert>
  </Card>
</ThemeProvider>;
```

## Vanilla Extract

Zero-runtime CSS-in-JS with full type safety.

```tsx
// styles.css.ts
import { style, styleVariants, createTheme } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

// Theme contract
// ... (84 lines trimmed)
});

export type ButtonVariants = RecipeVariants<typeof button>;
```

```tsx
// Button.tsx
import { button, type ButtonVariants, themeClass } from "./styles.css";

interface ButtonProps extends ButtonVariants {
  children: React.ReactNode;
// ... (18 lines trimmed)
    </div>
  );
}
```

## Performance Considerations

### Critical CSS Extraction

```tsx
// Next.js with styled-components
// pages/_document.tsx
import Document, { DocumentContext } from "next/document";
import { ServerStyleSheet } from "styled-components";

// ... (19 lines trimmed)
    }
  }
}
```

### Code Splitting Styles

```tsx
// Dynamically import heavy styled components
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <Skeleton height={400} />,
  ssr: false,
});
```
