# Type System Mastery

## Basic Type Annotations

```python
from collections.abc import Mapping, Sequence
from typing import Any


def process_user(name: str, age: int, active: bool = True) -> dict[str, Any]:
    return {"name": name, "age": age, "active": active}


def first_item(values: Sequence[str]) -> str | None:
    return values[0] if values else None


def merge_configs(base: Mapping[str, int], override: dict[str, int]) -> dict[str, int]:
    return {**base, **override}
```

## Generic Types

```python
from typing import Generic, Protocol, TypeVar

T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")


class Box(Generic[T]):
    def __init__(self, value: T) -> None:
        self.value = value


class SupportsKey(Protocol[K, V]):
    def get(self, key: K) -> V | None: ...
```

## Protocol for Structural Typing

```python
from typing import Protocol, runtime_checkable


class Drawable(Protocol):
    def draw(self) -> str: ...


@runtime_checkable
class Closeable(Protocol):
    def close(self) -> None: ...


def render(item: Drawable) -> str:
    return item.draw()
```

## Advanced Type Features

```python
from typing import Literal, NotRequired, Self, TypedDict, overload

Mode = Literal["read", "write", "append"]


class UserPayload(TypedDict):
    name: str
    email: str
    is_admin: NotRequired[bool]


class Builder:
    def set_name(self, name: str) -> Self:
        self.name = name
        return self


@overload
def normalize(data: str) -> str: ...


@overload
def normalize(data: int) -> int: ...


def normalize(data: str | int) -> str | int:
    return data.upper() if isinstance(data, str) else data * 2
```

## Callable Types

```python
from collections.abc import Callable
from typing import Concatenate, ParamSpec, TypeVar

P = ParamSpec("P")
R = TypeVar("R")


def timed(func: Callable[P, R]) -> Callable[P, R]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        return func(*args, **kwargs)

    return wrapper


def with_prefix(func: Callable[Concatenate[str, P], R]) -> Callable[P, R]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        return func("prefix", *args, **kwargs)

    return wrapper
```

## Mypy Configuration

```toml
[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
warn_unused_ignores = true

[[tool.mypy.overrides]]
module = "third_party.*"
ignore_missing_imports = true
```

## Common Type Patterns

```python
from dataclasses import dataclass
from typing import Generic, TypeVar

T = TypeVar("T")
E = TypeVar("E")


@dataclass
class Success(Generic[T]):
    value: T


@dataclass
class Failure(Generic[E]):
    error: E


Result = Success[T] | Failure[E]
```

## Type Narrowing

```python
from typing import assert_never


def process_value(value: int | str | None) -> str:
    if value is None:
        return "missing"
    if isinstance(value, str):
        return value.upper()
    return str(value + 1)


def handle_mode(mode: Literal["dev", "prod"]) -> str:
    if mode == "dev":
        return "debug enabled"
    if mode == "prod":
        return "optimized"
    assert_never(mode)
```
