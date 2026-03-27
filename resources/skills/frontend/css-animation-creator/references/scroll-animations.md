# Scroll Animations

Use scroll animation only when scroll position helps tell the story or reveal
state. If the page has no narrative arc, keep the motion minimal.

## Good Scroll Uses

- progressive reveals in landing pages
- step-by-step product walkthroughs
- pinned comparisons or explainers
- subtle section entry cues

## Implementation Options

### Intersection Observer

Best for:
- reveal-on-enter patterns
- lightweight section activation
- toggling classes or state without heavy motion logic

### Framer Motion Scroll Hooks

Best for:
- parallax and progress-linked transforms
- coordinated scroll-driven motion
- shared animation logic inside a React app

### Native Scroll-Driven CSS

Best for:
- progressive enhancement where browser support is acceptable
- simple timeline-linked effects without extra JS

## Sticky and Pinned Sections

Use pinned sections when one anchor element should stay visible while the copy or
adjacent panels change.

Good fits:
- before-and-after comparisons
- product walkthroughs
- step sequences with one persistent visual

Bad fits:
- decorative pinning with no informational payoff
- long sections that trap the user in one scroll region

## Design Rules

- sequence content before adding motion
- keep one dominant scroll effect per section
- avoid layered parallax plus stagger plus pinned motion at once
- respect reduced-motion preferences
- test on lower-powered devices before keeping heavy effects

## Anti-Patterns

- scroll hijacking
- excessive parallax
- pinned sections that delay normal reading flow
- motion that matters more than the content reveal

Scroll animation should support comprehension, not compete with it.
