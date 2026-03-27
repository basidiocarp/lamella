# Parallel and Pipeline Patterns

Use this reference for the two most common orchestrator shapes.

## Parallel Specialists

- Spawn multiple specialists at once.
- Give each one a disjoint evaluation surface.
- Aggregate results after all return.

## Pipeline

- Create dependency-ordered tasks.
- Pass only outputs that unblock the next stage.
- Use when work must happen in a strict order.
