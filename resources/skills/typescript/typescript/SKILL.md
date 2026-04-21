---
name: typescript
description: "Applies TypeScript code style, type-safety patterns, and project conventions."
origin: lamella
---

# TypeScript Code Style Guide

## Types and Type Safety

- Avoid explicit type annotations when TypeScript can infer
- Avoid implicitly `any`; explicitly type when necessary
- Use accurate types: prefer `Record<PropertyKey, unknown>` over `object` or `any`
- Prefer `interface` for object shapes (e.g., React props); use `type` for unions/intersections
- Prefer `as const satisfies XyzInterface` over plain `as const`
- Prefer `@ts-expect-error` over `@ts-ignore` over `as any`
- Avoid meaningless null/undefined parameters; design strict function contracts
- Use type guards for runtime narrowing instead of type assertions:

```typescript
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value;
}
```

## Async Patterns

- Prefer `async`/`await` over callbacks or `.then()` chains
- Prefer async APIs over sync ones (avoid `*Sync`)
- Use promise-based variants: `import { readFile } from 'fs/promises'`
- Use `Promise.all`, `Promise.race` for concurrent operations where safe
- Use `ms` package for readable durations: `ms('2 days')` instead of `172800000`

## Code Structure

- Prefer object destructuring:
  - Instead of `const name = user.name` → `const { name } = user`
  - Instead of `const result = await getUser(userId)` → `const { data: user } = await getUser(userId)`
- Use consistent, descriptive naming; avoid obscure abbreviations
- Replace magic numbers/strings with well-named constants
- Defer formatting to tooling
- Export all types by default

## Library-First Approach

Prefer established libraries over hand-rolling:

| Domain | Libraries |
|--------|-----------|
| Date/time | date-fns, dayjs |
| Form validation | zod, yup |
| HTTP requests | built-in fetch, ky |
| State management | Zustand |
| Durations | ms |

## Performance

- Reuse existing utils in `packages/utils` or installed npm packages
- Assign `Date.now()` to a constant once and reuse for consistency

## Logging

- Never log user private information (API keys, etc.)
- Use `console.error` in catch blocks
