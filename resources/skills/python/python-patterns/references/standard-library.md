# Standard Library Mastery

## Pathlib for File Operations

```python
from pathlib import Path

# Path creation and manipulation
project_root = Path(__file__).parent.parent
config_file = project_root / "config" / "settings.toml"
// ... (40 lines trimmed)
    with TemporaryDirectory() as tmpdir:
        temp_path = Path(tmpdir) / "output.txt"
        temp_path.write_text("data")
```

## Dataclasses for Data Structures

```python
from dataclasses import dataclass, field, asdict, replace
from typing import ClassVar

# Basic dataclass
@dataclass
// ... (53 lines trimmed)
user = User(1, "Alice", "alice@example.com")
user_dict = asdict(user)
updated = replace(user, name="Alice Smith")
```

## Functools for Function Tools

```python
from functools import (
    cache, lru_cache, cached_property,
    partial, wraps, reduce, singledispatch
)

// ... (58 lines trimmed)
@process.register(list)
def _(arg: list[Any]) -> str:
    return f"List with {len(arg)} items"
```

## Itertools for Iteration

```python
from itertools import (
    chain, islice, cycle, repeat,
    groupby, accumulate, combinations, permutations,
    product, zip_longest, tee, filterfalse
)
// ... (31 lines trimmed)

# Filter false
odds = list(filterfalse(lambda x: x % 2 == 0, range(10)))
```

## Collections for Data Structures

```python
from collections import (
    defaultdict, Counter, deque, namedtuple,
    ChainMap, OrderedDict
)

// ... (41 lines trimmed)
environment = {'user': 'admin'}
combined = ChainMap(environment, defaults)
print(combined['user'])  # 'admin' (from environment)
```

## Context Managers

```python
from contextlib import contextmanager, suppress, ExitStack

# Custom context manager
@contextmanager
def managed_resource(resource_id: str) -> Iterator[Resource]:
// ... (14 lines trimmed)
        # All files auto-closed on exit
        for f in files:
            process(f.read())
```

## Enum for Constants

```python
from enum import Enum, auto, IntEnum, Flag

# Basic enum
class Status(Enum):
    PENDING = "pending"
// ... (21 lines trimmed)
user_perms = Permission.READ | Permission.WRITE
if Permission.READ in user_perms:
    print("Can read")
```

## Logging

```python
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
// ... (15 lines trimmed)
        logger.debug("User data loaded", extra={"user_id": user_id})
    except Exception as e:
        logger.exception("Failed to process user", extra={"user_id": user_id})
```
