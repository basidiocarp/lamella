# Communication Patterns

## Pattern 1: Synchronous REST Communication

```python
# Service A calls Service B
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

class ServiceClient:
// ... (25 lines trimmed)
# Usage
payment_client = ServiceClient("http://payment-service:8001")
result = await payment_client.post("/payments", json=payment_data)
```

## Pattern 2: Asynchronous Event-Driven

```python
# Event-driven communication with Kafka
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
import json
from dataclasses import dataclass, asdict
from datetime import datetime
// ... (72 lines trimmed)

    # Reserve inventory
    await reserve_inventory(order_id, items)
```

## Pattern 3: Saga Pattern (Distributed Transactions)

```python
# Saga orchestration for order fulfillment
from enum import Enum
from typing import List, Callable

class SagaStep:
// ... (112 lines trimmed)

    async def refund_payment(self, context: dict):
        await payment_service.refund(context["transaction_id"])
```
