# Page Transitions

Use page transitions to preserve continuity between screens, not to show off the
animation system.

## Transition Approaches

### CSS or Native View Transitions

Good for:
- simple fades
- shared-element continuity
- low-overhead route changes

Use when the app needs lightweight transitions with minimal runtime logic.

### Framer Motion

Good for:
- route-level enter and exit states
- shared layout choreography
- staggered page sections

Use it when the app already depends on motion primitives and the transition needs
more control than CSS alone.

## Good Transition Patterns

- fade plus slight vertical movement for route entry
- shared hero or image continuity between list and detail
- staggered reveal for a small set of page sections

Keep the pattern consistent across the product.

## Timing Rules

- route transitions should feel faster than modals or onboarding sequences
- the outgoing page should not linger longer than necessary
- staggered entry is helpful only for a few meaningful children

## Anti-Patterns

- transitions that block interaction for too long
- route animations that change direction or style on every screen
- large staggered sequences for utility pages
- motion with no reduced-motion fallback

The best page transition makes navigation feel continuous without drawing more
attention than the content.
