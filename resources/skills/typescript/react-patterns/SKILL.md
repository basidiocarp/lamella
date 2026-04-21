---
name: react-patterns
description: "Applies React and Next.js component patterns for performance, accessibility, and animation work."
origin: lamella
---

# React Patterns

Use this skill as the router for non-obvious React and Next.js guidance. Standard component syntax, hooks basics, and common JSX patterns are assumed.

## When to Use

- component architecture and reuse
- React or Next.js performance work
- hydration, bundle, or waterfall issues
- accessibility-sensitive UI patterns
- animation choices that affect render cost

## Load Order

1. Start with the nearest matching rule under `rules/`.
2. If the problem spans many performance categories, consult [AGENTS.md](AGENTS.md) as the full compiled rulebook.
3. Keep the `SKILL.md` layer short and use the rule files for detail.

## Quick Routing

| Problem | Start Here |
| --- | --- |
| request waterfalls, early `await`, Suspense streaming | `rules/async-*.md` |
| bundle size and client-load cost | `rules/bundle-*.md` |
| client fetching, SWR, or browser listener issues | `rules/client-*.md` |
| re-render churn, effect deps, stale state reads | `rules/rerender-*.md` |
| render-path cost, hydration mismatch, SVG, visibility | `rules/rendering-*.md` |
| low-level JavaScript hot-path cleanup | `rules/js-*.md` |
| callback refs and advanced event patterns | `rules/advanced-*.md` |

## Non-Obvious Defaults

- eliminate waterfalls before micro-optimizing renders
- prefer route or component restructuring over clever memoization
- keep client bundles small before tuning event handlers
- treat hydration mismatches and browser-only data as explicit design problems

## Small Pattern Starters

### Compound Components

Use compound components when related UI pieces need implicit shared state and a cohesive API.

### Virtualization

Virtualize lists once item counts are large enough to affect mount or scroll cost.

### Accessibility

Focus trapping, keyboard navigation, and dialog return-focus behavior are first-class concerns, not polish items.

### Animation

Animate with explicit entry and exit states, but avoid introducing client-heavy animation libraries into flows that do not need them.

## Reference Boundary

This skill intentionally stays thin because the detailed rule set already lives in:

- [AGENTS.md](AGENTS.md)
- the `rules/` directory

If you need the full 40+ rule compilation, read [AGENTS.md](AGENTS.md). If you need an actionable fix, open the matching rule file directly.
