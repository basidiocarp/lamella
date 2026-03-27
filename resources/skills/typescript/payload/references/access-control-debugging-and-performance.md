# Access Debugging and Performance

## Debugging

Useful temporary diagnostics:

```ts
export const debugAccess: Access = ({ req: { user }, id }) => {
  console.log("Access check", { userId: user?.id, roles: user?.roles, id })
  return true
}
```

Also validate local API tests with `overrideAccess: false` so you are not accidentally bypassing the policy.

## Performance

Avoid:

- sequential async lookups in every access function
- per-document `findByID` calls in list queries
- constraints on non-indexed fields

Prefer:

- indexed query constraints
- shared lookups cached in `req.context`
- simple boolean field checks for list-heavy collections

The fastest access rule is the one the database can evaluate without extra application round-trips.
