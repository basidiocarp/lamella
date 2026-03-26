---
name: react-patterns
description: Applies React and Next.js component patterns for performance, accessibility, and animation work. Use when building components, optimizing re-renders, managing data fetching, improving bundle size, or reviewing React or Next.js code.
---

# React Patterns


## Contents

- [Component Patterns](#component-patterns)
  - [Compound Components](#compound-components)
  - [Render Props for Flexible Data Loading](#render-props-for-flexible-data-loading)
- [Performance](#performance)
  - [Virtualization for Long Lists](#virtualization-for-long-lists)
  - [Code Splitting](#code-splitting)
- [Accessibility](#accessibility)
  - [Focus Management in Modals](#focus-management-in-modals)
  - [Keyboard Navigation in Dropdowns](#keyboard-navigation-in-dropdowns)
- [Animation with Framer Motion](#animation-with-framer-motion)
- [Next.js Performance Rules](#nextjs-performance-rules)
  - [1. Eliminating Waterfalls (CRITICAL)](#1-eliminating-waterfalls-critical)
  - [2. Bundle Size Optimization (CRITICAL)](#2-bundle-size-optimization-critical)
  - [3. Server-Side Performance (HIGH)](#3-server-side-performance-high)
  - [4. Client-Side Data Fetching (MEDIUM-HIGH)](#4-client-side-data-fetching-medium-high)
  - [5. Re-render Optimization (MEDIUM)](#5-re-render-optimization-medium)
  - [6. Rendering Performance (MEDIUM)](#6-rendering-performance-medium)
  - [7. JavaScript Performance (LOW-MEDIUM)](#7-javascript-performance-low-medium)
  - [8. Advanced Patterns (LOW)](#8-advanced-patterns-low)


Standard React patterns are assumed knowledge. Only non-obvious patterns, performance rules, and project conventions here.

## Component Patterns

### Compound Components

Share implicit state between related components via context:

```typescript
const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export function Tabs({ children, defaultTab }: {
  children: React.ReactNode
  defaultTab: string
// ... (20 lines trimmed)
    </button>
  )
}
```

### Render Props for Flexible Data Loading

```typescript
interface DataLoaderProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

// ... (12 lines trimmed)

  return <>{children(data, loading, error)}</>
}
```

## Performance

### Virtualization for Long Lists

Use `@tanstack/react-virtual` for lists over ~100 items:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

// ... (26 lines trimmed)
    </div>
  )
}
```

### Code Splitting

```typescript
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart data={data} />
    </Suspense>
  )
}
```

## Accessibility

### Focus Management in Modals

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
// ... (17 lines trimmed)
    </div>
  ) : null
}
```

### Keyboard Navigation in Dropdowns

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, options.length - 1))
// ... (12 lines trimmed)
      break
  }
}
```

## Animation with Framer Motion

```typescript
<AnimatePresence>
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ItemCard item={item} />
    </motion.div>
  ))}
</AnimatePresence>
```

---

## Next.js Performance Rules

45 rules across 8 categories, prioritized by impact. See `rules/` for detailed explanations and code examples per rule. Full compiled document: `AGENTS.md`.

### 1. Eliminating Waterfalls (CRITICAL)

- `async-defer-await` — Move await into branches where actually used
- `async-parallel` — Use Promise.all() for independent operations
- `async-dependencies` — Use better-all for partial dependencies
- `async-api-routes` — Start promises early, await late in API routes
- `async-suspense-boundaries` — Use Suspense to stream content

### 2. Bundle Size Optimization (CRITICAL)

- `bundle-barrel-imports` — Import directly, avoid barrel files
- `bundle-dynamic-imports` — Use next/dynamic for heavy components
- `bundle-defer-third-party` — Load analytics/logging after hydration
- `bundle-conditional` — Load modules only when feature is activated
- `bundle-preload` — Preload on hover/focus for perceived speed

### 3. Server-Side Performance (HIGH)

- `server-cache-react` — Use React.cache() for per-request deduplication
- `server-cache-lru` — Use LRU cache for cross-request caching
- `server-serialization` — Minimize data passed to client components
- `server-parallel-fetching` — Restructure components to parallelize fetches
- `server-after-nonblocking` — Use after() for non-blocking operations

### 4. Client-Side Data Fetching (MEDIUM-HIGH)

- `client-swr-dedup` — Use SWR for automatic request deduplication
- `client-event-listeners` — Deduplicate global event listeners

### 5. Re-render Optimization (MEDIUM)

- `rerender-defer-reads` — Don't subscribe to state only used in callbacks
- `rerender-memo` — Extract expensive work into memoized components
- `rerender-dependencies` — Use primitive dependencies in effects
- `rerender-derived-state` — Subscribe to derived booleans, not raw values
- `rerender-functional-setstate` — Use functional setState for stable callbacks
- `rerender-lazy-state-init` — Pass function to useState for expensive values
- `rerender-transitions` — Use startTransition for non-urgent updates

### 6. Rendering Performance (MEDIUM)

- `rendering-animate-svg-wrapper` — Animate div wrapper, not SVG element
- `rendering-content-visibility` — Use content-visibility for long lists
- `rendering-hoist-jsx` — Extract static JSX outside components
- `rendering-svg-precision` — Reduce SVG coordinate precision
- `rendering-hydration-no-flicker` — Use inline script for client-only data
- `rendering-activity` — Use Activity component for show/hide
- `rendering-conditional-render` — Use ternary, not && for conditionals

### 7. JavaScript Performance (LOW-MEDIUM)

- `js-batch-dom-css` — Group CSS changes via classes or cssText
- `js-index-maps` — Build Map for repeated lookups
- `js-cache-property-access` — Cache object properties in loops
- `js-cache-function-results` — Cache function results in module-level Map
- `js-cache-storage` — Cache localStorage/sessionStorage reads
- `js-combine-iterations` — Combine multiple filter/map into one loop
- `js-length-check-first` — Check array length before expensive comparison
- `js-early-exit` — Return early from functions
- `js-hoist-regexp` — Hoist RegExp creation outside loops
- `js-min-max-loop` — Use loop for min/max instead of sort
- `js-set-map-lookups` — Use Set/Map for O(1) lookups
- `js-tosorted-immutable` — Use toSorted() for immutability

### 8. Advanced Patterns (LOW)

- `advanced-event-handler-refs` — Store event handlers in refs
- `advanced-use-latest` — useLatest for stable callback refs
