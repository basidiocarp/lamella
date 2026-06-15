# Attack Tree Data Model

Python data model for attack trees with lightweight export support.

```python
from dataclasses import dataclass, field, asdict
import json


@dataclass
class AttackNode:
    id: str
    name: str
    likelihood: int
    impact: int
    children: list["AttackNode"] = field(default_factory=list)


@dataclass
class AttackTree:
    name: str
    root: AttackNode
    version: str = "1.0"

    def to_json(self) -> str:
        return json.dumps(asdict(self), indent=2)
```
