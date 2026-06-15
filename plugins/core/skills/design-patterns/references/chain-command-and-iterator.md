# Chain, Command, and Iterator

## Chain of Responsibility

Use when multiple handlers can process a request in order.

Typical fit:

- middleware pipelines
- validation stages
- fallback resolution chains

## Command

Use when actions should be queued, logged, retried, or undone.

Typical fit:

- undo or redo stacks
- job execution queues
- explicit action logs

## Iterator

Use when a collection needs a stable traversal contract without exposing its
internal representation.
