# Resilience and Reliability Patterns

Essential patterns for building fault-tolerant distributed systems.

## Resilience Patterns

### Circuit Breaker

**Purpose:** Prevent cascading failures by failing fast when a dependency is unhealthy.

**How It Works:**
```
States:
1. CLOSED (normal operation)
   - Requests pass through
   - Track failure rate
   - If failures exceed threshold → OPEN
// ... (12 lines trimmed)
- Failure threshold: 50% failures in 10 requests
- Timeout: 30 seconds in OPEN state
- Success threshold: 2 consecutive successes in HALF_OPEN
```

**Implementation Example:**
```python
# Using resilience4j-like pattern
@CircuitBreaker(
    name="payment-service",
    fallbackMethod="paymentFallback",
    failureThreshold=50,
// ... (17 lines trimmed)
        "status": "pending",
        "message": "Payment processing delayed, will retry"
    }
```

**When to Use:**
```
Apply circuit breakers to:
✓ External service calls
✓ Database queries
✓ Third-party APIs
✓ Microservice-to-microservice calls

Configuration Guidelines:
- Fast services (p99 < 100ms): 5s timeout, 10s circuit open
- Medium services (p99 < 1s): 10s timeout, 30s circuit open
- Slow services (p99 > 1s): 30s timeout, 60s circuit open
```

### Retry Pattern

**Purpose:** Handle transient failures by retrying operations.

**Strategies:**

**1. Exponential Backoff:**
```
Retry delays: 100ms, 200ms, 400ms, 800ms, 1600ms

Benefits:
- Reduces load during incidents
- Gives service time to recover
// ... (13 lines trimmed)
            raise
        delay = base_delay * (2 ** attempts) + random.uniform(0, 0.1)
        await asyncio.sleep(delay)
```

**2. Retry with Jitter:**
```
Why: Prevents synchronized retries (thundering herd)

Full Jitter:
delay = random.uniform(0, base_delay * (2 ** attempt))

Decorrelated Jitter:
delay = min(cap, random.uniform(base, previous_delay * 3))

Recommended: Decorrelated jitter for production systems
```

**3. Idempotency Keys:**
```
Problem: Retries can cause duplicate operations

Solution: Idempotency keys
POST /api/v1/payments
// ... (8 lines trimmed)

Ensures safe retries even for non-idempotent operations
```

**Retry Best Practices:**
```
DO:
✓ Only retry transient errors (timeout, 503, 429)
✓ Use exponential backoff with jitter
✓ Set maximum retry attempts (3-5)
// ... (7 lines trimmed)
✗ Infinite retries
✗ Retry non-idempotent operations without safeguards
```

### Bulkhead Pattern

**Purpose:** Isolate resources to prevent total system failure.

**Thread Pool Isolation:**
```
Concept: Separate thread pools for different operations

Example:
- Payment Service Thread Pool: 20 threads
// ... (5 lines trimmed)
- Inventory and notification still work
- System partially degraded, not completely down
```

**Connection Pool Isolation:**
```
Database Connection Pools:
- Read-only queries: 50 connections
- Write queries: 20 connections
- Reporting queries: 10 connections

Heavy reporting query won't starve transactional operations
```

**Rate Limiting per Tenant:**
```
Multi-tenant SaaS application:

tenant-a: 1000 requests/minute
tenant-b: 1000 requests/minute
tenant-c: 1000 requests/minute

If tenant-a floods the system:
- Only tenant-a throttled
- tenant-b and tenant-c unaffected
```

**Implementation:**
```python
# Using semaphores for concurrency limits
class BulkheadExecutor:
    def __init__(self):
        self.payment_semaphore = asyncio.Semaphore(20)
// ... (8 lines trimmed)
        async with self.inventory_semaphore:
            return await inventory_service.call(data)
```

### Timeout Pattern

**Purpose:** Prevent indefinite waiting for responses.

**Timeout Types:**

**1. Connection Timeout:**
```
Time allowed to establish connection

Recommended: 2-5 seconds
If takes longer, network likely has issues

httpx.AsyncClient(timeout=httpx.Timeout(connect=3.0))
```

**2. Read Timeout:**
```
Time allowed to receive response after connection

Varies by service:
- Fast APIs: 5 seconds
- Database queries: 10 seconds
- Complex processing: 30 seconds

httpx.AsyncClient(timeout=httpx.Timeout(read=10.0))
```

**3. Total Timeout:**
```
Overall time budget for entire operation

Example: User checkout flow
- Total budget: 30 seconds
// ... (5 lines trimmed)
async with asyncio.timeout(30):
    result = await complete_checkout()
```

**Timeout Best Practices:**
```
Timeouts Hierarchy:
Parent timeout > sum of child timeouts

Request → API Gateway (30s timeout)
// ... (8 lines trimmed)
✓ gRPC calls
✓ Cache operations
```

## Distributed Transaction Patterns

### Saga Pattern

**Purpose:** Manage distributed transactions across services.

