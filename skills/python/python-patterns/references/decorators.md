# Decorators

Decorators modify or enhance functions and classes without changing their code.

## Function Decorators

```python
import functools
import time

def timer(func: Callable) -> Callable:
    """Decorator to time function execution."""
// ... (11 lines trimmed)
    time.sleep(1)

# slow_function() prints: slow_function took 1.0012s
```

## Parameterized Decorators

```python
def repeat(times: int):
    """Decorator to repeat a function multiple times."""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
// ... (9 lines trimmed)
    return f"Hello, {name}!"

# greet("Alice") returns ["Hello, Alice!", "Hello, Alice!", "Hello, Alice!"]
```

## Class-Based Decorators

```python
class CountCalls:
    """Decorator that counts how many times a function is called."""
    def __init__(self, func: Callable):
        functools.update_wrapper(self, func)
        self.func = func
// ... (9 lines trimmed)
    pass

# Each call to process() prints the call count
```

## Common Decorator Patterns

### Caching/Memoization

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

### Retry Logic

```python
def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    time.sleep(delay)
            raise last_exception
        return wrapper
    return decorator
```

### Validation

```python
def validate_args(**validators):
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for name, validator in validators.items():
                if name in kwargs and not validator(kwargs[name]):
                    raise ValueError(f"Invalid {name}: {kwargs[name]}")
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

## Built-in Decorators

| Decorator | Purpose |
|-----------|---------|
| `@property` | Create read-only attributes |
| `@staticmethod` | Method without self |
| `@classmethod` | Method with class as first arg |
| `@functools.wraps` | Preserve function metadata |
| `@functools.lru_cache` | Memoization |
| `@functools.singledispatch` | Function overloading |
| `@contextlib.contextmanager` | Create context managers |
| `@dataclasses.dataclass` | Auto-generate class methods |
