# Loading Animations

Complete collection of loading states, spinners, skeleton loaders, and progress indicators.

## Spinners

```tsx
// Simple spinner
<div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />

// Dual ring
<div className="relative w-12 h-12">
// ... (8 lines trimmed)
    mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))'
  }}
/>
```

```css
/* Pulsing ring */
@keyframes pingRing {
  0% {
    transform: scale(1);
    opacity: 1;
// ... (16 lines trimmed)
  border-radius: 50%;
  animation: pingRing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
```

## Dots Loading

```tsx
// Bouncing dots
<div className="flex gap-1">
  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
// ... (9 lines trimmed)
    />
  ))}
</div>
```

```css
/* Scaling dots */
@keyframes dotScale {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
// ... (14 lines trimmed)
.dot-loader span:nth-child(1) { animation-delay: -0.32s; }
.dot-loader span:nth-child(2) { animation-delay: -0.16s; }
.dot-loader span:nth-child(3) { animation-delay: 0s; }
```

## Skeleton Loaders

```tsx
// Basic skeleton
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
  <div className="h-4 bg-gray-200 rounded w-5/6" />
// ... (12 lines trimmed)
<div className="relative overflow-hidden bg-gray-200 rounded">
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
</div>
```

```css
/* Shimmer keyframe */
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
```

## Progress Bars

```tsx
// Indeterminate progress
<div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
  <div className="h-full bg-blue-600 w-1/3 animate-[progress_1s_ease-in-out_infinite]" />
</div>

// ... (9 lines trimmed)
    }}
  />
</div>
```

```css
@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

@keyframes progress-stripes {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}
```
