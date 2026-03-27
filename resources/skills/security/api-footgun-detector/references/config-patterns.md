# Configuration Security Patterns

Use this page as the routing layer for configuration-driven security failure
classes.

## Load Order

| Need | Reference |
| --- | --- |
| confusing zero, empty, null, wildcard, or boolean semantics | `config-semantic-traps.md` |
| precedence conflicts and environment-driven overrides | `config-precedence-and-environment.md` |
| constructors or config objects that accept unsafe values without validation | `config-parameter-validation.md` |

## Core Rules

- Avoid ambiguous sentinel values for security controls.
- Make secure behavior explicit instead of implied by falsy or special values.
- Fail fast on contradictory settings.
- Validate security-relevant parameters at the boundary where they enter the
  system.
