# Concurrency Patterns

Python offers multiple approaches for concurrent execution depending on the workload type.

## Threading for I/O-Bound Tasks

Best for: network requests, file I/O, database queries.

```python
import concurrent.futures
import threading

def fetch_url(url: str) -> str:
    """Fetch a URL (I/O-bound operation)."""
// ... (13 lines trimmed)
            except Exception as e:
                results[url] = f"Error: {e}"
    return results
```

## Multiprocessing for CPU-Bound Tasks

Best for: math computations, image processing, data transformation.

```python
from concurrent.futures import ProcessPoolExecutor

def process_data(data: list[int]) -> int:
    """CPU-intensive computation."""
    return sum(x ** 2 for x in data)

def process_all(datasets: list[list[int]]) -> list[int]:
    """Process multiple datasets using multiple processes."""
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(process_data, datasets))
    return results
```

## Async/Await for Concurrent I/O

Best for: high-concurrency I/O, web servers, many simultaneous connections.

```python
import asyncio

async def fetch_async(url: str) -> str:
    """Fetch a URL asynchronously."""
    import aiohttp
// ... (9 lines trimmed)

# Run async code
asyncio.run(fetch_all(["https://example.com"]))
```

## When to Use Which

| Approach | Best For | GIL Impact | Overhead |
|----------|----------|------------|----------|
| Threading | I/O-bound | Limited by GIL | Low |
| Multiprocessing | CPU-bound | Bypasses GIL | High (serialization) |
| Asyncio | High-concurrency I/O | Single thread | Low |

## Thread Safety

```python
import threading

class Counter:
    def __init__(self):
        self._value = 0
        self._lock = threading.Lock()

    def increment(self):
        with self._lock:
            self._value += 1

    @property
    def value(self):
        with self._lock:
            return self._value
```

## Async Context Managers

```python
class AsyncDatabaseConnection:
    async def __aenter__(self):
        self.conn = await create_connection()
        return self.conn

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.conn.close()

async def query():
    async with AsyncDatabaseConnection() as conn:
        return await conn.execute("SELECT * FROM users")
```
