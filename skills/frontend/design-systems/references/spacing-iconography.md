# Spacing and Iconography Reference

## Spacing Systems

### 8-Point Grid System

The 8-point grid is the industry standard for consistent spacing.

```css
:root {
  /* Base spacing unit */
  --space-unit: 0.25rem; /* 4px */

  /* Spacing scale */
// ... (22 lines trimmed)
  --space-28: calc(var(--space-unit) * 28); /* 112px */
  --space-32: calc(var(--space-unit) * 32); /* 128px */
}
```

### Semantic Spacing Tokens

```css
:root {
  /* Component-level spacing */
  --spacing-xs: var(--space-1); /* 4px - tight spacing */
  --spacing-sm: var(--space-2); /* 8px - compact spacing */
  --spacing-md: var(--space-4); /* 16px - default spacing */
// ... (9 lines trimmed)
  --spacing-section: var(--space-16); /* Between major sections */
  --spacing-page: var(--space-24); /* Page margins */
}
```

### Spacing Utility Functions

```tsx
// Tailwind-like spacing scale generator
function createSpacingScale(baseUnit: number = 4): Record<string, string> {
  const scale: Record<string, string> = {
    "0": "0",
    px: "1px",
// ... (11 lines trimmed)

  return scale;
}
```

## Layout Spacing Patterns

### Container Queries for Spacing

```css
/* Responsive spacing based on container size */
.card {
  container-type: inline-size;
  padding: var(--space-4);
}
// ... (9 lines trimmed)
    padding: var(--space-8);
  }
}
```

### Negative Space Patterns

```css
/* Asymmetric spacing for visual hierarchy */
.hero-section {
  padding-top: var(--space-24);
  padding-bottom: var(--space-16);
}
// ... (10 lines trimmed)
.prose > * + h2 {
  margin-top: var(--space-8);
}
```

## Icon Systems

### Icon Size Scale

```css
:root {
  /* Icon sizes aligned to spacing grid */
  --icon-xs: 12px; /* Inline decorators */
  --icon-sm: 16px; /* Small UI elements */
  --icon-md: 20px; /* Default size */
  --icon-lg: 24px; /* Emphasis */
  --icon-xl: 32px; /* Large displays */
  --icon-2xl: 48px; /* Hero icons */

  /* Touch target sizes */
  --touch-target-min: 44px; /* WCAG minimum */
  --touch-target-comfortable: 48px;
}
```

### SVG Icon Component

```tsx
import { forwardRef, type SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
// ... (31 lines trimmed)
);

Icon.displayName = "Icon";
```

### Icon Button Patterns

```tsx
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "ghost" | "outline";
// ... (37 lines trimmed)
    </button>
  );
}
```

### Icon Sprite Generation

```tsx
// Build script for SVG sprite
import { readdir, readFile, writeFile } from "fs/promises";
import { optimize } from "svgo";

async function buildIconSprite(iconDir: string, outputPath: string) {
// ... (53 lines trimmed)
  await writeFile(outputPath, sprite);
  console.log(`Generated sprite with ${symbols.length} icons`);
}
```

### Icon Libraries Integration

```tsx
// Lucide React
import { Home, Settings, User, Search } from "lucide-react";

function Navigation() {
  return (
// ... (17 lines trimmed)

// Radix Icons
import { HomeIcon, GearIcon } from "@radix-ui/react-icons";
```

## Sizing Systems

### Element Sizing Scale

```css
:root {
  /* Fixed sizes */
  --size-4: 1rem; /* 16px */
  --size-5: 1.25rem; /* 20px */
  --size-6: 1.5rem; /* 24px */
// ... (19 lines trimmed)
  --avatar-xl: var(--size-16); /* 64px */
  --avatar-2xl: var(--size-24); /* 96px */
}
```

### Aspect Ratios

```css
.aspect-ratios {
  /* Standard ratios */
  --aspect-square: 1 / 1;
  --aspect-video: 16 / 9;
  --aspect-photo: 4 / 3;
// ... (12 lines trimmed)
  aspect-ratio: var(--aspect-square);
  border-radius: 50%;
}
```

### Border Radius Scale

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem; /* 2px */
  --radius-default: 0.25rem; /* 4px */
  --radius-md: 0.375rem; /* 6px */
// ... (10 lines trimmed)
  --radius-modal: var(--radius-xl);
  --radius-badge: var(--radius-full);
}
```
