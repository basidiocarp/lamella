# Singleton and Factory Method

## Singleton

Use sparingly. A single global instance is often better expressed as dependency
injection, context, or a framework-managed service.

Good fit:

- truly singular process-wide coordination points
- controlled access to one expensive shared resource

## Factory Method

Use when a caller needs one product interface but creation depends on a type,
variant, or subclass specialization.

Good fit:

- plugin or driver selection
- environment-specific adapters
- constructor logic that is repeated across callsites
