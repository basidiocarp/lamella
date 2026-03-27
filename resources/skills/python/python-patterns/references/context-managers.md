# Context Managers

Context managers ensure proper resource cleanup with `with`.

## Basic Pattern

```python
def process_file(path: str) -> str:
    with open(path, "r") as f:
        return f.read()
```

## `@contextmanager`

```python
from contextlib import contextmanager
import time

@contextmanager
def timer(name: str):
    start = time.perf_counter()
    yield
    print(f"{name} took {time.perf_counter() - start:.4f}s")
```

## Class-Based Context Manager

```python
class DatabaseTransaction:
    def __init__(self, connection):
        self.connection = connection

    def __enter__(self):
        self.connection.begin()
        return self.connection

    def __exit__(self, exc_type, exc, tb):
        if exc_type:
            self.connection.rollback()
        else:
            self.connection.commit()
```
