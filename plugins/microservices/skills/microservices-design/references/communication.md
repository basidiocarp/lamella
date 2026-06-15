# Inter-Service Communication Patterns

Concise guide for choosing communication styles between microservices.

## Synchronous Options

### REST

```text
Use when:
- request/response latency matters
- the API is public or browser-facing
- resource-oriented CRUD is a good fit

Example:
GET    /api/v1/orders/{order_id}
POST   /api/v1/orders
PATCH  /api/v1/orders/{order_id}/status
```

### gRPC

```proto
service OrderService {
  rpc GetOrder(GetOrderRequest) returns (OrderResponse);
  rpc StreamOrderEvents(OrderRequest) returns (stream OrderEvent);
}

message OrderResponse {
  string id = 1;
  string status = 2;
  repeated OrderItem items = 3;
}
```

Use gRPC when:
- services are internal
- strict contracts and code generation help
- streaming or low overhead matters

### GraphQL

```graphql
type Query {
  order(id: ID!): Order
}

type Order {
  id: ID!
  status: String!
  customer: Customer!
}
```

Use GraphQL when:
- consumers need flexible field selection
- one client call must aggregate multiple services
- over-fetching is a repeated problem

## Asynchronous Options

### Message Queue

```text
Producer -> queue -> single consumer

Best for:
- background jobs
- guaranteed processing
- load leveling
```

Typical examples:
- email sending
- image processing
- report generation

### Event Stream

```text
Producer -> topic -> many consumers

Best for:
- domain events
- analytics pipelines
- audit streams
```

Typical examples:
- order placed -> payment, inventory, warehouse each react
- account updated -> search index and analytics refresh

## Communication Patterns

### Request / Response

```text
Client -> Service A -> Service B -> response
```

Choose this when:
- the caller must know the outcome immediately
- failures should fail the request visibly
- the number of hops stays small

### Async Request / Response

```text
1. Client submits work
2. Service returns request ID
3. Work continues asynchronously
4. Client polls or receives webhook when complete
```

Choose this when:
- work is too slow for an interactive request
- progress tracking matters
- eventual completion is acceptable

### Event Choreography

```text
OrderService -> order.created
PaymentService -> payment.completed
InventoryService -> inventory.reserved
NotificationService -> order.confirmed
```

Choose this when:
- teams own separate reactions cleanly
- no central coordinator is needed
- eventual consistency is acceptable

Risk:
- debugging gets harder without strong tracing and event contracts

## Selection Guide

```text
Choose synchronous when:
- a user is waiting
- strong consistency is required
- the workflow is short and easy to reason about

Choose asynchronous when:
- throughput matters more than immediacy
- work can be retried or buffered
- downstream systems should be decoupled
```

Protocol rule of thumb:
- REST for external APIs
- gRPC for internal service contracts
- GraphQL for consumer-shaped aggregation
- queues for background work
- streams for many independent consumers
