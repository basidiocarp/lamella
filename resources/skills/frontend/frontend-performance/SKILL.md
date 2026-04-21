---
name: frontend-performance
description: "Profiles and improves frontend performance."
origin: lamella
---

# Frontend Performance


## Contents

- [Instructions](#instructions)
- [Web Performance](#web-performance)
- [React Performance](#react-performance)
- [Quick Wins Checklist](#quick-wins-checklist)

## When to Use

When profiling performance:

1. **Identify the bottleneck type**: Network, rendering, memory, or compute
2. **Measure baseline** before optimizing
3. **Profile with appropriate tools**
4. **Apply optimizations**
5. **Measure improvement**

## Web Performance

### Core Web Vitals

```bash
# Lighthouse CLI
npx lighthouse https://yoursite.com --view

# With specific metrics
npx lighthouse https://yoursite.com --only-categories=performance
```

**Target Metrics**:
| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5-4s | > 4s |
| INP (Interaction to Next Paint) | < 200ms | 200-500ms | > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1-0.25 | > 0.25 |

### Bundle Analysis

```bash
# Next.js
ANALYZE=true npm run build

# Webpack
npx webpack-bundle-analyzer stats.json

# Vite
npx vite-bundle-visualizer
```

PowerShell equivalent for the Next.js example:

```powershell
$env:ANALYZE='true'; npm run build
```

## React Performance

### React DevTools Profiler

1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Click Record, interact with app, stop recording
4. Analyze flame graph for slow components

### Common React Optimizations

```tsx
// 1. Memoize expensive components
const MemoizedList = React.memo(function List({ items }) {
  return items.map(item => <Item key={item.id} {...item} />);
});

function SearchResults({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();

  const onSortChange = (nextSort: string) => {
    startTransition(() => setSort(nextSort));
  };

  return (
    <Suspense fallback={<Spinner />}>
      <ResultsList query={deferredQuery} pending={isPending} onSortChange={onSortChange} />
    </Suspense>
  );
}
```

## Quick Wins Checklist

- [ ] Enable gzip/brotli compression
- [ ] Add caching headers
- [ ] Lazy load images (`loading="lazy"`)
- [ ] Preconnect to external domains
- [ ] Use CDN for static assets
- [ ] Minimize JavaScript bundle
- [ ] Defer non-critical JS
- [ ] Optimize images (WebP, proper sizing)
