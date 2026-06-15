# Easing Functions & Tailwind Transitions

Use easing to control how motion feels, not just how long it lasts.

## Practical Easing Choices

| Easing | Best for |
|---|---|
| `linear` | progress indicators, constant motion |
| `ease` | generic UI transitions |
| `ease-in` | exits or builds of momentum |
| `ease-out` | entrances and hover responses |
| `ease-in-out` | symmetric state changes |

For most UI work, `ease-out` is the safest default for elements entering or
responding to hover and press.

## Custom Curves

Use a custom cubic-bezier curve only when the motion needs a distinct feel.

```css
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

Common patterns:
- standard UI motion: `0.4, 0, 0.2, 1`
- faster exit: `0.4, 0, 1, 1`
- softer entrance: `0, 0, 0.2, 1`

Avoid novelty curves unless the product language supports them.

## Tailwind Usage

```tsx
<button className="transition-all duration-200 ease-out hover:scale-105">
  Hover me
</button>
```

You can extend Tailwind with named easing tokens if the system reuses them
often.

## Design Rules

- pair easing with duration deliberately
- use one motion language across similar components
- do not use bouncy or elastic curves for routine interactions
- prioritize readability over personality in dense product UI

If an animation feels like it lingers, the problem is often easing, not only
duration.
