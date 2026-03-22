# Inter-Service Communication Patterns

Comprehensive guide for designing communication between microservices.

## Communication Styles

### Synchronous Communication

**REST APIs:**
```
When to Use:
- Request/response pattern needed
- Client needs immediate result
- Simple CRUD operations
- Public-facing APIs
// ... (11 lines trimmed)
PUT    /api/v1/orders/{orderId}
DELETE /api/v1/orders/{orderId}
PATCH  /api/v1/orders/{orderId}/status
```

**gRPC:**
```
When to Use:
- Low-latency requirements
- Strong typing needed
- Streaming data
- Internal service-to-service calls
// ... (22 lines trimmed)
  string status = 2;
  repeated OrderItem items = 3;
}
```

**GraphQL:**
```
When to Use:
- Frontend-driven data requirements
- Aggregating data from multiple services
- Flexible query requirements
- Reducing over-fetching/under-fetching
// ... (17 lines trimmed)
  id: ID! @external
  orders: [Order!]!
}
```

### Asynchronous Communication

**Message Queues (Point-to-Point):**
```
When to Use:
- Task distribution
- Load leveling
- Guaranteed delivery needed
- Single consumer per message
// ... (14 lines trimmed)
- Email/SMS sending
- Image processing
- Report generation
```

**Event Streaming (Pub/Sub):**
```
When to Use:
- Multiple consumers need same event
- Event sourcing
- Real-time data pipelines
- Audit logging
// ... (15 lines trimmed)
- WarehouseService (prepare shipment)

Each consumer processes independently
```

**Event-Driven Architecture:**
```
Event Types:

1. Domain Events:
   - order.placed
   - payment.completed
// ... (31 lines trimmed)
    "currency": "USD"
  }
}
```

## Communication Patterns

### Request/Response

**Synchronous Request/Response:**
```
Pattern:
Client → Service A → Service B → Response

Pros:
- Simple to implement
// ... (11 lines trimmed)
- Small number of hops (max 2-3)
- Low latency requirements
- Failure of dependency should fail request
```

**Asynchronous Request/Response:**
```
Pattern:
1. Client sends request to Service A
2. Service A returns request ID immediately
3. Service A processes asynchronously
4. Client polls or receives webhook when complete
// ... (14 lines trimmed)
}

Alternative: WebSocket notification when ready
```

### Fire and Forget

**Pattern:**
```
Client → Message Queue → Consumer

Characteristics:
- Client doesn't wait for response
- Eventual consistency
// ... (19 lines trimmed)
- No immediate feedback
- Requires status tracking
- Complex error handling
```

### Event Choreography

**Pattern:**
```
Distributed workflow via events (no central orchestrator)

Example: Order Placement
1. OrderService publishes: order.created
2. PaymentService listens, processes payment, publishes: payment.completed
// ... (11 lines trimmed)
- Hard to debug
- No central monitoring
- Eventual consistency challenges
```

### Saga Orchestration

**Pattern:**
```
Central orchestrator manages distributed transaction

Example: Order Saga
Orchestrator: OrderSagaService

// ... (22 lines trimmed)
- Orchestrator can become bottleneck
- Single point of failure (mitigate with HA)
- More complex implementation
```

## Protocol Selection Guide

### Decision Matrix

**REST vs gRPC:**
```
Use REST when:
- Public API (external clients)
- Browser-based clients
- Human-readable debugging needed
// ... (7 lines trimmed)
- Bi-directional streaming
- Polyglot teams (code generation)
```

**Synchronous vs Asynchronous:**
```
Use Synchronous when:
- User waiting for response
- Strong consistency required
- Simple request/response
// ... (7 lines trimmed)
- High throughput required
- Eventual consistency acceptable
```

**Message Queue vs Event Stream:**
```
Use Message Queue (RabbitMQ, SQS) when:
- Single consumer per message
- Task distribution
- Guaranteed processing
// ... (6 lines trimmed)
- Event sourcing
- Long retention required
```

## API Design Best Practices

### RESTful API Design

**URL Structure:**
```
Good:
GET    /api/v1/customers/{customerId}/orders
POST   /api/v1/orders
GET    /api/v1/orders/{orderId}/items

Avoid:
GET    /api/v1/getCustomerOrders?customerId=123
POST   /api/v1/createOrder
```

**Versioning Strategies:**
```
1. URL Versioning:
   /api/v1/orders
   /api/v2/orders
   Pros: Clear, easy to route
   Cons: URL pollution
// ... (9 lines trimmed)
   Cons: Easy to miss

Recommendation: URL versioning for simplicity
```

**Pagination:**
```
Cursor-Based (Recommended):
GET /api/v1/orders?cursor=abc123&limit=20
Response:
{
// ... (6 lines trimmed)
GET /api/v1/orders?page=2&pageSize=20
Problem: Results change if data inserted
```

### gRPC Best Practices

**Error Handling:**
```
Use standard gRPC status codes:
- OK (0)
- INVALID_ARGUMENT (3)
- NOT_FOUND (5)
- ALREADY_EXISTS (6)
// ... (8 lines trimmed)
}

Error details in metadata for rich context
```

**Streaming Patterns:**
```
1. Server Streaming:
   rpc ListOrders(ListRequest) returns (stream Order);
   Use: Large result sets

// ... (5 lines trimmed)
   rpc Chat(stream Message) returns (stream Message);
   Use: Real-time communication
```

## Summary

Choose communication patterns based on:
- Consistency requirements (strong vs eventual)
- Latency tolerance
- Coupling tolerance
- Complexity budget
- Team expertise

**Rule of Thumb:**
- Synchronous for reads and simple writes
- Asynchronous for complex workflows
- Events for cross-aggregate updates
- Sagas for distributed transactions

Always implement timeouts, retries, and circuit breakers regardless of pattern chosen.
