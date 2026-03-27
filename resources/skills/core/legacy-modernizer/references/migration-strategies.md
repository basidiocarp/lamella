# Migration Strategies

Use this page as the routing layer for legacy modernization by migration type.

## Load Order

| Need | Reference |
| --- | --- |
| dual-write, schema evolution, and API version rollouts | `data-and-api-migrations.md` |
| framework and frontend modernization | `framework-and-frontend-migrations.md` |
| service extraction and runtime or language upgrades | `service-and-runtime-migrations.md` |

## Core Rules

- keep rollout and rollback plans next to the migration strategy
- split migrations by operational risk, not only by technology label
- prefer incremental coexistence over big-bang replacement
