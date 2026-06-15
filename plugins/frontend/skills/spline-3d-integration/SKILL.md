---
name: spline-3d-integration
description: "Integrates Spline scenes into web projects with React, Next.js, or vanilla HTML."
origin: lamella
---

# Spline 3D Integration

Use this skill when the user already has, or wants to use, a Spline scene URL in a web experience.

## Workflow

1. Confirm the stack: React, Next.js, or vanilla HTML.
2. Check whether the scene is decorative or interactive.
3. Add a fallback first, then the live scene.
4. Gate loading for mobile, low-end devices, and failed CDN fetches.
5. Verify that the scene does not hijack scroll or block page UI.

## Rules

- Prefer Spline for lightweight 3D embeds, designer-owned scenes, and quick prototypes.
- Keep the live scene behind real content; do not let it block navigation or CTAs.
- Use a static color, image, or video fallback when the scene is optional.
- Treat Spline as a performance-sensitive asset, not as a free decorative layer.
- If the scene is large or purely decorative, recommend video instead of live WebGL.

## Load on Demand

Read only what matches the task:

- [references/integration-patterns.md](references/integration-patterns.md) for React, Next.js, and vanilla embed patterns
- [references/performance-and-fallbacks.md](references/performance-and-fallbacks.md) for device gating, preload strategy, and mobile fallbacks
- [references/troubleshooting.md](references/troubleshooting.md) for the common failure modes that tend to appear after integration

## Deliverables

When implementing or reviewing a Spline embed, provide:

1. the integration pattern used
2. the fallback strategy
3. the mobile or low-end gating rule
4. the final checks for scroll, pointer events, and layout shift
