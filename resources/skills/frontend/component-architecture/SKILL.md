---
name: component-architecture
description: "Designs reusable frontend component architectures."
origin: lamella
---

# Component Architecture

Use this skill when designing reusable UI components or reviewing component-library structure.

## When to Use

- shaping a component API
- choosing between compound components, slots, render props, or headless primitives
- standardizing styling approach across a component layer
- refactoring large UI components into smaller reusable pieces

## Core Rules

1. Prefer composition over prop explosion.
2. Keep components accessible by default.
3. Separate structure, state, and styling responsibilities clearly.
4. Choose a styling approach that matches the repo instead of mixing paradigms casually.

## Core Workflow

1. Define the public API and usage shape first.
2. Pick the composition pattern that matches the interaction model.
3. Decide how styling is applied and overridden.
4. Test accessibility and state behavior before polishing abstractions.

## References

- [references/component-patterns.md](references/component-patterns.md)
- [references/css-styling-approaches.md](references/css-styling-approaches.md)
- [references/accessibility-patterns.md](references/accessibility-patterns.md)
