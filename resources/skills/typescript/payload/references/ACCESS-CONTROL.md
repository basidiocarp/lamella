# Payload Access Control

Use this page as the routing layer for Payload access control patterns.

## Load Order

| Need | Reference |
| --- | --- |
| collection and global access decisions | `collection-and-global-access.md` |
| field access and role patterns | `field-access-and-rbac.md` |
| API-key, tenant, and scoped access patterns | `tenant-and-api-key-patterns.md` |

## Core Rules

- keep collection and field access responsibilities separate
- return query constraints only where Payload supports them
- make role storage and JWT behavior explicit if you implement RBAC yourself
