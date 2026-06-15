# Phase 2: Execution Patterns

Use this page as the routing layer for step-execution patterns in
`verified-implementer`.

## Load Order

| Need | Reference |
| --- | --- |
| simple step with no judge pass | `simple-step-pattern.md` |
| critical step with panel verification | `critical-step-pattern.md` |
| multi-item step with per-item evaluation | `multi-item-step-pattern.md` |

## Core Rules

- the orchestrator dispatches and aggregates; it does not inspect artifacts
- judge passes are mandatory when the selected pattern requires them
- step completion happens only after the chosen verification flow finishes
