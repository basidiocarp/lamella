# Tailwind Animation Config

Tailwind configuration for reusable animation tokens and keyframes.

## Theme Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        shimmer: 'shimmer 1.5s linear infinite',
        pulse-soft: 'pulse-soft 1.8s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
      },
    },
  },
}
```

## Usage Examples

```tsx
<div className="animate-fade-in">Fades in</div>
<div className="animate-fade-in-up">Fades in from below</div>
<div className="animate-pulse-soft">Subtle emphasis</div>
<div className="animate-shimmer bg-[length:200%_100%]">Loading state</div>
```
