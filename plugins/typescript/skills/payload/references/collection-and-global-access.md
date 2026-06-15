# Collection and Global Access

Use collection or global access controls to decide who can perform whole-object
operations.

## Good Uses

- create, read, update, delete gates
- row-level filtering through supported query constraints
- admin-only or owner-only policies

## Rule

Keep whole-document permission logic here. Do not overload field access checks
with document-scoping responsibilities.
