# Fluid Layouts and Typography

## Overview

Fluid design creates smooth scaling experiences by using relative units and mathematical functions instead of fixed breakpoints. This approach reduces the need for media queries and creates more natural-feeling interfaces.

## Fluid Typography

### The clamp() Function

```css
/* clamp(minimum, preferred, maximum) */
.heading {
  /* Never smaller than 1.5rem, never larger than 3rem */
  /* Scales at 5vw between those values */
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

### Calculating Fluid Values

The preferred value in `clamp()` typically combines a base size with a viewport-relative portion:

```css
/* Formula: clamp(min, base + scale * vw, max) */

/* For text that scales from 16px (320px viewport) to 24px (1200px viewport): */
/* slope = (24 - 16) / (1200 - 320) = 8 / 880 = 0.00909 */
/* y-intercept = 16 - 0.00909 * 320 = 13.09px = 0.818rem */

.text {
  font-size: clamp(1rem, 0.818rem + 0.909vw, 1.5rem);
}
```

### Type Scale Generator

```javascript
// Generate a fluid type scale
function fluidType({
  minFontSize,
  maxFontSize,
  minViewport = 320,
// ... (21 lines trimmed)
  "3xl": fluidType({ minFontSize: 30, maxFontSize: 48 }),
  "4xl": fluidType({ minFontSize: 36, maxFontSize: 60 }),
};
```

### Complete Type Scale

```css
:root {
  /* Base: 16-18px */
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);

  /* Smaller sizes */
// ... (48 lines trimmed)
small {
  font-size: var(--text-sm);
}
```

## Fluid Spacing

### Spacing Scale

```css
:root {
  /* Spacing tokens that scale with viewport */
  --space-3xs: clamp(0.25rem, 0.2rem + 0.25vw, 0.375rem);
  --space-2xs: clamp(0.375rem, 0.3rem + 0.375vw, 0.5rem);
  --space-xs: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
// ... (25 lines trimmed)
.stack > * + * {
  margin-top: var(--space-md);
}
```

### Container Widths

```css
:root {
  /* Fluid max-widths */
  --container-xs: min(100% - 2rem, 20rem);
  --container-sm: min(100% - 2rem, 30rem);
  --container-md: min(100% - 2rem, 45rem);
// ... (15 lines trimmed)
  width: 100vw;
  margin-inline: calc(-50vw + 50%);
}
```

## CSS Grid Fluid Layouts

### Auto-fit Grid

```css
/* Grid that fills available space */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: var(--space-md);
// ... (8 lines trimmed)
  );
  gap: var(--space-md);
}
```

### Responsive Grid Areas

```css
.page-grid {
  display: grid;
  grid-template-columns:
    1fr
    min(var(--container-lg), 100%)
// ... (21 lines trimmed)
    grid-template-columns: 1fr min(300px, 30%);
  }
}
```

### Fluid Aspect Ratios

```css
/* Maintain aspect ratio fluidly */
.aspect-video {
  aspect-ratio: 16 / 9;
}

// ... (17 lines trimmed)
    aspect-ratio: 16 / 9;
  }
}
```

## Flexbox Fluid Patterns

### Flexible Sidebar

```css
/* Sidebar that collapses when too narrow */
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
// ... (9 lines trimmed)
  flex-grow: 999;
  min-width: 60%;
}
```

### Cluster Layout

```css
/* Items cluster and wrap naturally */
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
// ... (18 lines trimmed)
  justify-content: space-between;
  align-items: center;
}
```

### Switcher Layout

```css
/* Switches from horizontal to vertical based on container */
.switcher {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
// ... (10 lines trimmed)
.switcher > :nth-last-child(n + 4) ~ * {
  flex-basis: 100%;
}
```

## Intrinsic Sizing

### Content-Based Widths

```css
/* Size based on content */
.fit-content {
  width: fit-content;
  max-width: 100%;
}
// ... (24 lines trimmed)
  width: min(90vw, 600px);
  max-height: min(90vh, 800px);
}
```

### min() and max() Functions

```css
/* Responsive sizing without media queries */
.container {
  /* 90% of viewport or 1200px, whichever is smaller */
  width: min(90%, 1200px);
  margin-inline: auto;
// ... (13 lines trimmed)
  /* Each card at least 200px, fill available space */
  grid-template-columns: repeat(auto-fit, minmax(max(200px, 100%/4), 1fr));
}
```

## Viewport Units

### Modern Viewport Units

```css
/* Dynamic viewport height - accounts for mobile browser UI */
.full-height {
  min-height: 100dvh;
}

// ... (22 lines trimmed)
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}
```

### Combining Viewport and Container Units

```css
/* Responsive based on both viewport and container */
.component {
  container-type: inline-size;
}

.component-text {
  /* Uses viewport when small, container when in container */
  font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
}

@container (min-width: 400px) {
  .component-text {
    font-size: clamp(1rem, 4cqi, 1.5rem);
  }
}
```

## Utility Classes

```css
/* Tailwind-style fluid utilities */
.text-fluid-sm {
  font-size: var(--text-sm);
}
.text-fluid-base {
// ... (34 lines trimmed)
.gap-fluid-lg {
  gap: var(--space-lg);
}
```

## Resources

- [Utopia Fluid Type Calculator](https://utopia.fyi/)
- [Modern Fluid Typography](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)
- [Every Layout](https://every-layout.dev/)
- [CSS min(), max(), and clamp()](https://web.dev/min-max-clamp/)
