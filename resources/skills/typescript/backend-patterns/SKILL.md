---
name: backend-patterns
description: >-
  Applies backend architecture and production Node.js patterns. Use when designing REST or GraphQL APIs, implementing
  repository/service/controller layers, dependency injection, database transactions, Redis caching, rate limiting,
  Zod validation, or graceful shutdown. Standard Express/Fastify/Hono setup is assumed knowledge.
---

# Backend Development Patterns

Backend architecture patterns and production implementation patterns for scalable server-side applications.


## Contents

- [When to Use](#when-to-use)
- [Architecture Patterns](#architecture-patterns)
- [Implementation Patterns](#implementation-patterns)
- [Reference Files](#reference-files)


## When to Use

- Designing REST or GraphQL API endpoints
- Implementing repository, service, or controller layers
- Setting up dependency injection
- Handling database transactions with proper cleanup
- Adding caching (Redis, in-memory, HTTP cache headers)
- Implementing rate limiting, validation middleware
- Building graceful shutdown for zero-downtime deploys
- Structuring error handling and validation for APIs

## Architecture Patterns

### RESTful API Structure

```typescript
// Resource-based URLs
GET    /api/markets                 # List resources
GET    /api/markets/:id             # Get single resource
POST   /api/markets                 # Create resource
PUT    /api/markets/:id             # Replace resource
PATCH  /api/markets/:id             # Update resource
DELETE /api/markets/:id             # Delete resource

// Query parameters for filtering, sorting, pagination
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

### Repository Pattern

```typescript
interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<Market[]>
  findById(id: string): Promise<Market | null>
  create(data: CreateMarketDto): Promise<Market>
  update(id: string, data: UpdateMarketDto): Promise<Market>
// ... (10 lines trimmed)
    return data
  }
}
```

### Service Layer Pattern

```typescript
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))
    return markets.sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }
}
```

### Middleware Pattern

```typescript
export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    try {
      const user = await verifyToken(token)
      req.user = user
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}
```

## Implementation Patterns

Standard patterns (MVC layers, basic middleware, CRUD routes, JWT basics, pg/mongoose connections) are assumed knowledge. This section covers non-obvious production patterns.

### Async Error Wrapper

Eliminates try/catch boilerplate in Express route handlers:

```typescript
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.getUser(req.params.id);
  res.json(user);
}));
```

### Simple DI Container

Lightweight dependency injection without frameworks:

```typescript
class Container {
  private instances = new Map<string, () => any>();

  singleton<T>(key: string, factory: () => T): void {
    let instance: T;
// ... (14 lines trimmed)
container.singleton('db', () => new Pool(config));
container.singleton('userRepo', () => new UserRepository(container.resolve('db')));
container.singleton('userService', () => new UserService(container.resolve('userRepo')));
```

### Transaction Pattern with Proper Cleanup

```typescript
async createOrder(userId: string, items: OrderItem[]) {
  const client = await this.db.connect();
  try {
    await client.query('BEGIN');
    const orderId = await this.insertOrder(client, userId, items);
// ... (8 lines trimmed)
    client.release(); // Always release, even on error
  }
}
```

### Cache Decorator

```typescript
export function Cacheable(ttl: number = 300) {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const cacheKey = `${key}:${JSON.stringify(args)}`;
      const cached = await cache.get(cacheKey);
      if (cached) return cached;
      const result = await original.apply(this, args);
      await cache.set(cacheKey, result, ttl);
      return result;
    };
    return descriptor;
  };
}
```

### Redis Pattern Invalidation

```typescript
async invalidatePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) await redis.del(...keys);
}

await cache.invalidatePattern('user:123:*');
await cache.invalidatePattern('product:*');
```

### Rate Limiting with Redis Store

```typescript
import RedisStore from 'rate-limit-redis';

export const authLimiter = rateLimit({
  store: new RedisStore({ client: redis, prefix: 'rl:auth:' }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});
```

### Zod Validation Middleware

```typescript
export const validate = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
// ... (9 lines trimmed)
      } else next(error);
    }
  };
```

### Graceful Shutdown

```typescript
const shutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(async () => {
    await pool.end();
    await redis.quit();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

### Paginated Response Helper

```typescript
export const paginated = <T>(
  res: Response, data: T[], page: number, limit: number, total: number
) => res.json({
  status: 'success',
  data,
  pagination: { page, limit, total, pages: Math.ceil(total / limit) },
});
```

### Pool Configuration Tips

```typescript
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected pool error', err);
  process.exit(-1);
});
```

## Reference Files

| File | Description |
|------|-------------|
| [api-patterns.md](references/api-patterns.md) | RESTful, Repository, Service Layer, Middleware patterns |
| [database-patterns.md](references/database-patterns.md) | Query optimization, N+1 prevention, transactions |
| [caching-strategies.md](references/caching-strategies.md) | Redis patterns, cache-aside, invalidation |
| [auth-patterns.md](references/auth-patterns.md) | JWT validation, RBAC implementation |
| [operational-patterns.md](references/operational-patterns.md) | Rate limiting, queues, logging |
| [data-layer.md](references/data-layer.md) | Database patterns and caching strategies |
| [security-patterns.md](references/security-patterns.md) | Authentication, authorization, and rate limiting |
| [infrastructure.md](references/infrastructure.md) | Error handling, background jobs, and logging |
