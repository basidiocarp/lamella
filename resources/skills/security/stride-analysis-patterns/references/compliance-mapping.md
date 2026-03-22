# Compliance Mapping

Map security requirements to compliance frameworks (PCI-DSS, HIPAA, GDPR, OWASP).

```python
from typing import Dict, List, Set

class ComplianceMapper:
    """Map security requirements to compliance frameworks."""

// ... (101 lines trimmed)
                    gaps["weak_coverage"].append(f"{framework.value}:{control}")

        return gaps
```