**Choreography-Based Saga:**
```
Example: Order Creation Saga

Events:
1. OrderService: order.created
2. PaymentService: payment.completed OR payment.failed
// ... (14 lines trimmed)
- Difficult to track saga state
- Complex debugging
- No saga-wide timeout
```

**Orchestration-Based Saga:**
```
Example: Order Saga Orchestrator

Saga Steps:
1. Create Order (OrderService)
2. Charge Payment (PaymentService)
// ... (27 lines trimmed)
- Orchestrator complexity
- Potential bottleneck
- Coupling to orchestrator
```

**Saga State Management:**
```
Persist saga state to handle failures:

CREATE TABLE saga_instances (
    saga_id UUID PRIMARY KEY,
    saga_type VARCHAR(50),
// ... (8 lines trimmed)
- Load incomplete sagas
- Resume from last completed step
- Execute remaining steps or compensations
```

### Event Sourcing

**Purpose:** Store all state changes as events, derive current state by replaying.

**Implementation:**
```
Traditional Approach:
UPDATE orders SET status = 'shipped' WHERE id = 123;
(Lost: when shipped, by whom, from where)

// ... (5 lines trimmed)

Current state = replay all events
```

**Event Store:**
```
CREATE TABLE events (
    event_id UUID PRIMARY KEY,
    aggregate_id UUID,
    aggregate_type VARCHAR(50),
    event_type VARCHAR(100),
// ... (9 lines trimmed)
- Events immutable
- Events ordered by version
- Optimistic locking prevents conflicts
```

**Benefits:**
```
✓ Full audit trail
✓ Time travel (replay to any point)
✓ Event replay for debugging
✓ Multiple read models from same events
// ... (5 lines trimmed)
✗ Snapshot strategy needed
✗ Increased storage
```

### CQRS (Command Query Responsibility Segregation)

**Purpose:** Separate read and write models for different optimization strategies.

**Architecture:**
```
Write Side (Command):
- Receives commands (CreateOrder, UpdateInventory)
- Validates business rules
- Stores events in event store
- Optimized for consistency and writes
// ... (15 lines trimmed)
  → Updates order_summary table (denormalized)
  → Updates customer_order_history (different view)
  → Updates order_analytics (aggregated metrics)
```

**Read Models:**
```
Multiple specialized views from same events:

1. Order Detail View (for customer):
   { orderId, items, status, total, estimatedDelivery }
// ... (6 lines trimmed)

Each optimized for specific query patterns
```

## Fault Tolerance Patterns

### Health Checks

**Types:**

**1. Liveness Probe:**
```
Purpose: Is the service alive?

Endpoint: GET /health/live

Returns 200 if:
- Application process running
- Not deadlocked

Kubernetes Action:
- If fails: Restart container
```

**2. Readiness Probe:**
```
Purpose: Is the service ready to receive traffic?

Endpoint: GET /health/ready

// ... (6 lines trimmed)
- If fails: Remove from load balancer
- Don't send traffic until ready
```

**3. Startup Probe:**
```
Purpose: Has the service finished initialization?

Endpoint: GET /health/startup

For slow-starting applications:
- Prevents premature liveness checks
- Allows longer startup time
```

**Implementation:**
```python
@app.get("/health/live")
async def liveness():
    return {"status": "alive"}

@app.get("/health/ready")
// ... (11 lines trimmed)
        status_code=status_code,
        content={"status": "ready" if all_healthy else "not ready", "checks": checks}
    )
```

### Graceful Degradation

**Purpose:** Provide reduced functionality when dependencies fail.

**Strategies:**

**1. Cached Responses:**
```
async def get_product_recommendations(user_id):
    try:
        async with circuit_breaker:
            return await ml_service.get_recommendations(user_id)
    except ServiceUnavailable:
        # Fallback to cached popular products
        return await cache.get_popular_products()
```

**2. Default Values:**
```
async def get_user_preferences(user_id):
    try:
        return await preferences_service.get(user_id)
    except ServiceUnavailable:
        # Return sensible defaults
        return {
            "language": "en",
            "currency": "USD",
            "theme": "light"
        }
```

**3. Feature Toggles:**
```
if feature_flags.is_enabled("personalized_recommendations"):
    recommendations = await ml_service.get_recommendations()
else:
    # Fallback to simple algorithm
    recommendations = await get_popular_products()
```

## Summary

Resilience patterns are mandatory in distributed systems. Layer multiple patterns for defense in depth:

**Essential Stack:**
1. Timeouts (prevent hanging)
2. Retries with backoff (handle transient errors)
3. Circuit breakers (prevent cascading failures)
4. Bulkheads (isolate failures)
5. Health checks (enable auto-healing)
6. Graceful degradation (maintain partial functionality)

**Choose Saga Pattern When:**
- Distributed transaction needed
- Strong consistency not required
- Compensating transactions possible

**Choose Event Sourcing When:**
- Full audit trail required
- Temporal queries needed
- Multiple read models beneficial

Always test failure scenarios. Use chaos engineering to validate resilience.
