# Data Flow Diagram Analysis

Analyze DFDs for STRIDE threats and trust boundary crossings.

```python
from dataclasses import dataclass
from enum import Enum


class ElementType(Enum):
    PROCESS = "process"
    DATA_STORE = "data_store"
    EXTERNAL_ENTITY = "external_entity"


@dataclass
class DFDNode:
    node_id: str
    name: str
    kind: ElementType
    trust_zone: str


@dataclass
class DFDFlow:
    source: str
    target: str
    label: str
    data_classification: str


def analyze_trust_boundaries(nodes: dict[str, DFDNode], flows: list[DFDFlow]) -> list[dict]:
    findings = []
    for flow in flows:
        src = nodes[flow.source]
        dst = nodes[flow.target]
        if src.trust_zone != dst.trust_zone:
            findings.append(
                {
                    "flow": flow.label,
                    "type": "trust-boundary-crossing",
                    "zones": [src.trust_zone, dst.trust_zone],
                    "threats": ["spoofing", "tampering", "information-disclosure"],
                    "controls": ["authentication", "integrity checks", "transport encryption"],
                }
            )
    return findings
```

## STRIDE per Interaction

Apply STRIDE to each interaction between components.

```python
def classify_stride(flow: DFDFlow, source: DFDNode, target: DFDNode) -> list[str]:
    threats = []
    if target.kind in {ElementType.PROCESS, ElementType.EXTERNAL_ENTITY}:
        threats.append("spoofing")
    if flow.data_classification in {"confidential", "regulated"}:
        threats.extend(["tampering", "information-disclosure"])
    if target.kind == ElementType.DATA_STORE:
        threats.append("repudiation")
    if source.trust_zone != target.trust_zone:
        threats.append("elevation-of-privilege")
    threats.append("denial-of-service")
    return threats


def analyze_interactions(nodes: dict[str, DFDNode], flows: list[DFDFlow]) -> list[dict]:
    all_threats = []
    for flow in flows:
        source = nodes[flow.source]
        target = nodes[flow.target]
        all_threats.append(
            {
                "flow": flow.label,
                "source": source.name,
                "target": target.name,
                "stride": classify_stride(flow, source, target),
            }
        )
    return all_threats
```
