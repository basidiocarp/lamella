# Caching Strategies

## Redis Caching Layer

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}
// ... (21 lines trimmed)
    await this.redis.del(`market:${id}`)
  }
}
```

---

## Cache-Aside Pattern

```typescript
async function getMarketWithCache(id: string): Promise<Market> {
  const cacheKey = `market:${id}`

  // Try cache
  const cached = await redis.get(cacheKey)
// ... (9 lines trimmed)

  return market
}
```

---

## Cache Invalidation Strategy

```typescript
class CacheManager {
  constructor(private redis: RedisClient) {}

  // Invalidate on write
  async onMarketUpdate(marketId: string): Promise<void> {
// ... (11 lines trimmed)
    return data
  }
}
```
