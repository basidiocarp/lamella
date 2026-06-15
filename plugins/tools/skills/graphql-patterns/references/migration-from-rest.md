# Migrating from REST to GraphQL

## When to Use This Guide

Use GraphQL when you need:
- multiple clients with different data shapes
- nested data access without extra round trips
- schema-driven contracts and introspection
- a BFF layer that composes existing services

Do not migrate just to follow a trend. If the REST API is stable, simple, and
already serves a single client well, GraphQL may add complexity without enough
benefit.

## Concept Mapping: REST to GraphQL

| REST concept | GraphQL concept |
|--------------|-----------------|
| `GET /resource` | query |
| `POST/PUT/DELETE` | mutation |
| URL nesting | field nesting |
| query params | typed arguments |
| endpoint versioning | schema evolution and deprecation |

## Pattern 1: `GET` Endpoints to Queries

### REST Endpoint

```http
GET /users/42
GET /users/42/orders?limit=5
```

### GraphQL Schema

```graphql
type Query {
  user(id: ID!): User
}

type User {
  id: ID!
  name: String!
  orders(limit: Int = 10): [Order!]!
}
```

### Resolver with DataLoader

```ts
const resolvers = {
  Query: {
    user: (_parent: unknown, args: { id: string }, ctx: Context) =>
      ctx.userService.getById(args.id),
  },
  User: {
    orders: (user: User, args: { limit: number }, ctx: Context) =>
      ctx.orderLoader.load({ userId: user.id, limit: args.limit }),
  },
};
```

### Client Query

```graphql
query UserWithRecentOrders($id: ID!) {
  user(id: $id) {
    id
    name
    orders(limit: 5) {
      id
      total
      status
    }
  }
}
```

## Pattern 2: REST Writes to Mutations

### REST Endpoints

```http
POST /orders
PUT /orders/42
DELETE /orders/42
```

### GraphQL Schema

```graphql
type Mutation {
  createOrder(input: CreateOrderInput!): Order!
  updateOrder(id: ID!, input: UpdateOrderInput!): Order!
  cancelOrder(id: ID!): CancelOrderResult!
}
```

### Mutation Resolvers

```ts
const resolvers = {
  Mutation: {
    createOrder: (_: unknown, { input }: { input: CreateOrderInput }, ctx: Context) =>
      ctx.orderService.create(input),
    updateOrder: (_: unknown, { id, input }: { id: string; input: UpdateOrderInput }, ctx: Context) =>
      ctx.orderService.update(id, input),
    cancelOrder: (_: unknown, { id }: { id: string }, ctx: Context) =>
      ctx.orderService.cancel(id),
  },
};
```

### Client Mutation

```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    status
    total
  }
}
```

## Pattern 3: Pagination Migration

### REST Offset Pagination

```http
GET /products?page=3&pageSize=20
```

### GraphQL Connection Pattern

```graphql
type Query {
  products(first: Int = 20, after: String): ProductConnection!
}

type ProductConnection {
  edges: [ProductEdge!]!
  pageInfo: PageInfo!
}

type ProductEdge {
  cursor: String!
  node: Product!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}
```

### Pagination Resolver

```ts
async function products(
  _: unknown,
  args: { first: number; after?: string },
  ctx: Context,
) {
  return ctx.productService.listConnection(args);
}
```

## Pattern 4: Authentication and Authorization

### REST Style

```http
Authorization: Bearer <token>
```

### GraphQL Context

```ts
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  context: async ({ req }) => {
    const user = await authenticate(req.headers.authorization);
    return { user };
  },
});
```

### Field-Level Authorization

```ts
const resolvers = {
  User: {
    email: (user: User, _args: unknown, ctx: Context) => {
      if (!ctx.user || ctx.user.id !== user.id) {
        throw new Error("forbidden");
      }
      return user.email;
    },
  },
};
```

## BFF Pattern

GraphQL is often most successful as a composition layer over existing REST
services rather than a full replacement on day one.

```ts
const resolvers = {
  Query: {
    dashboard: async (_: unknown, _args: unknown, ctx: Context) => {
      const [profile, orders, notifications] = await Promise.all([
        ctx.userService.getProfile(),
        ctx.orderService.listRecent(),
        ctx.notificationService.listUnread(),
      ]);

      return { profile, orders, notifications };
    },
  },
};
```

## Incremental Migration Strategy

1. Add GraphQL as a wrapper over existing REST services.
2. Migrate one read-heavy client flow first.
3. Add mutations after query patterns are stable.
4. Deprecate REST endpoints only after usage drops and operational confidence is high.

## Common Pitfalls

### N+1 Queries

Use batching or DataLoader for child-field lookups.

### Exposing Database Shapes Directly

GraphQL types should model product-facing concepts, not raw table layouts.

### Missing Error Policy

Define how business errors, auth failures, and partial-data responses surface to
clients.

### Ignoring Query Complexity

Add depth and cost limits before exposing public or high-traffic graphs.

### Over-Normalization

Do not reproduce every internal service boundary in the public schema. Compose a
useful client-facing API instead.

## Migration Checklist

- [ ] Identify candidate client flows that benefit from field selection
- [ ] Map current REST resources to GraphQL types and operations
- [ ] Add batching for nested lookups
- [ ] Define auth and error conventions
- [ ] Add query-cost or depth protection
- [ ] Roll out one client path before broader migration
