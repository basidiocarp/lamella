# Data Management in Microservices

Comprehensive guide for managing data across distributed services.

## Fundamental Principles

### Database per Service

**Core Principle:** Each microservice owns its data exclusively.

**Rules:**
```
✓ DO:
- Each service has its own database/schema
- Service owns all CRUD operations on its data
- Other services access data via APIs only
// ... (5 lines trimmed)
- Shared tables or schemas
- Database-level joins across services
```

**Implementation Options:**

**1. Separate Database Instances:**
```
UserService → PostgreSQL instance 1
OrderService → PostgreSQL instance 2
InventoryService → PostgreSQL instance 3

// ... (6 lines trimmed)
- Higher infrastructure cost
- More operational overhead
```

**2. Separate Schemas:**
```
Same PostgreSQL instance:
- Schema: user_service
- Schema: order_service
- Schema: inventory_service
// ... (9 lines trimmed)

Recommendation: Use separate schemas for dev/test, separate instances for production
```

**3. Polyglot Persistence:**
```
Each service chooses optimal database:

UserService → PostgreSQL
  (Relational data, ACID transactions)

// ... (11 lines trimmed)

Benefits: Right tool for the job
Challenges: Multiple technologies to manage
```

## Data Consistency Patterns

### Strong Consistency vs Eventual Consistency

**Strong Consistency:**
```
Definition: Read after write returns latest value

Requires:
- Distributed transaction (2PC, 3PC)
- Coordination across services
// ... (9 lines trimmed)
- Inventory reservations
- Critical business operations
- Regulatory requirements
```

**Eventual Consistency:**
```
Definition: System converges to consistent state over time

Characteristics:
- Temporary inconsistencies acceptable
- Non-blocking operations
// ... (12 lines trimmed)
- Analytics dashboards
- Recommendation systems
- Non-critical updates
```

### Managing Cross-Service Data

**Problem:** Order service needs customer data owned by User service.

**Anti-Pattern Solutions:**
```
✗ Direct database access
✗ Shared database
✗ Database replication between services
```

**Proper Solutions:**

**1. API Composition:**
```
Client Query: Get order with customer details

API Gateway:
1. GET /orders/123 from OrderService
   Response: { orderId: 123, customerId: 456, items: [...] }
// ... (11 lines trimmed)
- Multiple network calls (latency)
- Partial failure handling complex
- N+1 query problem
```

**2. Data Replication via Events:**
```
OrderService maintains denormalized customer data:

CREATE TABLE orders (
    order_id UUID PRIMARY KEY,
    customer_id UUID,
// ... (24 lines trimmed)
- Eventual consistency
- Storage duplication
- Keeping data in sync
```

**3. CQRS with Shared Read Model:**
```
Write Models (Command Side):
- UserService writes to user_db
- OrderService writes to order_db

Read Model (Query Side):
// ... (21 lines trimmed)
- Eventual consistency
- Additional infrastructure
- Event replay mechanism needed
```

## Distributed Transactions

### Two-Phase Commit (2PC)

**How It Works:**
```
Phase 1: Prepare
Coordinator asks all participants: "Can you commit?"
- Service A: YES
- Service B: YES
- Service C: YES
// ... (14 lines trimmed)
Commit:
- AccountService A: Deduct $100 (committed)
- AccountService B: Add $100 (committed)
```

**Problems with 2PC:**
```
✗ Blocking protocol (participants wait for coordinator)
✗ Single point of failure (coordinator down = all blocked)
✗ Reduced availability
✗ Poor performance (synchronous coordination)
✗ Doesn't scale well

Recommendation: Avoid 2PC in microservices, use Saga pattern instead
```

### Saga Pattern (Recommended)

**Orchestration-Based Saga:**
```
Transfer Money Saga:

Steps:
1. Debit Account A
2. Credit Account B
// ... (24 lines trimmed)

saga_state["status"] = "completed"
return success_saga()
```

**Saga State Persistence:**
```
CREATE TABLE saga_state (
    saga_id UUID PRIMARY KEY,
    saga_type VARCHAR(50),
    current_step INTEGER,
    max_steps INTEGER,
// ... (13 lines trimmed)
WHERE saga_id = $1;

On failure, load saga state and execute compensations
```

**Idempotency for Saga Steps:**
```
Each saga step must be idempotent:

Debit Operation:
async def debit_account(account_id, amount, saga_id):
    # Check if already processed
// ... (24 lines trimmed)
Compensating Operation:
async def compensate_debit(account_id, amount, saga_id):
    await credit_account(account_id, amount, saga_id)
```

## Event Sourcing

### Core Concepts

**Event Store:**
```
All state changes stored as immutable events

Example: Bank Account

// ... (7 lines trimmed)

Replay all events to reconstruct current state
```

