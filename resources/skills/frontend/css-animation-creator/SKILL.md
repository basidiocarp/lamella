---
name: css-animation-creator
description: "Creates frontend motion and animation patterns. Use when adding CSS animations, transitions, micro-interactions, loading states, page transitions, scroll effects, or gesture-driven motion."
---

# CSS Animation Creator

## Contents

- [Instructions](#instructions)
- [Animation Principles](#animation-principles)
- [CSS Transitions](#css-transitions)
- [Keyframe Animations](#keyframe-animations)
- [Accessibility](#accessibility)
- [Performance Best Practices](#performance-best-practices)

### Reference Files

- [references/essential-animations.md](references/essential-animations.md) — Fade, scale, bounce, rotate, slide, attention animations
- [references/loading-animations.md](references/loading-animations.md) — Spinners, dots, skeletons, progress bars
- [references/micro-interactions.md](references/micro-interactions.md) — Button effects, hover states, form interactions
- [references/page-transitions.md](references/page-transitions.md) — View Transitions API, Framer Motion, staggered animations
- [references/scroll-animations.md](references/scroll-animations.md) — Intersection Observer, parallax, scroll-driven CSS
- [references/tailwind-config.md](references/tailwind-config.md) — Complete Tailwind animation configuration
- [references/easing-functions.md](references/easing-functions.md) — Detailed easing reference and custom Tailwind easing
- [references/animation-libraries.md](references/animation-libraries.md) — Framer Motion, GSAP, Spring.js, and other JS animation library patterns

---

## When to Use

When creating animations:

1. **Understand the purpose** — Feedback, delight, guidance, or storytelling
2. **Choose the right technique** — CSS transitions, keyframes, or JS libraries
3. **Optimize for performance** — GPU-accelerated properties only
4. **Respect accessibility** — Honor prefers-reduced-motion
5. **Keep timing natural** — Use appropriate easing and duration

When polishing an existing interface, start by identifying the most boring default moments:

- plain hover states
- abrupt state changes
- generic loaders
- static reveal moments
- interaction points that need more personality

Then improve only the moments that add brand fit or clarity. Delight should reinforce the product story, not distract from it.

---

## Animation Principles

### Micro-Interaction Heuristics

- Adapt motion to the product's tone and narrative instead of adding effects generically.
- Prefer one well-executed moment over several noisy ones.
- Avoid layout shifts, janky easing, or interaction delays that make the interface feel less reliable.
- If the effect is not smooth and purposeful, remove it.

### The 12 Principles (Disney) Applied to UI

| Principle | UI Application |
|-----------|----------------|
| **Squash & Stretch** | Button press, elastic effects |
| **Anticipation** | Hover states before action |
| **Staging** | Focus attention on important elements |
| **Follow Through** | Overshoot then settle |
| **Ease In/Out** | Natural acceleration/deceleration |
| **Arcs** | Curved motion paths |
| **Secondary Action** | Supporting animations |
| **Timing** | Duration conveys weight/importance |
| **Exaggeration** | Emphasis for clarity |
| **Appeal** | Pleasing, polished motion |

### Timing Guidelines

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro-interaction | 100-200ms | ease-out |
| Button/hover | 150-250ms | ease |
| Modal open | 200-300ms | ease-out |
| Modal close | 150-200ms | ease-in |
| Page transition | 300-500ms | ease-in-out |
| Loading loop | 1000-2000ms | linear/ease-in-out |
| Attention grab | 500-1000ms | elastic |

---

## CSS Transitions

### Basic Syntax

```css
.element {
  /* Single property */
  transition: opacity 0.3s ease;

  /* Multiple properties */
  transition:
    transform 0.3s ease,
    opacity 0.3s ease,
    background-color 0.2s ease;

  /* Shorthand: property duration timing-function delay */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s;
}
```

### Common Easing Functions

```css
/* Built-in */
ease           /* Default — slow start, fast middle, slow end */
ease-in        /* Slow start */
ease-out       /* Slow end */
ease-in-out    /* Slow start and end */

/* Material Design */
cubic-bezier(0.4, 0, 0.2, 1)   /* Standard */
cubic-bezier(0, 0, 0.2, 1)     /* Decelerate (entering) */
cubic-bezier(0.4, 0, 1, 1)     /* Accelerate (exiting) */

/* Special effects */
cubic-bezier(0.68, -0.55, 0.265, 1.55)  /* Bounce */
cubic-bezier(0.175, 0.885, 0.32, 1.275) /* Elastic */
```

See [references/easing-functions.md](references/easing-functions.md) for complete easing reference.

### Tailwind Quick Reference

```tsx
// Duration: duration-150, duration-300, duration-500
// Easing: ease-linear, ease-in, ease-out, ease-in-out
// Properties: transition-opacity, transition-transform, transition-colors, transition-all

<button className="transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg">
  Hover me
</button>
```

---

## Keyframe Animations

### Basic Syntax

```css
@keyframes animationName {
  0% { /* starting state */ }
  50% { /* midpoint state */ }
  100% { /* ending state */ }
}
// ... (12 lines trimmed)
  animation-fill-mode: forwards; /* none, forwards, backwards, both */
  animation-play-state: running; /* paused */
}
```

### Essential Keyframes

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
// ... (22 lines trimmed)
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
```

See [references/essential-animations.md](references/essential-animations.md) for the complete animation library.

---

## Accessibility

### Reduced Motion (Required)

```css
/* Global reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// Tailwind motion-safe/motion-reduce
<div className="motion-safe:animate-bounce motion-reduce:animate-none">
  Respects preferences
</div>

// ... (12 lines trimmed)

  return prefersReducedMotion;
}
```

---

## Performance Best Practices

### GPU-Accelerated Properties

```css
/* GOOD — GPU accelerated */
transform: translateX(100px);
transform: scale(1.1);
transform: rotate(45deg);
opacity: 0.5;

/* BAD — Triggers layout/paint */
left, top, width, height, margin, padding, border-width, font-size
```

### will-change (Use Sparingly)

```css
.complex-animation {
  will-change: transform, opacity;
}

.complex-animation.done {
  will-change: auto;
}
```

### Isolation

```css
.animated-section {
  contain: layout style paint;
}
```

### Checklist

- [ ] Only animate `transform` and `opacity`
- [ ] Use `will-change` only when necessary
- [ ] Keep animations under 300ms for UI feedback
- [ ] Test on low-end devices
- [ ] Use `contain` for isolated sections
- [ ] Reduce animation during scroll
- [ ] Pause off-screen animations
