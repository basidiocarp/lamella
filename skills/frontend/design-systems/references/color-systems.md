# Color Systems Reference

## Color Palette Generation

### Perceptually Uniform Scales

Using OKLCH for perceptually uniform color scales:

```css
/* OKLCH: Lightness, Chroma, Hue */
:root {
  /* Generate a blue scale with consistent perceived lightness steps */
  --blue-50: oklch(97% 0.02 250);
  --blue-100: oklch(93% 0.04 250);
  --blue-200: oklch(86% 0.08 250);
  --blue-300: oklch(75% 0.12 250);
  --blue-400: oklch(65% 0.16 250);
  --blue-500: oklch(55% 0.2 250); /* Primary */
  --blue-600: oklch(48% 0.18 250);
  --blue-700: oklch(40% 0.16 250);
  --blue-800: oklch(32% 0.12 250);
  --blue-900: oklch(25% 0.08 250);
  --blue-950: oklch(18% 0.05 250);
}
```

### Programmatic Scale Generation

```tsx
function generateColorScale(
  hue: number,
  saturation: number = 100,
): Record<string, string> {
  const lightnessStops = [
// ... (23 lines trimmed)
const success = generateColorScale(142); // Green
const warning = generateColorScale(38); // Amber
const error = generateColorScale(0); // Red
```

## Semantic Color Tokens

### Two-Tier Token System

```css
/* Tier 1: Primitive colors (raw values) */
:root {
  --primitive-blue-500: #3b82f6;
  --primitive-blue-600: #2563eb;
  --primitive-green-500: #22c55e;
// ... (33 lines trimmed)
  --color-status-error: var(--primitive-red-500);
  --color-status-info: var(--primitive-blue-500);
}
```

### Component Tokens

```css
/* Tier 3: Component-specific tokens */
:root {
  /* Button */
  --button-bg: var(--color-interactive-primary);
  --button-bg-hover: var(--color-interactive-primary-hover);
// ... (12 lines trimmed)
  --card-border: var(--color-border-default);
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

## Dark Mode Implementation

### CSS Custom Properties Approach

```css
/* Light theme (default) */
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;
// ... (19 lines trimmed)
    /* ... dark theme values */
  }
}
```

### React Theme Context

```tsx
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
// ... (50 lines trimmed)
  if (!context) throw new Error("useTheme must be within ThemeProvider");
  return context;
}
```

## Contrast and Accessibility

### WCAG Contrast Checker

```tsx
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error("Invalid hex color");
  return [
    parseInt(result[1], 16),
// ... (42 lines trimmed)
// Usage
meetsWCAG("#ffffff", "#3b82f6"); // true (4.5:1 for AA normal)
meetsWCAG("#ffffff", "#60a5fa"); // false (below 4.5:1)
```

### Accessible Color Pairs

```tsx
// Generate accessible text color for any background
function getAccessibleTextColor(backgroundColor: string): string {
  const [r, g, b] = hexToRgb(backgroundColor);
  const luminance = getLuminance(r, g, b);

// ... (14 lines trimmed)
  }
  return null;
}
```

## Color Harmony

### Harmony Functions

```tsx
type HarmonyType =
  | "complementary"
  | "triadic"
  | "analogous"
  | "split-complementary";
// ... (25 lines trimmed)
    hues.map((hue, i) => [names[i] || `color-${i}`, `hsl(${hue}, 70%, 50%)`]),
  );
}
```

## Color Blindness Considerations

```tsx
// Simulate color blindness
type ColorBlindnessType = "protanopia" | "deuteranopia" | "tritanopia";

// Matrix transforms for common types
const colorBlindnessMatrices: Record<ColorBlindnessType, number[][]> = {
// ... (20 lines trimmed)
// 3. Ensure sufficient contrast between colors
// 4. Test with color blindness simulators
// 5. Use blue-orange instead of red-green for contrast
```

## CSS Color Functions

```css
/* Modern CSS color functions */
.modern-colors {
  /* Relative color syntax */
  --lighter: hsl(from var(--base-color) h s calc(l + 20%));
  --darker: hsl(from var(--base-color) h s calc(l - 20%));
// ... (16 lines trimmed)
  --color-40: rgb(59 130 246 / 0.4);
  --color-50: rgb(59 130 246 / 0.5);
}
```
