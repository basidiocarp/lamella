# Caching Strategies

## Redis Caching Layer

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async getById(id: string): Promise<Market | null> {
    const cacheKey = `market:${id}`
    const cached = await this.redis.get(cacheKey)
    if (cached) return JSON.parse(cached) as Market

    const market = await this.baseRepo.getById(id)
    if (market) {
      await this.redis.set(cacheKey, JSON.stringify(market), { EX: 300 })
    }

    return market
  }

  async update(id: string, input: UpdateMarketInput): Promise<Market> {
    const updated = await this.baseRepo.update(id, input)
    await this.redis.del(`market:${id}`)
    return updated
  }
}
```

---

## Cache-Aside Pattern

```typescript
async function getMarketWithCache(id: string): Promise<Market> {
  const cacheKey = `market:${id}`
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached) as Market

  const market = await marketRepository.getById(id)
  if (!market) throw new Error('Market not found')

  await redis.set(cacheKey, JSON.stringify(market), { EX: 300 })
  return market
}
```

---

## Cache Invalidation Strategy

```typescript
class CacheManager {
  constructor(private redis: RedisClient) {}

  async onMarketUpdate(marketId: string): Promise<void> {
    await Promise.all([
      this.redis.del(`market:${marketId}`),
      this.redis.del('markets:list:active'),
      this.redis.del('markets:list:featured'),
    ])
  }

  async withRefresh<T>(key: string, ttlSeconds: number, load: () => Promise<T>): Promise<T> {
    const cached = await this.redis.get(key)
    if (cached) return JSON.parse(cached) as T

    const data = await load()
    await this.redis.set(key, JSON.stringify(data), { EX: ttlSeconds })
    return data
  }
}
```
