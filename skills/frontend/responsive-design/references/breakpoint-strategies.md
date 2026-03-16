# Breakpoint Strategies

## Overview

Effective breakpoint strategies focus on content needs rather than device sizes. Modern responsive design uses fewer, content-driven breakpoints combined with fluid techniques.

## Mobile-First Approach

### Core Philosophy

Start with the smallest screen, then progressively enhance for larger screens.

```css
/* Base styles (mobile first) */
.component {
  display: flex;
  flex-direction: column;
  padding: 1rem;
// ... (12 lines trimmed)
    padding: 2rem;
  }
}
```

### Benefits

1. **Performance**: Mobile devices load only necessary CSS
2. **Progressive Enhancement**: Features add rather than subtract
3. **Content Priority**: Forces focus on essential content first
4. **Simplicity**: Easier to reason about cascading styles

## Common Breakpoint Scales

### Tailwind CSS Default

```css
/* Tailwind breakpoints */
/* sm: 640px  - Landscape phones */
/* md: 768px  - Tablets */
/* lg: 1024px - Laptops */
/* xl: 1280px - Desktops */
// ... (14 lines trimmed)
@media (min-width: 1536px) {
  /* 2xl */
}
```

### Bootstrap 5

```css
/* Bootstrap breakpoints */
/* sm: 576px */
/* md: 768px */
/* lg: 992px */
/* xl: 1200px */
// ... (14 lines trimmed)
@media (min-width: 1400px) {
  /* xxl */
}
```

### Minimalist Scale

```css
/* Simplified 3-breakpoint system */
/* Base: Mobile (< 600px) */
/* Medium: Tablets and small laptops (600px - 1024px) */
/* Large: Desktops (> 1024px) */

// ... (8 lines trimmed)
@media (min-width: 1024px) {
  /* Large */
}
```

## Content-Based Breakpoints

### Finding Natural Breakpoints

Instead of using device-based breakpoints, identify where your content naturally needs to change.

```css
/* Bad: Device-based thinking */
@media (min-width: 768px) {
  /* iPad breakpoint */
}

// ... (12 lines trimmed)
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Testing Content Breakpoints

```javascript
// Find where content breaks
function findBreakpoints(selector) {
  const element = document.querySelector(selector);
  const breakpoints = [];

// ... (8 lines trimmed)

  return breakpoints;
}
```

## Design Token Integration

### Breakpoint Tokens

```css
:root {
  /* Breakpoint values */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
// ... (14 lines trimmed)
  margin-inline: auto;
  padding-inline: var(--space-4);
}
```

### JavaScript Integration

```typescript
// Breakpoint constants
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
// ... (39 lines trimmed)
            : "base",
  };
}
```

## Feature Queries

### @supports for Progressive Enhancement

```css
/* Feature detection instead of browser detection */
@supports (display: grid) {
  .layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
// ... (24 lines trimmed)
    margin-left: 1rem;
  }
}
```

### Combining Feature and Size Queries

```css
/* Only apply grid layout if supported and screen is large enough */
@supports (display: grid) {
  @media (min-width: 768px) {
    .layout {
      display: grid;
      grid-template-columns: 250px 1fr;
    }
  }
}
```

## Responsive Patterns by Component

### Navigation

```css
.nav {
  /* Mobile: vertical stack */
  display: flex;
  flex-direction: column;
}
// ... (16 lines trimmed)
    flex-direction: row;
  }
}
```

### Cards Grid

```css
.cards {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}
// ... (22 lines trimmed)
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
}
```

### Hero Section

```css
.hero {
  min-height: 50vh;
  padding: var(--space-lg) var(--space-md);
  text-align: center;
}
// ... (28 lines trimmed)
    max-width: 50%;
  }
}
```

### Tables

```css
/* Mobile: cards or horizontal scroll */
.table-container {
  overflow-x: auto;
}

// ... (31 lines trimmed)
    font-weight: 600;
  }
}
```

## Print Styles

```css
@media print {
  /* Remove non-essential elements */
  .nav,
  .sidebar,
  .footer,
// ... (32 lines trimmed)
    font-size: 0.8em;
  }
}
```

## Preference Queries

```css
/* Dark mode preference */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #f0f0f0;
// ... (34 lines trimmed)
    display: block;
  }
}
```

## Testing Breakpoints

```javascript
// Automated breakpoint testing
async function testBreakpoints(page, breakpoints) {
  const results = [];

  for (const [name, width] of Object.entries(breakpoints)) {
// ... (26 lines trimmed)

  return results;
}
```

## Resources

- [Tailwind CSS Breakpoints](https://tailwindcss.com/docs/responsive-design)
- [The 100% Correct Way to Do CSS Breakpoints](https://www.freecodecamp.org/news/the-100-correct-way-to-do-css-breakpoints-88d6a5ba1862/)
- [Modern CSS Solutions](https://moderncss.dev/)
- [Defensive CSS](https://defensivecss.dev/)
