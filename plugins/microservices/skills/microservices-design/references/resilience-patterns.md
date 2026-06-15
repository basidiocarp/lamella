# Resilience Patterns

Compact patterns for building fault-tolerant distributed systems.

## Circuit Breaker Pattern

```python
from enum import Enum


class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"


class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5):
        self.failure_threshold = failure_threshold
        self.failures = 0
        self.state = CircuitState.CLOSED

    async def call(self, fn, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            raise RuntimeError("dependency unavailable")
        try:
            result = await fn(*args, **kwargs)
            self.failures = 0
            self.state = CircuitState.CLOSED
            return result
        except Exception:
            self.failures += 1
            if self.failures >= self.failure_threshold:
                self.state = CircuitState.OPEN
            raise
```

Use for:
- external service calls
- database or cache dependencies
- high-fanout service hops

## Retry with Exponential Backoff

```python
import asyncio
import random


async def retry_with_backoff(fn, *, attempts: int = 5, base_delay: float = 0.1):
    for attempt in range(attempts):
        try:
            return await fn()
        except (ConnectionError, TimeoutError):
            if attempt == attempts - 1:
                raise
            delay = min(5.0, base_delay * (2 ** attempt))
            await asyncio.sleep(delay + random.uniform(0, delay / 4))
```

Only retry:
- timeouts
- temporary network failures
- rate limits or 503-style conditions

## Bulkhead Pattern

```python
import asyncio


class Bulkhead:
    def __init__(self, concurrency: int):
        self._semaphore = asyncio.Semaphore(concurrency)

    async def run(self, fn, *args, **kwargs):
        async with self._semaphore:
            return await fn(*args, **kwargs)


payment_bulkhead = Bulkhead(20)
inventory_bulkhead = Bulkhead(40)
```

Use separate pools for:
- payment paths
- inventory or search
- reporting and back-office jobs

## Timeout Pattern

```python
import asyncio


async def call_with_timeout(fn, seconds: float):
    async with asyncio.timeout(seconds):
        return await fn()
```

Recommended hierarchy:
- user request budget at the edge
- shorter child timeouts inside
- never let child operations outlive the parent request

## Saga Pattern

```text
1. Create order
2. Charge payment
3. Reserve inventory
4. Confirm shipment

Compensations:
- refund payment if inventory fails
- cancel order if payment fails
```

Use a saga when:
- one workflow spans multiple services
- 2PC is too expensive or unavailable
- compensating actions are well-defined
