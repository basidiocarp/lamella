# Field Access and RBAC

Field access is for field visibility or editability, not row-level filtering.

## RBAC Guidance

- Payload does not give you roles by default
- add a roles field yourself if the application needs it
- include roles in the JWT only when that tradeoff is deliberate

## Rule

Field access returns booleans. If you need scoped querying, move that policy up
to collection or global access.
