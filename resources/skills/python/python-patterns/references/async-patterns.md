# Async Programming Patterns

## Basic Async/Await

```python
import asyncio
from collections.abc import Coroutine

# Basic async function
async def fetch_data(url: str) -> dict[str, str]:
// ... (18 lines trimmed)
    tasks = [fetch_data(url) for url in urls]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r if not isinstance(r, Exception) else None for r in results]
```

## Task Groups (Python 3.11+)

```python
from asyncio import TaskGroup

# Task groups for structured concurrency
async def process_batch(items: list[int]) -> list[int]:
    results: list[int] = []
// ... (18 lines trimmed)
            errors.append(exc)

    return results, errors
```

## Async Context Managers

```python
from typing import Self
from collections.abc import AsyncIterator

class AsyncDatabaseConnection:
    def __init__(self, url: str) -> None:
// ... (37 lines trimmed)
        raise
    finally:
        await session.close()
```

## Async Generators

```python
from collections.abc import AsyncIterator

# Async generator for streaming data
async def read_lines(filepath: str) -> AsyncIterator[str]:
    async with aiofiles.open(filepath) as f:
// ... (21 lines trimmed)
            page += 1
    finally:
        await session.close()
```

## Async Comprehensions

```python
# Async list comprehension
async def fetch_all_users(user_ids: list[int]) -> list[User]:
    return [user async for user in fetch_users(user_ids)]

# Async dict comprehension
// ... (10 lines trimmed)
        async for user in fetch_users(user_ids)
        if user.is_active
    ]
```

## Synchronization Primitives

```python
import asyncio

# Lock for critical sections
class SharedResource:
    def __init__(self) -> None:
// ... (35 lines trimmed)

    def stop(self) -> None:
        self._shutdown.set()
```

## Async Queue Patterns

```python
from asyncio import Queue

# Producer-consumer pattern
async def producer(queue: Queue[int], n: int) -> None:
    for i in range(n):
// ... (19 lines trimmed)

        # Wait for all items to be processed
        await queue.join()
```

## Async Timeouts

```python
# Timeout for single operation
async def fetch_with_timeout(url: str, timeout: float) -> dict[str, Any]:
    try:
        async with asyncio.timeout(timeout):
            return await fetch_data(url)
// ... (10 lines trimmed)
            return await fetch_all(urls)
    except TimeoutError:
        return [None] * len(urls)
```

## Backpressure With Semaphores

Use a semaphore when concurrency is correct but unbounded fan-out would overload an upstream service.

```python
import asyncio

async def fetch_with_limit(
    item_id: int,
    semaphore: asyncio.Semaphore,
) -> dict[str, int]:
    async with semaphore:
        await asyncio.sleep(0.1)
        return {"item_id": item_id}


async def fetch_batch(item_ids: list[int]) -> list[dict[str, int]]:
    semaphore = asyncio.Semaphore(10)
    tasks = [fetch_with_limit(item_id, semaphore) for item_id in item_ids]
    return await asyncio.gather(*tasks)
```

Use this for API rate limits, DB connection pressure, and bounded queue consumers.

## Background Tasks

```python
from asyncio import create_task, Task

class BackgroundTaskManager:
    def __init__(self) -> None:
        self._tasks: set[Task[None]] = set()
// ... (14 lines trimmed)
# Usage
manager = BackgroundTaskManager()
manager.create_task(background_job())
```

## Cancellation Cleanup

Cancellation is part of normal async control flow. Handle it explicitly when cleanup matters.

```python
import asyncio

async def stream_events() -> None:
    try:
        while True:
            await asyncio.sleep(1)
    except asyncio.CancelledError:
        await cleanup_stream()
        raise


async def cleanup_stream() -> None:
    await asyncio.sleep(0)
```

If a coroutine owns a socket, stream, temp file, or background subscription, make the cleanup path explicit.

## Async Iteration Protocol

```python
class AsyncRange:
    def __init__(self, start: int, end: int) -> None:
        self.start = start
        self.end = end
        self.current = start
// ... (12 lines trimmed)
# Usage
async for i in AsyncRange(0, 5):
    print(i)
```

## Mixing Sync and Async

```python
from concurrent.futures import ThreadPoolExecutor
import functools

# Run sync code in executor
async def run_in_executor(func: Callable[..., T], *args: Any) -> T:
// ... (18 lines trimmed)
            functools.partial(func, *args, **kwargs)
        )
    return wrapper
```
