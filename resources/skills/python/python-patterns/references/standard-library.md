# Standard Library Mastery

## Pathlib for File Operations

```python
from pathlib import Path
from tempfile import TemporaryDirectory

project_root = Path(__file__).resolve().parent.parent
config_file = project_root / "config" / "settings.toml"

if config_file.exists():
    content = config_file.read_text(encoding="utf-8")
    print(content)

output_dir = project_root / "build"
output_dir.mkdir(parents=True, exist_ok=True)

with TemporaryDirectory() as tmpdir:
    temp_path = Path(tmpdir) / "output.txt"
    temp_path.write_text("data", encoding="utf-8")
```

## Dataclasses for Data Structures

```python
from dataclasses import asdict, dataclass, field, replace
from typing import ClassVar


@dataclass(slots=True)
class User:
    domain: ClassVar[str] = "example.com"
    id: int
    name: str
    email: str
    tags: list[str] = field(default_factory=list)

    def primary_tag(self) -> str | None:
        return self.tags[0] if self.tags else None


user = User(1, "Alice", "alice@example.com", ["admin"])
user_dict = asdict(user)
updated = replace(user, name="Alice Smith")
```

## Functools for Function Tools

```python
from functools import cache, cached_property, lru_cache, partial, singledispatch


@cache
def parse_schema(name: str) -> dict[str, str]:
    return {"name": name}


@lru_cache(maxsize=128)
def expensive_lookup(user_id: int) -> dict[str, int]:
    return {"user_id": user_id}


def multiply(a: int, b: int) -> int:
    return a * b


double = partial(multiply, 2)


@singledispatch
def describe(value: object) -> str:
    return "unknown"


@describe.register
def _(value: list[object]) -> str:
    return f"list({len(value)})"


class Settings:
    @cached_property
    def loaded(self) -> dict[str, str]:
        return {"mode": "prod"}
```

## Itertools for Iteration

```python
from itertools import accumulate, chain, combinations, groupby, islice

values = [1, 2, 3, 4]
running_total = list(accumulate(values))
first_three = list(islice(values, 3))
flattened = list(chain([1, 2], [3, 4]))
pairs = list(combinations(["a", "b", "c"], 2))

records = sorted(
    [
        {"team": "api", "name": "A"},
        {"team": "api", "name": "B"},
        {"team": "web", "name": "C"},
    ],
    key=lambda item: item["team"],
)

grouped = {
    team: [entry["name"] for entry in items]
    for team, items in groupby(records, key=lambda item: item["team"])
}
```

## Collections for Data Structures

```python
from collections import ChainMap, Counter, defaultdict, deque

errors = Counter(["timeout", "timeout", "validation"])
queue = deque([1, 2, 3], maxlen=5)
queue.append(4)

by_team: defaultdict[str, list[str]] = defaultdict(list)
by_team["api"].append("service-a")
by_team["api"].append("service-b")

defaults = {"env": "dev", "timeout": 30}
environment = {"timeout": 60}
config = ChainMap(environment, defaults)
```

## Context Managers

```python
from contextlib import ExitStack, contextmanager, suppress
from typing import Iterator


@contextmanager
def managed_resource(resource_id: str) -> Iterator[str]:
    print(f"opening {resource_id}")
    try:
        yield resource_id
    finally:
        print(f"closing {resource_id}")


with managed_resource("db-connection") as resource:
    print(resource)

with suppress(FileNotFoundError):
    open("missing.txt")

with ExitStack() as stack:
    files = [stack.enter_context(open(path)) for path in ["a.txt", "b.txt"]]
    for handle in files:
        print(handle.read())
```

## Enum for Constants

```python
from enum import Enum, Flag, auto


class Status(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    FAILED = "failed"


class Permission(Flag):
    READ = auto()
    WRITE = auto()
    ADMIN = auto()


user_perms = Permission.READ | Permission.WRITE
if Permission.READ in user_perms:
    print("Can read")
```

## Logging

```python
import logging
from pathlib import Path

log_path = Path("logs/app.log")
log_path.parent.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
    handlers=[logging.FileHandler(log_path), logging.StreamHandler()],
)

logger = logging.getLogger("app")

def process_user(user_id: int) -> None:
    try:
        logger.info("Processing user", extra={"user_id": user_id})
    except Exception:
        logger.exception("Failed to process user", extra={"user_id": user_id})
```
