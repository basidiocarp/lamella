# Spacing Systems

Build spacing from a consistent scale, then map semantic roles onto it.

## Recommended Baseline

Use a small step such as `4px` or `0.25rem`, then compose larger tokens from
that unit.

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
}
```

## Semantic Layer

Map the scale into usage-oriented tokens:

- `--spacing-inline`
- `--spacing-stack`
- `--spacing-section`
- `--spacing-page`

That keeps components expressive without inventing raw values each time.

## Layout Guidance

- Use tighter spacing inside one component than between components.
- Let larger containers step up spacing at wider breakpoints or container
  sizes.
- Reserve negative space patterns for deliberate visual hierarchy, not patching
  poor component structure.
