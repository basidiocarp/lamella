# Payload CMS Hooks Reference

Use this page to choose the hook surface you need.

## Reference Map

| Need | Load |
|------|------|
| Collection hooks, field hooks, and phase selection | [hook-surfaces.md](hook-surfaces.md) |
| Hook context, revalidation, and transaction-aware nested work | [hook-context-and-side-effects.md](hook-context-and-side-effects.md) |

## Rule

Pick the earliest hook phase that solves the problem without smuggling side effects into validation-only hooks.
