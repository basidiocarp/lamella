# Easing Functions & Tailwind Transitions

Detailed reference for CSS easing functions and Tailwind transition utilities.

## CSS Easing Functions

```css
/* Built-in */
transition-timing-function: linear;
transition-timing-function: ease;        /* Default - slow start, fast middle, slow end */
transition-timing-function: ease-in;     /* Slow start */
transition-timing-function: ease-out;    /* Slow end */
// ... (14 lines trimmed)

/* Elastic */
transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

## Common Easing Presets

| Name | cubic-bezier | Use Case |
|------|-------------|----------|
| Material Standard | `0.4, 0, 0.2, 1` | General UI transitions |
| Material Decelerate | `0, 0, 0.2, 1` | Elements entering screen |
| Material Accelerate | `0.4, 0, 1, 1` | Elements leaving screen |
| Bounce | `0.68, -0.55, 0.265, 1.55` | Playful interactions |
| Elastic | `0.175, 0.885, 0.32, 1.275` | Springy feedback |
| Smooth | `0.25, 0.1, 0.25, 1` | Subtle transitions |

## Tailwind Transitions

```tsx
// Duration
<div className="transition duration-150" />  // 150ms
<div className="transition duration-300" />  // 300ms
<div className="transition duration-500" />  // 500ms

// ... (14 lines trimmed)
<button className="transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg">
  Hover me
</button>
```

## Custom Tailwind Easing

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionTimingFunction: {
// ... (10 lines trimmed)
// Usage
<div className="transition ease-material duration-300" />
<div className="transition ease-bounce duration-500" />
```
