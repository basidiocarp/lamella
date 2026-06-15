# Control Library Template

Standard security controls library with a small, editable baseline.

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Control:
    id: str
    name: str
    category: str
    purpose: str


class ControlLibrary:
    """Library of reusable controls keyed by threat category."""

    STANDARD_CONTROLS = {
        "spoofing": [
            Control("IAM-1", "Strong authentication", "preventive", "Block impersonation"),
            Control("IAM-2", "Session protection", "preventive", "Protect authenticated state"),
        ],
        "tampering": [
            Control("INT-1", "Integrity checks", "detective", "Detect unauthorized modification"),
            Control("INT-2", "Signed updates", "preventive", "Restrict trusted changes"),
        ],
        "information-disclosure": [
            Control("PRIV-1", "Encryption at rest", "preventive", "Protect stored sensitive data"),
            Control("PRIV-2", "Access logging", "detective", "Record sensitive-data access"),
        ],
        "denial-of-service": [
            Control("AVAIL-1", "Rate limiting", "preventive", "Reduce resource exhaustion"),
            Control("AVAIL-2", "Autoscaling alerts", "corrective", "Recover from load spikes"),
        ],
    }

    def get_controls_for_threat(self, category: str) -> list[Control]:
        return list(self.STANDARD_CONTROLS.get(category, []))

    def recommend_additional_controls(
        self,
        category: str,
        implemented_ids: set[str],
    ) -> list[Control]:
        return [
            control
            for control in self.get_controls_for_threat(category)
            if control.id not in implemented_ids
        ]
```
