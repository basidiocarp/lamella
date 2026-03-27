# Token Transforms and Platform Output

Once the token hierarchy is stable, generate outputs for the platforms that
consume it.

## Common Targets

- CSS custom properties
- iOS constants
- Android resources
- typed JavaScript or TypeScript exports

## Rules

- keep transforms deterministic
- normalize units at generation time
- avoid hand-maintaining platform-specific copies when generation can stay
  authoritative
