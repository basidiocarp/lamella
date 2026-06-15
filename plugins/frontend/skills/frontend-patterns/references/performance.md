# Performance Optimization

## Memoization

```typescript
import { memo, useMemo } from 'react'

const MarketRow = memo(function MarketRow({ market }: { market: Market }) {
  return (
    <article className="rounded-lg border p-3">
      <h3>{market.title}</h3>
      <p>Volume: {market.volume}</p>
    </article>
  )
})

export function MarketGrid({ markets }: { markets: Market[] }) {
  const sortedMarkets = useMemo(() => [...markets].sort((a, b) => b.volume - a.volume), [markets])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sortedMarkets.map((market) => (
        <MarketRow key={market.id} market={market} />
      ))}
    </div>
  )
}
```

## Code Splitting & Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))
const ThreeJsBackground = lazy(() => import('./ThreeJsBackground'))

export function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart />
      </Suspense>

      <Suspense fallback={<div aria-hidden="true" className="hero-placeholder" />}>
        <ThreeJsBackground />
      </Suspense>
    </div>
  )
}
```

## Virtualization for Long Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: markets.length,
    estimateSize: () => 72,
    getScrollElement: () => parentRef.current,
    overscan: 8,
  })

  return (
    <div ref={parentRef} style={{ height: 480, overflow: 'auto' }}>
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((item) => {
          const market = markets[item.index]
          return (
            <div
              key={market.id}
              style={{
                position: 'absolute',
                top: 0,
                transform: `translateY(${item.start}px)`,
                width: '100%',
              }}
            >
              <MarketRow market={market} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
```
