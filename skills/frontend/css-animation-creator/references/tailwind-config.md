# Tailwind Animation Config

Complete Tailwind CSS configuration for custom animations and keyframes.

## Full Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
// ... (91 lines trimmed)
    },
  },
};
```

## Usage Examples

```tsx
// Fade animations
<div className="animate-fade-in">Fades in</div>
<div className="animate-fade-in-up">Fades in from below</div>

// Slide animations
// ... (8 lines trimmed)
// Loading animations
<div className="animate-shimmer">Shimmer loading</div>
<div className="animate-progress">Progress bar</div>
```
