# Data Classes and Named Tuples

Structured data containers with automatic method generation.

## Data Classes

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class User:
// ... (10 lines trimmed)
    name="Alice",
    email="alice@example.com"
)
```

## Data Classes with Validation

```python
@dataclass
class User:
    email: str
    age: int

    def __post_init__(self):
        # Validate email format
        if "@" not in self.email:
            raise ValueError(f"Invalid email: {self.email}")
        # Validate age range
        if self.age < 0 or self.age > 150:
            raise ValueError(f"Invalid age: {self.age}")
```

## Frozen Data Classes (Immutable)

```python
@dataclass(frozen=True)
class Point:
    """Immutable point - can be used as dict key or in sets."""
    x: float
    y: float

# Attempting to modify raises FrozenInstanceError
p = Point(1.0, 2.0)
# p.x = 3.0  # Error!
```

## Named Tuples

```python
from typing import NamedTuple

class Point(NamedTuple):
    """Immutable 2D point."""
    x: float
    y: float

    def distance(self, other: 'Point') -> float:
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5

# Usage
p1 = Point(0, 0)
p2 = Point(3, 4)
print(p1.distance(p2))  # 5.0
```

## Data Class Options

| Option | Effect |
|--------|--------|
| `frozen=True` | Immutable instances |
| `order=True` | Generate comparison methods |
| `slots=True` | Use `__slots__` (Python 3.10+) |
| `kw_only=True` | All fields keyword-only (Python 3.10+) |

## Field Options

```python
from dataclasses import dataclass, field

@dataclass
class Config:
    # Required field
// ... (10 lines trimmed)

    # Excluded from comparison
    created_at: datetime = field(compare=False, default_factory=datetime.now)
```

## Dataclass vs NamedTuple vs dict

| Feature | dataclass | NamedTuple | dict |
|---------|-----------|------------|------|
| Mutable | Yes (default) | No | Yes |
| Type hints | Yes | Yes | No |
| Default values | Yes | Yes | N/A |
| Hashable | If frozen | Yes | No |
| Memory efficient | With slots | Yes | No |
| Methods | Yes | Limited | No |
