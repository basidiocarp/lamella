# Mitigation Model Template

Python data classes for threat mitigation mapping.

```python
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Threat:
    id: str
    category: str
    description: str
    severity: str


@dataclass
class Mitigation:
    control_id: str
    status: str  # planned, implemented, verified
    owner: str
    due_date: datetime | None = None


@dataclass
class MitigationPlan:
    threat: Threat
    mitigations: list[Mitigation] = field(default_factory=list)

    def coverage_summary(self) -> dict[str, int]:
        counts = {"planned": 0, "implemented": 0, "verified": 0}
        for mitigation in self.mitigations:
            counts[mitigation.status] = counts.get(mitigation.status, 0) + 1
        return counts

    def open_actions(self) -> list[Mitigation]:
        return [m for m in self.mitigations if m.status != "verified"]
```
