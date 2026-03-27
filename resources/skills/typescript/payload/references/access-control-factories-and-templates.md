# Access Factories and Templates

## Factory Functions

Reusable helpers keep policy intent consistent:

```ts
export function createRoleBasedAccess(roles: string[]): Access {
  return ({ req: { user } }) => {
    if (!user) return false
    return roles.some((role) => user.roles?.includes(role))
  }
}
```

```ts
export function createOrgScopedAccess(allowAdmin = true): Access {
  return ({ req: { user } }) => {
    if (!user) return false
    if (allowAdmin && user.roles?.includes("admin")) return true
    return { organizationId: { equals: user.organizationId } }
  }
}
```

## Subscription and Tier Checks

Async checks are acceptable for truly external decisions, but keep them narrow and cacheable.

## Collection Templates

Common templates:

- authenticated-only collections
- public-read plus authenticated-write collections
- self-service user collections

Use these as starting shapes, then layer business-specific constraints on top.
