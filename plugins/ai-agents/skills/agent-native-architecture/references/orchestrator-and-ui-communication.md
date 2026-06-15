# Orchestrator and UI Communication

Use one execution engine for lifecycle management, then vary configuration by
agent type.

## Shared Orchestrator Responsibilities

- start, pause, resume, and stop sessions
- save checkpoints
- track task progress
- enforce common tool result handling
- emit user-visible status changes

## UI Communication Patterns

Choose one:

1. Shared service observed by the UI.
2. File watcher that reacts to durable agent writes.
3. Event bus for more complex multi-component apps.

## Design Rule

If one agent type gets checkpointing, cancellation, or status reporting, all
other agent types should inherit the same operational behavior from the shared
orchestrator instead of re-implementing it.
