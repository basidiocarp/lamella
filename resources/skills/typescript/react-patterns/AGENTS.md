# React Best Practices

Use this file as the routing index for the focused React and Next.js performance rules in `rules/`. The detailed rule files are the source of truth; this overview exists so agents can pick the right category quickly.

## Priority Order

1. Eliminate waterfalls.
2. Reduce bundle size.
3. Fix server-side fetch and caching mistakes.
4. Reduce unnecessary client work and rerenders.
5. Optimize rendering and low-level JavaScript only after the major issues are solved.

## Rule Groups

### Async and Waterfalls

- `rules/async-defer-await.md`
- `rules/async-dependencies.md`
- `rules/async-api-routes.md`
- `rules/async-parallel.md`
- `rules/async-suspense-boundaries.md`

### Bundle Size

- `rules/bundle-barrel-imports.md`
- `rules/bundle-conditional.md`
- `rules/bundle-defer-third-party.md`
- `rules/bundle-dynamic-imports.md`
- `rules/bundle-preload.md`

### Server Performance

- `rules/server-cache-lru.md`
- `rules/server-serialization.md`
- `rules/server-parallel-fetching.md`
- `rules/server-cache-react.md`
- `rules/server-after-nonblocking.md`

### Client Data and Events

- `rules/client-event-listeners.md`
- `rules/client-passive-event-listeners.md`
- `rules/client-swr-dedup.md`
- `rules/client-localstorage-schema.md`

### Rerenders and Rendering

- `rules/rerender-defer-reads.md`
- `rules/rerender-memo.md`
- `rules/rerender-dependencies.md`
- `rules/rerender-derived-state.md`
- `rules/rerender-functional-setstate.md`
- `rules/rerender-lazy-state-init.md`
- `rules/rerender-transitions.md`
- `rules/rendering-activity.md`
- `rules/rendering-content-visibility.md`
- `rules/rendering-hoist-jsx.md`
- `rules/rendering-hydration-no-flicker.md`
- `rules/rendering-conditional-render.md`
- `rules/rendering-animate-svg-wrapper.md`
- `rules/rendering-svg-precision.md`

### JavaScript Micro-Patterns

- `rules/js-batch-dom-css.md`
- `rules/js-index-maps.md`
- `rules/js-cache-property-access.md`
- `rules/js-cache-function-results.md`
- `rules/js-cache-storage.md`
- `rules/js-combine-iterations.md`
- `rules/js-length-check-first.md`
- `rules/js-early-exit.md`
- `rules/js-hoist-regexp.md`
- `rules/js-min-max-loop.md`
- `rules/js-set-map-lookups.md`
- `rules/js-tosorted-immutable.md`

### Advanced React Patterns

- `rules/advanced-event-handler-refs.md`
- `rules/advanced-use-latest.md`
