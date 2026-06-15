# CQRS Templates

## Template 1: Command Infrastructure

```python
from dataclasses import dataclass


@dataclass
class CreateOrder:
    order_id: str
    customer_id: str
    total_cents: int


class CreateOrderHandler:
    def __init__(self, repo, event_bus):
        self.repo = repo
        self.event_bus = event_bus

    async def handle(self, command: CreateOrder) -> None:
        order = Order.create(
            order_id=command.order_id,
            customer_id=command.customer_id,
            total_cents=command.total_cents,
        )
        await self.repo.save(order)
        await self.event_bus.publish(order.pull_events())
```

## Template 2: Query Infrastructure

```python
from dataclasses import dataclass


@dataclass
class GetOrderSummary:
    order_id: str


class GetOrderSummaryHandler:
    def __init__(self, read_store):
        self.read_store = read_store

    async def handle(self, query: GetOrderSummary) -> dict:
        return await self.read_store.fetch_order_summary(query.order_id)
```

## Template 3: FastAPI CQRS Endpoint

```python
from fastapi import APIRouter, Depends

router = APIRouter()


@router.post("/orders")
async def create_order(payload: CreateOrderRequest, bus=Depends(get_command_bus)):
    command = CreateOrder(
        order_id=payload.order_id,
        customer_id=payload.customer_id,
        total_cents=payload.total_cents,
    )
    await bus.dispatch(command)
    return {"status": "accepted"}


@router.get("/orders/{order_id}")
async def get_order(order_id: str, bus=Depends(get_query_bus)):
    return await bus.ask(GetOrderSummary(order_id=order_id))
```

## Template 4: Read Model Synchronization

```python
class OrderProjector:
    def __init__(self, read_repo):
        self.read_repo = read_repo

    async def on_order_created(self, event: OrderCreated) -> None:
        await self.read_repo.upsert(
            order_id=event.order_id,
            customer_id=event.customer_id,
            total_cents=event.total_cents,
            status="created",
        )
```

## Template 5: Eventual Consistency Handling

```python
async def wait_for_projection(read_repo, order_id: str, timeout_s: int = 5) -> dict | None:
    deadline = time.monotonic() + timeout_s
    while time.monotonic() < deadline:
        result = await read_repo.fetch_order_summary(order_id)
        if result is not None:
            return result
        await asyncio.sleep(0.1)
    return None
```

## Projection Templates

### Basic Projector

```python
class UserProjector:
    async def on_user_created(self, event: UserCreated) -> None:
        await self.read_repo.upsert_user(
            user_id=event.user_id,
            email=event.email,
            status="active",
        )
```

### Order Summary Projection

```python
class OrderSummaryProjector:
    async def on_order_paid(self, event: OrderPaid) -> None:
        await self.read_repo.mark_paid(
            order_id=event.order_id,
            paid_at=event.paid_at,
        )
```

### Search Projection

```python
class ProductSearchProjector:
    async def on_product_published(self, event: ProductPublished) -> None:
        await self.search_index.index(
            id=event.product_id,
            document={
                "name": event.name,
                "category": event.category,
                "published": True,
            },
        )
```

### Aggregating Projection

```python
class DailySalesProjector:
    async def on_order_paid(self, event: OrderPaid) -> None:
        await self.analytics.increment_sales_total(
            day=event.paid_at.date(),
            amount_cents=event.total_cents,
        )
```

### Multi-Table Projection

```python
class CustomerOrderProjector:
    async def on_order_created(self, event: OrderCreated) -> None:
        await self.read_repo.upsert_customer_order(
            order_id=event.order_id,
            customer_id=event.customer_id,
            total_cents=event.total_cents,
        )
```
