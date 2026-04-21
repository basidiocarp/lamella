---
name: threat-mitigation-mapping
description: "Maps identified threats to appropriate security controls and mitigations."
origin: lamella
---

# Threat Mitigation Mapping

## Contents

- [When to Use](#when-to-use)
- [Core Concepts](#core-concepts)
- [Best Practices](#best-practices)
- [Resources](#resources)
- [References](#references)

## When to Use

- Prioritizing security investments
- Creating remediation roadmaps
- Validating control coverage
- Designing defense-in-depth
- Security architecture review
- Risk treatment planning

## Core Concepts

### Control Categories

```
Preventive ────► Stop attacks before they occur
                 (Firewall, Input validation)

Detective ─────► Identify attacks in progress
                 (IDS, Log monitoring)

Corrective ────► Respond and recover from attacks
                 (Incident response, Backup restore)
```

### Control Layers

| Layer | Examples |
|-------|----------|
| **Network** | Firewall, WAF, DDoS protection |
| **Application** | Input validation, authentication |
| **Data** | Encryption, access controls |
| **Endpoint** | EDR, patch management |
| **Process** | Security training, incident response |

### Defense in Depth

```
                ┌──────────────────────┐
                │      Perimeter       │ ← Firewall, WAF
                │   ┌──────────────┐   │
                │   │   Network    │   │ ← Segmentation, IDS
                │   │  ┌────────┐  │   │
                │   │  │  Host  │  │   │ ← EDR, Hardening
                │   │  │ ┌────┐ │  │   │
                │   │  │ │App │ │  │   │ ← Auth, Validation
                │   │  │ │Data│ │  │   │ ← Encryption
                │   │  │ └────┘ │  │   │
                │   │  └────────┘  │   │
                │   └──────────────┘   │
                └──────────────────────┘
```

### Key Control IDs

| ID | Control | Type | Layer |
|----|---------|------|-------|
| AUTH-001 | Multi-Factor Auth | Preventive | Application |
| VAL-001 | Input Validation | Preventive | Application |
| VAL-002 | WAF | Preventive | Network |
| ENC-001 | Encryption at Rest | Preventive | Data |
| ENC-002 | TLS Encryption | Preventive | Network |
| LOG-001 | Security Logging | Detective | Application |
| ACC-001 | RBAC | Preventive | Application |
| AVL-001 | Rate Limiting | Preventive | Application |
| AVL-002 | DDoS Protection | Preventive | Network |

## Best Practices

### Do's

- **Map all threats** — No threat should be unmapped
- **Layer controls** — Defense in depth is essential
- **Mix control types** — Preventive, detective, corrective
- **Track effectiveness** — Measure and improve
- **Review regularly** — Controls degrade over time

### Don'ts

- **Don't rely on single controls** — Single points of failure
- **Don't ignore cost** — ROI matters
- **Don't skip testing** — Untested controls may fail
- **Don't set and forget** — Continuous improvement
- **Don't ignore people/process** — Technology alone isn't enough

## Resources

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Controls](https://www.cisecurity.org/controls)
- [MITRE D3FEND](https://d3fend.mitre.org/)

## References

- [Mitigation Model](references/mitigation-model.md) — Data classes for threat/control mapping
- [Control Library](references/control-library.md) — Standard security controls library
- [Mitigation Analysis](references/mitigation-analysis.md) — Analysis and optimization tools
- [Control Testing](references/control-testing.md) — Effectiveness testing framework
