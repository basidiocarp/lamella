# Resilience Patterns

## Circuit Breaker Pattern

```python
from enum import Enum
from datetime import datetime, timedelta
from typing import Callable, Any

class CircuitState(Enum):
// ... (74 lines trimmed)
        payment_client.process_payment,
        payment_data
    )
```

## Retry with Exponential Backoff

```python
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=60),
    retry=retry_if_exception_type((ConnectionError, TimeoutError))
)
async def call_external_service(data: dict):
    """Call with automatic retry and exponential backoff."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(SERVICE_URL, json=data)
        response.raise_for_status()
        return response.json()
```

## Bulkhead Pattern

```python
import asyncio
from contextlib import asynccontextmanager

class Bulkhead:
    """Isolate resources to limit failure impact."""
// ... (24 lines trimmed)
async def process_payment(data: dict):
    async with payment_bulkhead.acquire():
        return await payment_service.charge(data)
```

## Timeout Pattern

```python
import asyncio
from functools import wraps

def with_timeout(seconds: float):
    """Decorator to add timeout to async functions."""
// ... (16 lines trimmed)
async def call_slow_service(data: dict):
    """This will timeout after 5 seconds."""
    return await slow_service.process(data)
```
