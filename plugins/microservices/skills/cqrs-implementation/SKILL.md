---
name: cqrs-implementation
description: "Implements Command Query Responsibility Segregation patterns for distributed systems."
origin: lamella
---

# CQRS Implementation


## Contents

- [When to Use](#when-to-use)
- [Architecture Overview](#architecture-overview)
- [Key Components](#key-components)
- [Quick Start](#quick-start)
- [Best Practices](#best-practices)
- [Resources](#resources)
- [References](#references)


Comprehensive guide to implementing CQRS (Command Query Responsibility Segregation) patterns.

## When to Use

- Separating read and write concerns
- Scaling reads independently from writes
- Building event-sourced systems
- Optimizing complex query scenarios
- Different read/write data models needed
- High-performance reporting requirements

## Architecture Overview

```
                    +-------------+
                    |   Client    |
                    +------+------+
                           |
              +------------+------------+
              |                         |
              v                         v
       +-------------+          +-------------+
       |  Command    |          |    Query    |
       |   API       |          |    API      |
       +------+------+          +------+------+
              |                         |
              v                         v
       +-------------+          +-------------+
       | Command     |  Events  | Projection  |
       | Handler     |--------->| Builder     |
       +------+------+          +------+------+
              |                         |
              v                         v
       |   Write     |--------->|    Read     |
       |   Model     |  Events  |   Model     |
       +-------------+          +-------------+
```

## Key Components

| Component | Responsibility |
|-----------|----------------|
| **Command** | Intent to change state |
| **Command Handler** | Validates and executes commands |
| **Event** | Record of state change |
| **Query** | Request for data |
| **Query Handler** | Retrieves data from read model |
| **Projector** | Updates read model from events |

## Quick Start

### Command Example

```python
@dataclass
class CreateOrder(Command):
    customer_id: str
    items: list
    shipping_address: dict

class CreateOrderHandler(CommandHandler[CreateOrder]):
    async def handle(self, command: CreateOrder) -> str:
        if not command.items:
            raise ValueError("Order must have items")
        order = Order.create(...)
        await self.event_store.append_events(...)
        return order.id
```

### Query Example

```python
@dataclass
class GetOrderById(Query):
    order_id: str

class GetOrderByIdHandler(QueryHandler[GetOrderById, Optional[OrderView]]):
    async def handle(self, query: GetOrderById) -> Optional[OrderView]:
        row = await self.read_db.fetchrow(
            "SELECT * FROM order_views WHERE order_id = $1",
            query.order_id
        )
        return OrderView(**dict(row)) if row else None
```

### API Endpoints

```python
# Commands: POST, PUT, DELETE
@app.post("/orders")
async def create_order(request, command_bus):
    return await command_bus.dispatch(CreateOrder(...))

# Queries: GET
@app.get("/orders/{order_id}")
async def get_order(order_id, query_bus):
    return await query_bus.dispatch(GetOrderById(order_id=order_id))
```

## Projections (Read Side)

Projections build read models from event streams — the "query" half of CQRS.

### Projection Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Live** | Real-time from subscription | Current state queries |
| **Catchup** | Process historical events | Rebuilding read models |
| **Persistent** | Stores checkpoint | Resume after restart |
| **Inline** | Same transaction as write | Strong consistency |

### Core Pattern

```python
class Projection(ABC):
    @property
    @abstractmethod
    def name(self) -> str: ...

    @abstractmethod
    def handles(self) -> List[str]: ...

    @abstractmethod
    async def apply(self, event: Event) -> None: ...
```

### Checkpointing and Rebuilding

```python
# Checkpointing — track position for crash recovery
await self.checkpoint_store.save(projection.name, event.global_position)

# Rebuilding — reset and replay all events
async def rebuild(self, projection: Projection):
    await self.checkpoint_store.delete(projection.name)
    await self._run_projection(projection, batch_size=1000)
```

### Projection Best Practices

- **Make projections idempotent** — safe to replay
- **Use transactions** for multi-table updates
- **Store checkpoints** — resume after failures
- **Monitor lag** — alert on projection delays
- **Each projection is independent** — don't couple them

See [references/templates.md](references/templates.md) for full projection templates (order summary, Elasticsearch, aggregation, multi-table).

## Best Practices

### Dos

- **Separate command and query models** - Different needs
- **Use eventual consistency** - Accept propagation delay
- **Validate in command handlers** - Before state change
- **Denormalize read models** - Optimize for queries
- **Version your events** - For schema evolution

### Donts

- **Dont query in commands** - Use only for writes
- **Dont couple read/write schemas** - Independent evolution
- **Dont over-engineer** - Start simple
- **Dont ignore consistency SLAs** - Define acceptable lag

## Resources

- [CQRS Pattern - Martin Fowler](https://martinfowler.com/bliki/CQRS.html)
- [Microsoft CQRS Guidance](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)

## References

- [references/templates.md](references/templates.md) - Full code templates for commands, queries, FastAPI, sync, and consistency
