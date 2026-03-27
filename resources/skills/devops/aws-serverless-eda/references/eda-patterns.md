# Event-Driven Architecture Patterns

Use these patterns when building AWS serverless systems that communicate through events rather than direct synchronous calls.

## Event Basics

Prefer clear event contracts:

```json
{
  "source": "orders",
  "detailType": "OrderPlaced",
  "detail": {
    "orderId": "12345",
    "customerId": "customer-1",
    "amount": 100.0
  }
}
```

Event contract rules:
- keep event names business-oriented
- version schemas when they evolve
- avoid leaking internal storage models into published events

## Routing Patterns

### Content-Based Routing

```ts
new events.Rule(this, 'HighValueOrders', {
  eventPattern: {
    source: ['orders'],
    detailType: ['OrderPlaced'],
    detail: { amount: [{ numeric: ['>', 1000] }] },
  },
  targets: [new targets.LambdaFunction(highValueHandler)],
})
```

Use when event fields decide the downstream path.

### Filtering

```ts
new events.Rule(this, 'ReorderRule', {
  eventPattern: {
    source: ['inventory'],
    detailType: ['StockLow'],
  },
  targets: [new targets.LambdaFunction(reorderHandler)],
})
```

Filter early so consumers only see relevant events.

### Cross-Account Routing

Use cross-account buses when one domain must publish to another account boundary without creating direct service coupling.

## Processing Patterns

### Transformation

```text
producer event -> EventBridge rule -> transformed payload -> consumer
```

Use this when consumers need a narrower or standardized shape than the producer emits directly.

### Enrichment

```text
event -> lookup extra data -> publish enriched event or continue processing
```

Use sparingly:
- enrich only with data that materially reduces downstream complexity
- avoid making every consumer depend on another hot lookup path

### Fork and Join

Use Step Functions `Parallel` when one event should trigger multiple independent checks and then reconverge.

## Event Sourcing and Projections

Use event sourcing when:
- the event stream is the real source of truth
- auditability matters
- replay and projection rebuilding are real requirements

Support it with:
- projections for read models
- snapshots when replay gets slow
- schema versioning from day one

## Saga Patterns

### Choreography

```text
OrderPlaced -> PaymentRequested -> InventoryReserved -> OrderConfirmed
```

Good for:
- simpler flows
- loosely coupled teams

Tradeoff:
- debugging spans many services and logs

### Orchestration

```text
Step Functions saga:
1. reserve inventory
2. process payment
3. confirm order
4. compensate on failure
```

Good for:
- multi-step business workflows
- centralized visibility and timeout control

## Reliability Rules

Always design for:
- idempotent consumers
- dead-letter handling
- ordering constraints only when genuinely required
- explicit backpressure controls

Examples:
- SQS FIFO when strict ordering matters
- reserved concurrency on consumers
- DLQs for failed event processing

## Default Recommendation

```text
Use EventBridge for routing
Use SQS for buffering and retries
Use Step Functions for coordinated workflows
Use projections for read models
Add event sourcing only when the domain really needs it
```
