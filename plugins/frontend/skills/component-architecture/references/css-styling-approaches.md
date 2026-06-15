# CSS Styling Approaches

Use this reference to choose a styling model for a component system.

For token hierarchy, theming, and broader visual-system decisions, pair this
with `frontend/design-systems`.

## Comparison Focus

Evaluate each approach on:

- runtime cost
- SSR compatibility
- theming flexibility
- type safety
- authoring ergonomics
- compatibility with the team’s design-system tooling

## Practical Heuristics

- CSS Modules: good default for scoped styles with little runtime cost
- Tailwind plus CVA: good when the system already uses utility constraints
- styled-components or Emotion: use when runtime styling flexibility outweighs
  the extra cost
- Vanilla Extract: use when you want zero-runtime CSS with typed contracts

## Watch For

- mixing multiple styling models without a boundary
- runtime CSS-in-JS where the product mostly needs static styles
- utility sprawl that hides component intent
