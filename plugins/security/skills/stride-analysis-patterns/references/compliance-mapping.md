# Compliance Mapping

Map security requirements to compliance frameworks (PCI DSS, HIPAA, GDPR, OWASP).

```python
FRAMEWORK_MAP = {
    "authentication": {"PCI-DSS": ["8.3"], "OWASP-ASVS": ["2.1"]},
    "logging": {"PCI-DSS": ["10.2"], "OWASP-ASVS": ["7.1"]},
    "integrity": {"PCI-DSS": ["6.4"], "HIPAA": ["164.312(c)(1)"]},
    "confidentiality": {"GDPR": ["32"], "HIPAA": ["164.312(a)(2)(iv)"]},
}


def map_requirements(requirements: list[dict]) -> dict[str, list[str]]:
    mapping: dict[str, list[str]] = {}
    for requirement in requirements:
        req_type = requirement["type"]
        for framework, controls in FRAMEWORK_MAP.get(req_type, {}).items():
            mapping.setdefault(framework, []).extend(controls)
    return mapping
```
