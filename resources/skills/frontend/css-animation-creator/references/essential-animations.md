# Essential Animations Library

A comprehensive collection of reusable CSS keyframe animations for common UI patterns.

## Fade Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
// ... (63 lines trimmed)
  from { opacity: 1; }
  to { opacity: 0; }
}
```

## Scale Animations

```css
/* Scale In */
@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
// ... (26 lines trimmed)
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}
```

## Bounce Animations

```css
/* Bounce */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
// ... (37 lines trimmed)
  75% { transform: scaleX(1.05) scaleY(0.95); }
  100% { transform: scaleX(1) scaleY(1); }
}
```

## Rotate Animations

```css
/* Spin */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
// ... (32 lines trimmed)
  80% { transform: perspective(400px) rotateX(-5deg); }
  100% { transform: perspective(400px) rotateX(0deg); }
}
```

## Slide Animations

```css
/* Slide In Up */
@keyframes slideInUp {
  from {
    transform: translateY(100%);
    visibility: visible;
// ... (36 lines trimmed)
    visibility: hidden;
  }
}
```

## Attention Seekers

```css
/* Shake */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
// ... (32 lines trimmed)
  40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
  100% { transform: scale(1) rotate(0); }
}
```
