# Data Layer Patterns

Use this page for repository boundaries, query shape, transactions, and cache
placement.

## Query Shape

- select only the columns needed for the response or next service step
- batch related lookups to avoid N+1 access patterns
- keep query builders close to repositories, not controllers

```typescript
const markets = await db.market.findMany({
  select: { id: true, name: true, status: true, volume: true },
  where: { status: 'active' },
  orderBy: { volume: 'desc' },
  take: 10,
})
```

## Transactions

- open the transaction at the service boundary that owns the full write flow
- keep external side effects outside the transaction unless you have an outbox
- always release pooled clients in `finally`

```typescript
await db.$transaction(async (tx) => {
  const market = await tx.market.create({ data: marketData })
  await tx.position.create({
    data: { ...positionData, marketId: market.id },
  })
})
```

## Caching

- cache reads with stable keys and short TTLs
- invalidate by business entity, not by broad wildcards
- prefer repository decorators or read services for cache ownership

```typescript
const cacheKey = `market:${id}`
const cached = await redis.get(cacheKey)
if (cached) return JSON.parse(cached) as MarketView

const market = await repo.findById(id)
await redis.set(cacheKey, JSON.stringify(market), 'EX', 60)
return market
```

## Practical Boundaries

- repositories should hide persistence details, not business decisions
- service code may combine repositories, cache, and transactions
- keep SQL-heavy optimizations documented beside the repository that needs them
