---
name: css-animation-creator
description: "Creates frontend motion and animation patterns."
origin: lamella
---

# CSS Animation Creator

Use this skill when adding motion to a frontend. Keep the main skill focused on intent, accessibility, and performance; use the references for the concrete animation families.

## When to Use

- adding micro-interactions or hover states
- designing loading or feedback animations
- building page or scroll transitions
- deciding whether CSS alone is enough or a JS animation library is warranted

## Core Rules

1. animate for clarity or tone, not just novelty
2. prefer transform and opacity over layout-triggering properties
3. honor `prefers-reduced-motion`
4. keep timing and easing aligned with the product feel

## Core Workflow

1. identify the user-facing moment that needs motion
2. choose transition, keyframe, scroll, or library-based motion
3. implement the smallest smooth version first
4. verify accessibility and performance

## References

- [references/essential-animations.md](references/essential-animations.md)
- [references/loading-animations.md](references/loading-animations.md)
- [references/micro-interactions.md](references/micro-interactions.md)
- [references/page-transitions.md](references/page-transitions.md)
- [references/scroll-animations.md](references/scroll-animations.md)
- [references/tailwind-config.md](references/tailwind-config.md)
- [references/easing-functions.md](references/easing-functions.md)
- [references/animation-libraries.md](references/animation-libraries.md)
