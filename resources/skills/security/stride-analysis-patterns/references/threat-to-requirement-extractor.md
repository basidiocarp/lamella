# Threat-to-Requirement Extractor

Automated extraction of security requirements from STRIDE threat inputs.

```python
from dataclasses import dataclass


@dataclass
class ThreatInput:
    category: str
    description: str
    asset: str


def derive_requirements(threat: ThreatInput) -> list[dict]:
    templates = {
        "spoofing": [
            {"type": "authentication", "requirement": f"Verify identity before accessing {threat.asset}"},
            {"type": "logging", "requirement": "Record failed and successful login attempts"},
        ],
        "tampering": [
            {"type": "integrity", "requirement": f"Detect unauthorized modification of {threat.asset}"},
            {"type": "change-control", "requirement": "Restrict privileged write paths"},
        ],
        "information-disclosure": [
            {"type": "confidentiality", "requirement": f"Encrypt sensitive data for {threat.asset}"},
            {"type": "least-privilege", "requirement": "Limit read access to approved actors"},
        ],
    }
    return templates.get(threat.category, [])
```
