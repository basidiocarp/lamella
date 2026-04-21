---
name: threejs-advanced
description: "Implements advanced Three.js animation, post-processing, and shader workflows."
origin: lamella
---

# Three.js Advanced

Use this skill when the work is beyond a basic embed and needs custom Three.js behavior.

## When to Reach for This Skill

- the project needs GLTF animation playback or animation blending
- the scene needs bloom, depth of field, anti-aliasing, or color grading
- the team needs a custom shader or vertex displacement effect
- a Spline scene is too limiting and the team wants direct Three.js control

## Working Rules

- Prefer `spline-3d-integration` when a designer-owned scene is enough.
- Use this skill only when the project needs code-level control over animation, rendering, or shaders.
- Keep effects purposeful. Bloom, DOF, and custom shaders should support readability or atmosphere, not hide weak layout work.
- Start with a plain render pass, then add one effect at a time and profile after each step.

## Load on Demand

- [references/animation.md](references/animation.md) for clips, mixers, actions, and GLTF animation playback
- [references/postprocessing.md](references/postprocessing.md) for `EffectComposer`, bloom, anti-aliasing, and screen-space effects
- [references/shaders.md](references/shaders.md) for `ShaderMaterial`, uniforms, varyings, and custom displacement or color effects

## Related Guidance

- Use [`frontend-patterns` and its 3D reference](../frontend-patterns/SKILL.md) when the open question is whether 3D belongs in the experience at all.
- Use [`css-animation-creator`](../css-animation-creator/SKILL.md) when the work is better served by CSS or scroll-driven motion instead of WebGL.
