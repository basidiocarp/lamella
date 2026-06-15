---
name: slo-implementation
description: "Defines SLIs, SLOs, error budgets, and alerting."
origin: lamella
---

# SLO Implementation

Use this skill when defining or operationalizing service-level objectives.

## When to Use

- establishing SLIs and SLOs for a service
- turning reliability goals into alerting and dashboards
- introducing error budgets into delivery planning
- reviewing whether a target reflects real user experience

## Core Model

| Layer | Purpose |
|------|---------|
| SLI | actual measurement |
| SLO | internal target |
| Error budget | permitted miss rate tied to delivery policy |

## Core Workflow

1. Start with user-facing signals, not infrastructure vanity metrics.
2. Define the SLI and measurement window.
3. Set an SLO that the service can defend operationally.
4. Convert the miss allowance into an error budget and burn-rate policy.
5. Wire dashboards, alerts, and review cadence around that contract.

## Quick Start

```shell
python3 scripts/slo_designer.py --input service-definition.json --output slo-framework.json
```

```powershell
python scripts\slo_designer.py --input .\service-definition.json --output .\slo-framework.json
```

## References

- [references/slo-cookbook.md](references/slo-cookbook.md)