**Event Schema:**
```json
{
  "eventId": "evt-789",
  "aggregateId": "acc-123",
  "aggregateType": "BankAccount",
  "eventType": "MoneyDeposited",
// ... (11 lines trimmed)
    "ipAddress": "192.168.1.1"
  }
}
```

### Snapshots

**Problem:** Replaying thousands of events is slow.

**Solution:** Periodic snapshots.

```
Event Stream:
1. AccountOpened (version 1)
2. MoneyDeposited (version 2)
...
1000. MoneyDeposited (version 1000)
// ... (12 lines trimmed)
- Every 100 events
- Or every 24 hours
- Async background process
```

**Snapshot Table:**
```sql
CREATE TABLE snapshots (
    aggregate_id UUID,
    aggregate_type VARCHAR(50),
    version INTEGER,
    state JSONB,
    created_at TIMESTAMP,
    PRIMARY KEY (aggregate_id, version)
);

CREATE INDEX idx_latest_snapshot ON snapshots(aggregate_id, version DESC);
```

### Event Schema Evolution

**Challenge:** Events are immutable, but requirements change.

**Strategies:**

**1. Event Versioning:**
```
Version 1:
{
  "eventType": "OrderPlaced",
  "eventVersion": "1.0",
  "payload": {
// ... (21 lines trimmed)
    elif event.eventVersion == "2.0":
        # Handle new format
        process_order_v2(event.payload)
```

**2. Event Upcasting:**
```
Transform old events to new format during replay:

def upcast_event(event):
    if event.eventType == "OrderPlaced" and event.eventVersion == "1.0":
// ... (8 lines trimmed)
        }
    return event
```

**3. Event Transformation:**
```
Create new event types, keep old ones for historical accuracy:

Old: OrderPlaced
New: OrderPlacedV2

Projections handle both:
- Old events for historical data
- New events for current processing
```

## Data Synchronization

### Change Data Capture (CDC)

**Purpose:** Capture database changes and publish as events.

**How It Works:**
```
Database transaction log → CDC Tool → Event Stream

Example with Debezium:

PostgreSQL:
// ... (15 lines trimmed)
Published to Kafka topic: postgres.public.orders

Other services subscribe and update their read models
```

**Benefits:**
```
✓ No application code changes
✓ Guaranteed delivery (based on database transaction log)
✓ Captures all changes (even from direct DB access)
✓ Low latency
// ... (5 lines trimmed)
- Replicate to data warehouse
- Trigger workflows on database changes
```

### Materialized Views

**Purpose:** Pre-computed denormalized views for fast queries.

**Pattern:**
```
Event-Driven Materialized View:

1. Services publish domain events
2. View service subscribes to events
3. Updates materialized view in real-time
// ... (30 lines trimmed)
        "UPDATE order_summary SET status = 'shipped', last_updated = NOW() WHERE order_id = $1",
        event.order_id
    )
```

## Data Partitioning

### Horizontal Partitioning (Sharding)

**When to Use:**
```
- Single database can't handle load
- Data size exceeds single server capacity
- Want to distribute geographically
```

**Sharding Strategies:**

**1. Hash-Based Sharding:**
```
Shard = hash(customer_id) % num_shards

customer_id: cust-123 → hash → 7234 → mod 4 → Shard 2
customer_id: cust-456 → hash → 9812 → mod 4 → Shard 0
// ... (6 lines trimmed)
- Adding shards requires re-sharding
- Range queries difficult
```

**2. Range-Based Sharding:**
```
Shard 0: customer_id 0-999
Shard 1: customer_id 1000-1999
Shard 2: customer_id 2000-2999

// ... (5 lines trimmed)
- Uneven distribution (hotspots)
- Requires shard map
```

**3. Geography-Based Sharding:**
```
Shard US: customers in USA
Shard EU: customers in Europe
Shard APAC: customers in Asia-Pacific

// ... (5 lines trimmed)
- Uneven distribution
- Cross-shard queries complex
```

**Shard Management:**
```
Shard Map Service:

GET /shard-location?customer_id=cust-123
Response: { "shard": "shard-2", "endpoint": "db2.example.com" }

Application logic:
customer_id = request.customer_id
shard_info = await shard_map.get_shard(customer_id)
db_connection = connection_pool.get(shard_info.endpoint)
result = await db_connection.query("SELECT * FROM customers WHERE id = $1", customer_id)
```

## Summary

Data management in microservices requires careful design:

**Key Principles:**
- Database per service (non-negotiable)
- Embrace eventual consistency where possible
- Use Saga pattern for distributed transactions
- Event sourcing for audit trail and temporal queries
- CQRS for read/write optimization
- CDC for data synchronization

**Decision Framework:**
- Strong consistency → Saga with careful compensation logic
- Audit trail → Event sourcing
- Complex queries → CQRS with read models
- Large scale → Sharding with appropriate strategy

Always design for failure: compensating transactions, idempotent operations, and proper monitoring are essential.
