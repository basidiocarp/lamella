# Communication Patterns

## Pattern 1: Synchronous REST Communication

```python
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential


class ServiceClient:
    def __init__(self, base_url: str, timeout: float = 3.0):
        self.client = httpx.AsyncClient(base_url=base_url, timeout=timeout)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.2, min=0.2, max=2))
    async def post(self, path: str, json: dict) -> dict:
        response = await self.client.post(path, json=json)
        response.raise_for_status()
        return response.json()


payment_client = ServiceClient("http://payment-service:8001")
result = await payment_client.post(
    "/payments",
    json={"order_id": "ord_123", "amount": 4999, "currency": "USD"},
)
```

Use this when the caller needs an immediate answer and the downstream service
can meet your latency target. Add retries only for idempotent requests.

## Pattern 2: Asynchronous Event-Driven

```python
import json
from dataclasses import asdict, dataclass
from datetime import datetime

from aiokafka import AIOKafkaConsumer, AIOKafkaProducer


@dataclass
class OrderCreated:
    order_id: str
    customer_id: str
    created_at: str


async def publish_order_created(producer: AIOKafkaProducer, order_id: str, customer_id: str) -> None:
    event = OrderCreated(
        order_id=order_id,
        customer_id=customer_id,
        created_at=datetime.utcnow().isoformat(),
    )
    await producer.send_and_wait("orders.created", json.dumps(asdict(event)).encode())


async def consume_orders(consumer: AIOKafkaConsumer) -> None:
    async for message in consumer:
        event = json.loads(message.value)
        await reserve_inventory(event["order_id"])
        await send_order_confirmation(event["customer_id"], event["order_id"])
```

Use this when the producer should not block on downstream work and eventual
consistency is acceptable.

## Pattern 3: Saga Pattern for Distributed Transactions

```python
from dataclasses import dataclass
from typing import Awaitable, Callable


@dataclass
class SagaStep:
    name: str
    action: Callable[[dict], Awaitable[None]]
    compensation: Callable[[dict], Awaitable[None]]


class OrderSaga:
    def __init__(self, steps: list[SagaStep]):
        self.steps = steps

    async def run(self, context: dict) -> None:
        completed: list[SagaStep] = []
        try:
            for step in self.steps:
                await step.action(context)
                completed.append(step)
        except Exception:
            for step in reversed(completed):
                await step.compensation(context)
            raise


order_saga = OrderSaga(
    [
        SagaStep("reserve_inventory", reserve_inventory, release_inventory),
        SagaStep("charge_payment", charge_payment, refund_payment),
        SagaStep("create_shipment", create_shipment, cancel_shipment),
    ]
)

await order_saga.run({"order_id": "ord_123", "amount": 4999})
```

Use a saga when one business operation spans multiple services and partial
failure needs compensating actions.
