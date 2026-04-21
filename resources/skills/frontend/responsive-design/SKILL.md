---
name: responsive-design
description: "Builds responsive frontend layouts with modern CSS."
origin: lamella
---

# Responsive Design


## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Capabilities](#core-capabilities)
- [Quick Reference](#quick-reference)
- [Key Patterns](#key-patterns)
- [Best Practices](#best-practices)
- [Common Issues](#common-issues)
- [Resources](#resources)


Master modern responsive design techniques to create interfaces that adapt seamlessly across all screen sizes and device contexts.

## When to Use This Skill

- Implementing mobile-first responsive layouts
- Using container queries for component-based responsiveness
- Creating fluid typography and spacing scales
- Building complex layouts with CSS Grid and Flexbox
- Designing breakpoint strategies for design systems
- Implementing responsive images and media
- Creating adaptive navigation patterns
- Building responsive tables and data displays

## Core Capabilities

### 1. Container Queries

- Component-level responsiveness independent of viewport
- Container query units (cqi, cqw, cqh)
- Style queries for conditional styling
- Fallbacks for browser support

### 2. Fluid Typography & Spacing

- CSS clamp() for fluid scaling
- Viewport-relative units (vw, vh, dvh)
- Fluid type scales with min/max bounds
- Responsive spacing systems

### 3. Layout Patterns

- CSS Grid for 2D layouts
- Flexbox for 1D distribution
- Intrinsic layouts (content-based sizing)
- Subgrid for nested grid alignment

### 4. Breakpoint Strategy

- Mobile-first media queries
- Content-based breakpoints
- Design token integration
- Feature queries (@supports)

## Quick Reference

### Modern Breakpoint Scale

```css
/* Mobile-first breakpoints */
/* Base: Mobile (< 640px) */
@media (min-width: 640px) { /* sm: Landscape phones, small tablets */ }
@media (min-width: 768px) { /* md: Tablets */ }
@media (min-width: 1024px) { /* lg: Laptops, small desktops */ }
@media (min-width: 1280px) { /* xl: Desktops */ }
@media (min-width: 1536px) { /* 2xl: Large desktops */ }

/* Tailwind CSS equivalent */
/* sm: 640px | md: 768px | lg: 1024px | xl: 1280px | 2xl: 1536px */
```

### Viewport Units

```css
/* Dynamic viewport units (recommended for mobile) */
.full-height-dynamic { height: 100dvh; }
.min-full-height { min-height: 100svh; }
.max-full-height { max-height: 100lvh; }

/* Viewport-relative font sizing */
.hero-title { font-size: clamp(2rem, 5vw, 4rem); }
```

## Key Patterns

See [references/patterns.md](references/patterns.md) for detailed implementations:

1. **Container Queries** - Component-level responsiveness with `@container`
2. **Fluid Typography** - CSS `clamp()` based type scales with JS utilities
3. **CSS Grid Responsive Layout** - Auto-fit/auto-fill grids and named areas
4. **Responsive Navigation** - Mobile menu with desktop horizontal layout
5. **Responsive Images** - Art direction with `<picture>` and srcset
6. **Responsive Tables** - Horizontal scroll and card-based mobile layouts

## Best Practices

1. **Mobile-First**: Start with mobile styles, enhance for larger screens
2. **Content Breakpoints**: Set breakpoints based on content, not devices
3. **Fluid Over Fixed**: Use fluid values for typography and spacing
4. **Container Queries**: Use for component-level responsiveness
5. **Test Real Devices**: Simulators don't catch all issues
6. **Performance**: Optimize images, lazy load off-screen content
7. **Touch Targets**: Maintain 44x44px minimum on mobile
8. **Logical Properties**: Use inline/block for internationalization

## Common Issues

- **Horizontal Overflow**: Content breaking out of viewport
- **Fixed Widths**: Using px instead of relative units
- **Viewport Height**: 100vh issues on mobile browsers
- **Font Size**: Text too small on mobile
- **Touch Targets**: Buttons too small to tap accurately
- **Aspect Ratio**: Images squishing or stretching
- **Z-Index Stacking**: Overlays breaking on different screens

## Resources

- [CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries)
- [Utopia Fluid Type Calculator](https://utopia.fyi/type/calculator/)
- [Every Layout](https://every-layout.dev/)
- [Responsive Images Guide](https://web.dev/responsive-images/)
- [CSS Grid Garden](https://cssgridgarden.com/)

### Local References

- [references/patterns.md](references/patterns.md) - Detailed pattern implementations with code examples
### Additional Resources

- [Breakpoint Strategies](references/breakpoint-strategies.md)
- [Container Queries](references/container-queries.md)
- [Fluid Layouts](references/fluid-layouts.md)
