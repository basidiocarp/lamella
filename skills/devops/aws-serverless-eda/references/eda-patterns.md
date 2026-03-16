# Event-Driven Architecture Patterns

Comprehensive patterns for building event-driven systems on AWS with serverless technologies.

## Table of Contents

- [Core EDA Concepts](#core-eda-concepts)
- [Event Routing Patterns](#event-routing-patterns)
- [Event Processing Patterns](#event-processing-patterns)
- [Event Sourcing Patterns](#event-sourcing-patterns)
- [Saga Patterns](#saga-patterns)
- [Best Practices](#best-practices)

## Core EDA Concepts

### Event Types

**Domain Events**: Represent business facts
```json
{
  "source": "orders",
  "detailType": "OrderPlaced",
  "detail": {
    "orderId": "12345",
    "customerId": "customer-1",
    "amount": 100.00,
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

**System Events**: Technical occurrences
```json
{
  "source": "aws.s3",
  "detailType": "Object Created",
  "detail": {
    "bucket": "my-bucket",
    "key": "data/file.json"
  }
}
```

### Event Contracts

Define clear contracts between producers and consumers:

```typescript
// schemas/order-events.ts
export interface OrderPlacedEvent {
  orderId: string;
  customerId: string;
  items: Array<{
// ... (12 lines trimmed)
  schemaName: 'OrderPlaced',
  definition: events.SchemaDefinition.fromInline(/* JSON Schema */),
});
```

## Event Routing Patterns

### Pattern 1: Content-Based Routing

Route events based on content:

```typescript
// Route by order amount
new events.Rule(this, 'HighValueOrders', {
  eventPattern: {
    source: ['orders'],
    detailType: ['OrderPlaced'],
// ... (14 lines trimmed)
  },
  targets: [new targets.LambdaFunction(standardOrderFunction)],
});
```

### Pattern 2: Event Filtering

Filter events before processing:

```typescript
// Filter by multiple criteria
new events.Rule(this, 'FilteredRule', {
  eventPattern: {
    source: ['inventory'],
// ... (7 lines trimmed)
  targets: [new targets.LambdaFunction(reorderFunction)],
});
```

### Pattern 3: Event Replay and Archive

Store events for replay and audit:

```typescript
// Archive all events
const archive = new events.Archive(this, 'EventArchive', {
  eventPattern: {
    account: [this.account],
  },
  retention: Duration.days(365),
});

// Replay events when needed
// Use AWS Console or CLI to replay from archive
```

### Pattern 4: Cross-Account Event Routing

Route events to other AWS accounts:

```typescript
// Event bus in Account A
const eventBus = new events.EventBus(this, 'SharedBus');

// Grant permission to Account B
eventBus.addToResourcePolicy(new iam.PolicyStatement({
// ... (17 lines trimmed)
    )
  )],
});
```

## Event Processing Patterns

### Pattern 1: Event Transformation

Transform events before routing:

```typescript
// EventBridge input transformer
new events.Rule(this, 'TransformRule', {
  eventPattern: {
    source: ['orders'],
// ... (8 lines trimmed)
  })],
});
```

### Pattern 2: Event Aggregation

Aggregate multiple events:

```typescript
// DynamoDB stores partial results
export const handler = async (event: any) => {
  const { transactionId, step, data } = event;

  // Store step result
// ... (22 lines trimmed)
    });
  }
};
```

### Pattern 3: Event Enrichment

Enrich events with additional data:

```typescript
export const enrichEvent = async (event: any) => {
  const { customerId } = event.detail;

  // Fetch additional customer data
  const customer = await dynamodb.getItem({
// ... (15 lines trimmed)
    }],
  });
};
```

### Pattern 4: Event Fork and Join

Process event multiple ways then aggregate:

```typescript
// Step Functions parallel + aggregation
const parallel = new stepfunctions.Parallel(this, 'ForkProcessing');

