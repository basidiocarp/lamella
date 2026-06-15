# Data Management in Microservices

Compact guidance for data ownership, consistency, and cross-service coordination.

## Database per Service

```text
Do:
- give each service explicit ownership of its writes
- expose data to other services via APIs or events
- keep schema changes local to the owning service

Avoid:
- shared tables across service boundaries
- direct cross-service SQL reads
- database joins that bypass service contracts
```

### Common layouts

```text
Separate instances:
- strongest isolation
- highest operational cost

Separate schemas:
- good for dev and smaller environments
- weaker isolation, easier to drift into coupling

Polyglot persistence:
- each service picks the right store
- operational complexity increases quickly
```

Rule of thumb:
- separate schemas for low-friction internal setups
- separate instances for production-critical boundaries

## Consistency Choices

### Strong Consistency

```text
Use when:
- money movement is involved
- inventory reservations must be exact
- regulation or audit rules require immediate accuracy
```

Tradeoff:
- coordination is slower
- availability drops under dependency stress

### Eventual Consistency

```text
Use when:
- a brief mismatch is acceptable
- reads can lag writes safely
- downstream systems mainly react to state changes
```

Good fits:
- analytics
- search indexes
- recommendations
- customer profile caches

## Cross-Service Data Access

### API Composition

```text
Gateway or aggregator calls:
1. OrderService
2. UserService
3. InventoryService
4. combines response
```

Best for:
- request-time views
- low write frequency
- small number of dependent calls

Risk:
- latency stacks up quickly
- partial failures complicate the response shape

### Event Replication

```text
UserService emits customer.updated
OrderService stores the fields it needs locally
```

Best for:
- read-heavy workflows
- local query performance
- reducing fanout on hot paths

Risk:
- duplicated storage
- lag between source and replica

### Shared Read Model / CQRS

```text
Write side:
- services keep their own command models

Read side:
- projection combines events into one query-optimized view
```

Best for:
- dashboards
- complex multi-entity read models
- search and reporting

## Distributed Transactions

### Avoid 2PC by Default

```text
Why:
- blocking protocol
- poor availability
- awkward failure recovery
- weak fit for independently deployed services
```

### Prefer Sagas

```text
Example money transfer saga:
1. debit source account
2. credit destination account
3. mark transfer complete

Compensations:
- refund debit if credit fails
- mark saga failed if a step cannot recover
```

Practical requirements:
- persist saga state
- make each step idempotent
- define compensations before implementation

## Event Sourcing and Snapshots

```text
Event sourcing fits when:
- full change history matters
- auditability is part of the domain
- rebuilding projections is useful

Snapshots help when:
- event replay becomes too slow
- aggregates grow large
- recovery time matters
```

Use snapshots sparingly:
- every N events
- or at time-based intervals
- always keep replay as the source of truth

## Default Recommendation

```text
Start with:
- database per service
- API composition for simple reads
- event replication for hot or cross-service reads
- sagas for multi-service workflows

Add:
- CQRS only when read complexity justifies it
- event sourcing only when audit and reconstruction are real requirements
```
