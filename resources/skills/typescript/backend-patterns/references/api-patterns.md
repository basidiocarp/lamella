# API Design Patterns

Use this page for request/response shape, service boundaries, and middleware
composition.

## Route Shape

- use resource-oriented paths and reserve verbs for actions that are not normal
  CRUD
- keep filtering, sorting, and pagination in query params
- prefer explicit versioning or compatibility headers before introducing
  breaking route changes

```typescript
GET    /api/markets
GET    /api/markets/:id
POST   /api/markets
PATCH  /api/markets/:id
DELETE /api/markets/:id
GET    /api/markets?status=active&sort=volume&limit=20&cursor=abc123
```

## Repository and Service Boundaries

- repositories own persistence
- services own business rules and multi-repository orchestration
- handlers should translate HTTP input into service calls and map errors back
  into responses

```typescript
interface MarketRepository {
  findById(id: string): Promise<Market | null>
  create(input: CreateMarketInput): Promise<Market>
}

class MarketService {
  constructor(private readonly markets: MarketRepository) {}

  async create(input: CreateMarketInput): Promise<Market> {
    return this.markets.create(input)
  }
}
```

## Middleware

- compose auth, validation, and observability in a stable order
- avoid business logic in middleware unless it truly applies to many routes
- give middleware one job: attach identity, validate input, rate-limit, or log

```typescript
export const createMarketHandler = withLogging(
  withAuth(
    withValidation(createMarketSchema, async (req) => {
      const market = await marketService.create(req.validated.body)
      return NextResponse.json(market, { status: 201 })
    }),
  ),
)
```

## Response Rules

- return stable error codes and machine-readable fields
- keep transport DTOs separate from persistence models
- document idempotency and eventual consistency where writes are asynchronous
