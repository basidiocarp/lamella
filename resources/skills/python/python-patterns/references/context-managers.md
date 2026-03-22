# Context Managers

Context managers ensure proper resource management using the `with` statement.

## Resource Management

```python
# Good: Using context managers
def process_file(path: str) -> str:
    with open(path, 'r') as f:
        return f.read()

# Bad: Manual resource management
def process_file(path: str) -> str:
    f = open(path, 'r')
    try:
        return f.read()
    finally:
        f.close()
```

## Custom Context Managers with @contextmanager

```python
from contextlib import contextmanager

@contextmanager
def timer(name: str):
    """Context manager to time a block of code."""
    start = time.perf_counter()
    yield
    elapsed = time.perf_counter() - start
    print(f"{name} took {elapsed:.4f} seconds")

# Usage
with timer("data processing"):
    process_large_dataset()
```

## Context Manager Classes

```python
class DatabaseTransaction:
    def __init__(self, connection):
        self.connection = connection

    def __enter__(self):
// ... (11 lines trimmed)
with DatabaseTransaction(conn):
    user = conn.create_user(user_data)
    conn.create_profile(user.id, profile_data)
```

## Nested Context Managers

```python
# Multiple context managers
with open('input.txt') as infile, open('output.txt', 'w') as outfile:
    for line in infile:
        outfile.write(line.upper())

# Using contextlib.ExitStack for dynamic context managers
from contextlib import ExitStack

def process_files(paths: list[str]) -> list[str]:
    with ExitStack() as stack:
        files = [stack.enter_context(open(p)) for p in paths]
        return [f.read() for f in files]
```

## Common Built-in Context Managers

| Context Manager | Purpose |
|-----------------|---------|
| `open()` | File handling |
| `threading.Lock()` | Thread synchronization |
| `contextlib.suppress()` | Suppress specific exceptions |
| `contextlib.redirect_stdout()` | Redirect output |
| `tempfile.TemporaryFile()` | Temporary files |
| `unittest.mock.patch()` | Mocking in tests |
