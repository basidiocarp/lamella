# Tenant and API-Key Patterns

Use scoped claims or tenant fields when access must vary by organization or
machine identity.

## Good Uses

- tenant isolation
- scoped API-key access
- organization-aware queries

## Rule

Keep tenant and machine-identity checks explicit. Hidden tenant resolution is a
common source of cross-tenant exposure bugs.
