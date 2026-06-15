# Authentication and Authorization

Use this reference for identity, roles, and field access in GraphQL servers.

## Context Authentication

```typescript
import jwt from "jsonwebtoken";

function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

const context = async ({ req }) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = token ? verifyToken(token) : null;
  return { user };
};
```

## Directive-Based Authorization

Keep authorization policy reusable instead of duplicating it across resolvers.

```typescript
// Example shape only: wrap fields marked with @auth
// and reject when the current user lacks the required role.
```

## Field-Level Authorization

Use resolver-level filtering when access depends on ownership, tenancy, or row
visibility.

```typescript
const resolvers = {
  Query: {
    posts: async (_parent, _args, context) =>
      context.user.isAdmin ? getAllPosts() : getPostsForUser(context.user.id)
  }
};
```

## Rules

- authenticate once at request entry
- authorize at the field or data-access boundary
- keep admin-only mutations explicit and easy to audit
