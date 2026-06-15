# Version Management Patterns

Use this page as the routing layer for Atmos component version strategies.

## Load Order

| Need | Reference |
| --- | --- |
| trunk-based rollout and environment convergence | `continuous-and-track-versioning.md` |
| explicit pins, folder versions, and source pins | `explicit-version-pinning.md` |

## Core Rules

- separate deployment intent from release execution
- choose one dominant versioning strategy per platform area
- avoid mixing track-based promotion and hard pins without a very clear reason