parallel.branch(new tasks.LambdaInvoke(this, 'ValidateInventory', {
  lambdaFunction: inventoryFunction,
// ... (15 lines trimmed)
    lambdaFunction: aggregateFunction,
  })
);
```

## Event Sourcing Patterns

### Pattern: Event Store with DynamoDB

Store all events as source of truth:

```typescript
const eventStore = new dynamodb.Table(this, 'EventStore', {
  partitionKey: { name: 'aggregateId', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'version', type: dynamodb.AttributeType.NUMBER },
  stream: dynamodb.StreamViewType.NEW_IMAGE,
  pointInTimeRecovery: true, // Important for audit
// ... (33 lines trimmed)

  return state;
};
```

### Pattern: Materialized Views

Create read-optimized projections:

```typescript
// Event store stream triggers projection
eventStore.grantStreamRead(projectionFunction);

new lambda.EventSourceMapping(this, 'Projection', {
  target: projectionFunction,
// ... (19 lines trimmed)
    });
  }
};
```

### Pattern: Snapshots

Optimize event replay with snapshots:

```typescript
export const createSnapshot = async (aggregateId: string) => {
  // Rebuild state from all events
  const state = await rebuildState(aggregateId);
  const version = await getLatestVersion(aggregateId);

// ... (26 lines trimmed)

  return state;
};
```

## Saga Patterns

### Pattern: Choreography-Based Saga

Services coordinate through events:

```typescript
// Order Service publishes event
export const placeOrder = async (order: Order) => {
  await saveOrder(order);

  await eventBridge.putEvents({
// ... (47 lines trimmed)
  },
  targets: [new targets.LambdaFunction(processPaymentFunction)],
});
```

### Pattern: Orchestration-Based Saga

Central coordinator manages saga:

```typescript
// Step Functions orchestrates saga
const definition = new tasks.LambdaInvoke(this, 'ReserveInventory', {
  lambdaFunction: reserveInventoryFunction,
  resultPath: '$.inventory',
})
// ... (23 lines trimmed)
  definition,
  tracingEnabled: true,
});
```

**Comparison**:

| Aspect | Choreography | Orchestration |
|--------|--------------|---------------|
| Coordination | Decentralized | Centralized |
| Coupling | Loose | Tighter |
| Visibility | Distributed logs | Single execution history |
| Debugging | Harder (trace across services) | Easier (single workflow) |
| Best for | Simple flows | Complex flows |

## Best Practices

### Idempotency

**Always make event handlers idempotent**:

```typescript
// Use idempotency keys
export const handler = async (event: any) => {
  const idempotencyKey = event.requestId || event.messageId;

  // Check if already processed
// ... (28 lines trimmed)

  return result;
};
```

### Event Versioning

**Handle event schema evolution**:

```typescript
// Version events
interface OrderPlacedEventV1 {
  version: '1.0';
  orderId: string;
  amount: number;
// ... (29 lines trimmed)
  };
  return processV2(v2Event);
};
```

### Eventual Consistency

**Design for eventual consistency**:

```typescript
// Service A writes to its database
export const createOrder = async (order: Order) => {
  // Write to Order database
  await orderTable.putItem({ Item: order });

// ... (21 lines trimmed)
    ExpressionAttributeValues: { ':qty': orderDetails.quantity },
  });
};
```

### Error Handling in EDA

**Comprehensive error handling strategy**:

```typescript
// Dead Letter Queue for failed events
const dlq = new sqs.Queue(this, 'EventDLQ', {
  retentionPeriod: Duration.days(14),
});

// ... (22 lines trimmed)
  eventSourceArn: dlq.queueArn,
  enabled: false, // Enable manually when reviewing
});
```

### Message Ordering

**When order matters**:

```typescript
// SQS FIFO for strict ordering
const fifoQueue = new sqs.Queue(this, 'OrderedQueue', {
  fifo: true,
  contentBasedDeduplication: true,
  deduplicationScope: sqs.DeduplicationScope.MESSAGE_GROUP,
// ... (19 lines trimmed)
  Data: Buffer.from(JSON.stringify(event)),
  PartitionKey: customerId, // Same key = same shard
});
```

### Deduplication

**Prevent duplicate event processing**:

```typescript
// Content-based deduplication with SQS FIFO
const queue = new sqs.Queue(this, 'Queue', {
  fifo: true,
  contentBasedDeduplication: true, // Hash of message body
});
// ... (24 lines trimmed)
    throw error; // Other error
  }
};
```

### Backpressure Handling

**Prevent overwhelming downstream systems**:

```typescript
// Control Lambda concurrency
const consumerFunction = new lambda.Function(this, 'Consumer', {
  reservedConcurrentExecutions: 10, // Max 10 concurrent
});

// ... (30 lines trimmed)
    throw error;
  }
};
```

## Advanced Patterns

### Pattern: Event Replay

Replay events for recovery or testing:

```typescript
// Archive events for replay
const archive = new events.Archive(this, 'Archive', {
  sourceEventBus: eventBus,
  eventPattern: {
    account: [this.account],
// ... (14 lines trimmed)
    },
  });
};
```

### Pattern: Event Time vs Processing Time

Handle late-arriving events:

```typescript
// Include event timestamp
interface Event {
  eventId: string;
  eventTime: string; // When event occurred
  processingTime?: string; // When event processed
// ... (20 lines trimmed)
    await processWindow(window, eventsInWindow);
  }
};
```

### Pattern: Transactional Outbox

Ensure event publishing with database writes:

```typescript
// Single DynamoDB transaction
export const createOrderWithEvent = async (order: Order) => {
  await dynamodb.transactWriteItems({
    TransactItems: [
      {
// ... (52 lines trimmed)
    });
  }
};
```

## Testing Event-Driven Systems

### Pattern: Event Replay for Testing

```typescript
// Publish test events
export const publishTestEvents = async () => {
  const testEvents = [
    { source: 'orders', detailType: 'OrderPlaced', detail: { orderId: '1' } },
    { source: 'orders', detailType: 'OrderPlaced', detail: { orderId: '2' } },
// ... (13 lines trimmed)
  expect(order1.Item).toBeDefined();
  expect(order2.Item).toBeDefined();
};
```

### Pattern: Event Mocking

```typescript
// Mock EventBridge in tests
const mockEventBridge = {
  putEvents: jest.fn().mockResolvedValue({}),
};

// ... (10 lines trimmed)
    ],
  });
});
```

## Summary

- **Loose Coupling**: Services communicate via events, not direct calls
- **Async Processing**: Use queues and event buses for asynchronous workflows
- **Idempotency**: Always handle duplicate events gracefully
- **Dead Letter Queues**: Configure DLQs for error handling
- **Event Contracts**: Define clear schemas for events
- **Observability**: Enable tracing and monitoring across services
- **Eventual Consistency**: Design for it, don't fight it
- **Saga Patterns**: Use for distributed transactions
- **Event Sourcing**: Store events as source of truth when needed
