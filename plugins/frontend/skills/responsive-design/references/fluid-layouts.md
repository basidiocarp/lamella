# Fluid Layouts and Typography

Fluid design reduces breakpoint pressure by letting layout and type scale smoothly.

## Fluid Type with `clamp()`

```css
.heading {
  font-size: clamp(1.5rem, 1.1rem + 2vw, 3rem);
}

.body {
  font-size: clamp(1rem, 0.95rem + 0.4vw, 1.125rem);
}
```

Use `clamp(min, preferred, max)` to keep text:
- readable at the low end
- flexible in the middle
- capped on very large screens

## Fluid Spacing

```css
:root {
  --space-xs: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
  --space-sm: clamp(0.75rem, 0.6rem + 0.6vw, 1rem);
  --space-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
  --space-lg: clamp(1.5rem, 1.1rem + 1.5vw, 2.5rem);
}
```

Use fluid spacing tokens for:
- section padding
- stack gaps
- card interiors

## Fluid Containers

```css
.container {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}
```

This handles:
- narrow-screen breathing room
- wide-screen line-length control

## Auto-Fit Grids

```css
.auto-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
}
```

This is a strong default for:
- card grids
- feature lists
- dashboard tiles

## Flexible Sidebars

```css
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
}

.sidebar {
  flex: 1 1 16rem;
}

.content {
  flex: 999 1 30rem;
}
```

This lets the sidebar collapse naturally without a hard breakpoint.

## Intrinsic Sizing

```css
.modal {
  width: min(90vw, 40rem);
  max-height: min(90dvh, 50rem);
}

.fit-content {
  width: fit-content;
  max-width: 100%;
}
```

Use intrinsic sizing when the content should drive the element width instead of the viewport.

## When You Still Need Breakpoints

Fluid patterns do not replace every breakpoint. Add one when:
- navigation structure changes completely
- a multi-column layout needs an extra rail
- content order or interaction model changes

## Default Recipe

```text
Use clamp() for type and spacing
Use min()/max() for container widths
Use auto-fit grids and flexible flexbox layouts
Add breakpoints only for real structural changes
```
