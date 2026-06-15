---
name: chaos-engineering
description: "Designs chaos experiments, failure injection frameworks, and game day exercises."
origin: lamella
---

# Chaos Engineering

## Contents

- [When to Use](#when-to-use)
- [Core Workflow](#core-workflow)
- [Reference Guide](#reference-guide)
- [Constraints](#constraints)
- [Output Templates](#output-templates)

## When to Use

- Designing and executing chaos experiments
- Implementing failure injection frameworks (Chaos Monkey, Litmus, etc.)
- Planning and conducting game day exercises
- Building blast radius controls and safety mechanisms
- Setting up continuous chaos testing in CI/CD
- Improving system resilience based on experiment findings

## Core Workflow

1. **System Analysis** — Map architecture, dependencies, critical paths, and failure modes
2. **Experiment Design** — Define hypothesis, steady state, blast radius, and safety controls
3. **Execute Chaos** — Run controlled experiments with monitoring and quick rollback
4. **Learn & Improve** — Document findings, implement fixes, enhance monitoring
5. **Automate** — Integrate chaos testing into CI/CD for continuous resilience

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Experiments | `references/experiment-design.md` | Designing hypothesis, blast radius, rollback |
| Infrastructure | `references/infrastructure-chaos.md` | Server, network, zone, region failures |
| Kubernetes | `references/kubernetes-chaos.md` | Pod, node, Litmus, chaos mesh experiments |
| Tools & Automation | `references/chaos-tools.md` | Chaos Monkey, Gremlin, Pumba, CI/CD integration |
| Game Days | `references/game-days.md` | Planning, executing, learning from game days |

## Constraints

### MUST DO
- Define steady state metrics before experiments
- Document hypothesis clearly
- Control blast radius (start small, isolate impact)
- Enable automated rollback under 30 seconds
- Monitor continuously during experiments
- Ensure zero customer impact initially
- Capture all learnings and share
- Implement improvements from findings

### MUST NOT DO
- Run experiments without hypothesis
- Skip blast radius controls
- Test in production without safety nets
- Ignore monitoring during experiments
- Run multiple variables simultaneously (initially)
- Forget to document learnings
- Leave systems in degraded state

## Output Templates

When implementing chaos engineering, provide:
1. Experiment design document (hypothesis, metrics, blast radius)
2. Implementation code (failure injection scripts/manifests)
3. Monitoring setup and alert configuration
4. Rollback procedures and safety controls
5. Learning summary and improvement recommendations
