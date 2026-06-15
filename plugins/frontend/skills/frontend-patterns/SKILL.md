---
name: frontend-patterns
description: "Applies modern frontend architecture patterns."
origin: lamella
---

# Frontend Development Patterns

## Contents

- [When to Use](#when-to-use)
- [Component Patterns](#component-patterns)
- [Custom Hooks](#custom-hooks)
- [Performance Optimization](#performance-optimization)
- [References](#references)

Modern frontend patterns for React, Next.js, and performant user interfaces.

## When to Use

- Building React components (composition, props, rendering)
- Managing state (useState, useReducer, Zustand, Context)
- Implementing data fetching (SWR, React Query, server components)
- Optimizing performance (memoization, virtualization, code splitting)
- Working with forms (validation, controlled inputs, Zod schemas)
- Building accessible, responsive UI patterns
- Implementing error boundaries and fallback UIs
- Creating distinctive, polished frontend interfaces with strong aesthetics
- Reviewing visual evidence to confirm that a UI change actually achieved its goal
- Deciding whether 3D is justified or whether a simpler visual approach would work better

## Component Patterns

| Pattern | Use Case |
|---------|----------|
| Composition | Building flexible, reusable components (Card, CardHeader, CardBody) |
| Compound Components | Related components sharing state (Tabs, TabList, Tab) |
| Render Props | Flexible data/UI separation (DataLoader with children function) |
| Error Boundary | Catching and handling component errors gracefully |

See [references/component-patterns.md](references/component-patterns.md) for full examples.

## Custom Hooks

| Hook | Purpose |
|------|---------|
| `useToggle` | Boolean state with toggle function |
| `useQuery` | Async data fetching with loading/error states |
| `useDebounce` | Debounce value changes (search inputs) |
| Context + Reducer | Complex state management with actions |

See [references/hooks.md](references/hooks.md) for implementations.

## Performance Optimization

### Memoization
```typescript
// useMemo for expensive computations
const sorted = useMemo(() => items.sort(...), [items])

// useCallback for functions passed to children
const handleClick = useCallback(() => ..., [])

// React.memo for pure components
export const Item = React.memo(({ data }) => <div>{data}</div>)
```

### Code Splitting
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>
```

### Virtualization
Use `@tanstack/react-virtual` for long lists (1000+ items).

See [references/performance.md](references/performance.md) for full examples.

## References

- [Component Patterns](references/component-patterns.md) - Composition, compound components, render props, error boundaries
- [Hooks](references/hooks.md) - useToggle, useQuery, useDebounce, Context+Reducer
- [Performance](references/performance.md) - Memoization, code splitting, virtualization
- [Forms & Accessibility](references/forms-accessibility.md) - Form validation, animations, keyboard nav, focus management
- [Error Boundaries](references/error-boundaries.md) - React error boundaries, Next.js error handling, async error patterns, error reporting
- [Design Aesthetics](references/design-aesthetics.md) - Distinctive UI design, typography, color, motion, spatial composition
- [Visual Validation](references/visual-validation.md) - Adversarial screenshot review, visual QA checklists, and evidence-first UI verification
- [3D Experience](references/3d-experience.md) - When 3D belongs in the interface, stack selection, and GLB pipeline checks

**Remember**: Choose patterns that fit your project complexity. Start simple, optimize when needed.
