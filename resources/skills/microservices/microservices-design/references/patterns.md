# Microservices Architecture Patterns

High-value architectural patterns to combine with service boundary design.

## API Gateway

```text
Client -> API Gateway -> OrderService / UserService / BillingService
```

Use when:
- clients need one stable entry point
- auth, rate limiting, and routing should stay centralized
- backend services should stay internal

Avoid turning the gateway into:
- a business-logic monolith
- the only place where composition can happen

## Backend for Frontend (BFF)

```text
Web App -> Web BFF -> domain services
Mobile App -> Mobile BFF -> domain services
```

Use when:
- web and mobile need different payloads
- one client needs fewer hops
- frontend-specific orchestration should not leak into domain services

## Event-Driven Integration

```text
OrderService publishes order.placed
InventoryService reserves stock
BillingService starts charge workflow
NotificationService sends confirmation
```

Use when:
- services should react independently
- temporal decoupling helps throughput
- eventual consistency is acceptable

## Anti-Corruption Layer

```text
Legacy ERP -> translation layer -> Order domain model
```

Use when:
- one service depends on a legacy or third-party model
- you need to keep foreign schemas from polluting your domain
- migration will happen gradually

## Strangler Fig

```text
Existing monolith routes:
- /orders -> new OrderService
- everything else -> monolith
```

Use when:
- a monolith must be split incrementally
- risk is lower with route-by-route replacement
- the new service can own a narrow slice first

## Service Mesh / Sidecar

```text
service container + sidecar proxy
```

Use when:
- mTLS, retries, and traffic shaping should be infrastructure-managed
- many services need the same cross-cutting controls
- the team can support the added operational complexity

Rule of thumb:
- start with API gateway + clear boundaries
- add BFFs when client needs diverge
- add event-driven integration for decoupled workflows
- use anti-corruption and strangler patterns for migration work
- introduce a mesh only when manual per-service policy becomes the real bottleneck
