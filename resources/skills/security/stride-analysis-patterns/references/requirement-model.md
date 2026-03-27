# Security Requirement Model

Python data model for security requirements with type definitions and traceability.

```python
from dataclasses import dataclass, field


@dataclass
class SecurityRequirement:
    id: str
    category: str
    requirement: str
    linked_threats: list[str] = field(default_factory=list)
    verification: str = ""


def traceability_matrix(requirements: list[SecurityRequirement]) -> dict[str, list[str]]:
    matrix: dict[str, list[str]] = {}
    for requirement in requirements:
        for threat_id in requirement.linked_threats:
            matrix.setdefault(threat_id, []).append(requirement.id)
    return matrix
```
