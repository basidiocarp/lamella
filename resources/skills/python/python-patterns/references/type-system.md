# Type System Mastery

## Basic Type Annotations

```python
from typing import Any
from collections.abc import Sequence, Mapping

# Function signatures
def process_user(name: str, age: int, active: bool = True) -> dict[str, Any]:
// ... (13 lines trimmed)
def merge_configs(base: Mapping[str, int], override: dict[str, int]) -> dict[str, int]:
    """Mapping for read-only, dict for mutable."""
    return {**base, **override}
```

## Generic Types

```python
from typing import TypeVar, Generic, Protocol
from collections.abc import Callable

T = TypeVar('T')
K = TypeVar('K')
// ... (24 lines trimmed)

def add_numbers(a: NumT, b: NumT) -> NumT:
    return a + b  # type: ignore[return-value]
```

## Protocol for Structural Typing

```python
from typing import Protocol, runtime_checkable

# Define interface without inheritance
class Drawable(Protocol):
    def draw(self) -> str:
// ... (28 lines trimmed)
def cleanup(resource: Closeable) -> None:
    if isinstance(resource, Closeable):
        resource.close()
```

## Advanced Type Features

```python
from typing import Literal, TypeAlias, TypedDict, NotRequired, Self, overload

# Literal types for constants
Mode = Literal["read", "write", "append"]

// ... (38 lines trimmed)
    if isinstance(data, str):
        return data.upper()
    return data * 2
```

## Callable Types

```python
from collections.abc import Callable
from typing import ParamSpec, Concatenate

# Basic callable
def apply(func: Callable[[int, int], int], a: int, b: int) -> int:
// ... (22 lines trimmed)
@with_connection
def query_user(conn: Connection, user_id: int) -> User:
    return conn.execute(f"SELECT * FROM users WHERE id = {user_id}")
```

## Mypy Configuration

```toml
# pyproject.toml
[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
// ... (14 lines trimmed)
[[tool.mypy.overrides]]
module = "third_party.*"
ignore_missing_imports = true
```

## Common Type Patterns

```python
# Result type pattern
from dataclasses import dataclass

@dataclass
class Success(Generic[T]):
// ... (26 lines trimmed)
    if default is MISSING:
        raise KeyError(key)
    return default  # type: ignore[return-value]
```

## Type Narrowing

```python
from typing import assert_type, assert_never

def process_value(value: int | str | None) -> str:
    # Type guards
    if value is None:
// ... (20 lines trimmed)
def is_string_list(val: list[Any]) -> bool:
    """Runtime check for list of strings."""
    return all(isinstance(x, str) for x in val)
```
