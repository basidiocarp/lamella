## Infrastructure Patterns

Use this reference for backend operational scaffolding rather than request-domain logic.

### Main Areas

- centralized error handling
- retries and backoff
- queues and background jobs
- structured logging and request context

### Rule

Keep infrastructure code boring and predictable. If it becomes more complex than the feature code it supports, split responsibilities sooner.
