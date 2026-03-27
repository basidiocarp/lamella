# Service and Runtime Migrations

Use this reference for service extraction, microservice migration, and language
or runtime upgrades.

## Common Approaches

- carve out one bounded service at a time
- publish events or bridge calls during coexistence
- use compatibility layers for runtime or language-version upgrades

## Guardrails

- keep observability in place before extraction
- verify latency and failure modes after introducing network boundaries
- remove the compatibility layer only after dependency and data paths are clean
