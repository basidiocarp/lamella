# Payload CMS Access Control - Advanced Patterns

Advanced access control patterns including context-aware access, time-based restrictions, factory functions, and production templates.

## Context-Aware Access Patterns

### Locale-Specific Access

Control access based on user locale for internationalized content.

```ts
import type { Access } from 'payload'

export const localeSpecificAccess: Access = ({ req: { user, locale } }) => {
  // Authenticated users can access all locales
  if (user) return true
// ... (12 lines trimmed)
  },
  fields: [{ name: 'title', type: 'text', localized: true }],
}
```

**Source**: `docs/access-control/overview.mdx` (req.locale argument)

### Device-Specific Access

Restrict access based on device type or user agent.

```ts
import type { Access } from 'payload'

export const mobileOnlyAccess: Access = ({ req: { headers } }) => {
  const userAgent = headers?.get('user-agent') || ''
  return /mobile|android|iphone/i.test(userAgent)
// ... (12 lines trimmed)
  },
  fields: [{ name: 'title', type: 'text' }],
}
```

**Source**: Synthesized (headers pattern)

### IP-Based Access

Restrict access from specific IP addresses (requires middleware/proxy headers).

```ts
import type { Access } from 'payload'

export const restrictedIpAccess = (allowedIps: string[]): Access => {
  return ({ req: { headers } }) => {
    const ip = headers?.get('x-forwarded-for') || headers?.get('x-real-ip')
// ... (11 lines trimmed)
  },
  fields: [{ name: 'content', type: 'richText' }],
}
```

**Note**: Requires your server to pass IP address via headers (common with proxies/load balancers).

**Source**: Synthesized (headers pattern)

## Time-Based Access Patterns

### Today's Records Only

```ts
import type { Access } from 'payload'

export const todayOnlyAccess: Access = ({ req: { user } }) => {
  if (!user) return false

// ... (8 lines trimmed)
    },
  }
}
```

**Source**: `test/access-control/config.ts` (query constraint patterns)

### Recent Records (Last N Days)

```ts
import type { Access } from 'payload'

export const recentRecordsAccess = (days: number): Access => {
  return ({ req: { user } }) => {
    if (!user) return false
// ... (18 lines trimmed)
  },
  fields: [{ name: 'message', type: 'text' }],
}
```

### Scheduled Content (Publish Date Range)

```ts
import type { Access } from 'payload'

export const scheduledContentAccess: Access = ({ req: { user } }) => {
  // Editors see all content
  if (user?.roles?.includes('admin') || user?.roles?.includes('editor')) {
// ... (12 lines trimmed)
    ],
  }
}
```

**Source**: Synthesized (query constraint + date patterns)

## Subscription-Based Access

### Active Subscription Required

```ts
import type { Access } from 'payload'

export const activeSubscriptionAccess: Access = async ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('admin')) return true
// ... (18 lines trimmed)
  },
  fields: [{ name: 'title', type: 'text' }],
}
```

### Subscription Tier-Based Access

```ts
import type { Access } from 'payload'

export const tierBasedAccess = (requiredTier: string): Access => {
  const tierHierarchy = ['free', 'basic', 'pro', 'enterprise']

// ... (27 lines trimmed)
  },
  fields: [{ name: 'feature', type: 'text' }],
}
```

**Source**: Synthesized (async + cross-collection pattern)

## Factory Functions

Reusable functions that generate access control configurations.

### createRoleBasedAccess

Generate access control for specific roles.

```ts
import type { Access } from 'payload'

export function createRoleBasedAccess(roles: string[]): Access {
  return ({ req: { user } }) => {
    if (!user) return false
// ... (14 lines trimmed)
  },
  fields: [{ name: 'title', type: 'text' }],
}
```

**Source**: `test/access-control/config.ts`

### createOrgScopedAccess

Generate organization-scoped access with optional admin bypass.

```ts
import type { Access } from 'payload'

export function createOrgScopedAccess(allowAdmin = true): Access {
  return ({ req: { user } }) => {
    if (!user) return false
// ... (21 lines trimmed)
    { name: 'organizationId', type: 'text', required: true },
  ],
}
```

**Source**: `test/access-control/config.ts`

### createTeamBasedAccess

Generate team-scoped access with configurable field name.

```ts
import type { Access } from 'payload'

export function createTeamBasedAccess(teamField = 'teamId'): Access {
  return ({ req: { user } }) => {
    if (!user) return false
// ... (19 lines trimmed)
    { name: 'projectTeam', type: 'text', required: true },
  ],
}
```

**Source**: Synthesized (org pattern variation)

### createTimeLimitedAccess

Generate access limited to records within specified days.

```ts
import type { Access } from 'payload'

export function createTimeLimitedAccess(daysAccess: number): Access {
  return ({ req: { user } }) => {
    if (!user) return false
// ... (18 lines trimmed)
  },
  fields: [{ name: 'action', type: 'text' }],
}
```

**Source**: Synthesized (time + query pattern)

## Configuration Templates

Complete collection configurations for common scenarios.

### Basic Authenticated Collection

```ts
import type { CollectionConfig } from 'payload'

export const BasicCollection: CollectionConfig = {
  slug: 'basic-collection',
// ... (9 lines trimmed)
  ],
}
```

**Source**: `docs/access-control/collections.mdx`

### Public + Authenticated Collection

```ts
import type { CollectionConfig } from 'payload'

export const PublicAuthCollection: CollectionConfig = {
  slug: 'posts',
  access: {
// ... (27 lines trimmed)
    { name: 'author', type: 'relationship', relationTo: 'users' },
  ],
}
```

**Source**: `templates/website/src/collections/Posts/index.ts`

### Multi-User/Self-Service Collection

```ts
import type { CollectionConfig } from 'payload'

export const SelfServiceCollection: CollectionConfig = {
  slug: 'users',
  auth: true,
// ... (30 lines trimmed)
    },
  ],
}
```

**Source**: `templates/website/src/collections/Users/index.ts`

## Debugging Tips

### Log Access Check Execution

```ts
export const debugAccess: Access = ({ req: { user }, id }) => {
  console.log('Access check:', {
    userId: user?.id,
    userRoles: user?.roles,
    docId: id,
    timestamp: new Date().toISOString(),
  })
  return true
}
```

### Verify Arguments Availability

```ts
export const checkArgsAccess: Access = (args) => {
  console.log('Available arguments:', {
    hasReq: 'req' in args,
    hasUser: args.req?.user ? 'yes' : 'no',
    hasId: args.id ? 'provided' : 'undefined',
    hasData: args.data ? 'provided' : 'undefined',
  })
  return true
}
```

### Measure Async Operation Timing

```ts
export const timedAsyncAccess: Access = async ({ req }) => {
  const start = Date.now()

  const result = await fetch('https://auth-service.example.com/validate', {
// ... (5 lines trimmed)
  return result.ok
}
```

### Test Access Without User

```ts
// In test/development
const testAccess = await payload.find({
  collection: 'posts',
  overrideAccess: false, // Enforce access control
  user: undefined, // Simulate no user
})

console.log('Public access result:', testAccess.docs.length)
```

**Source**: Synthesized (debugging best practices)

## Performance Considerations

### Async Operations Impact

```ts
// ❌ Slow: Multiple sequential async calls
export const slowAccess: Access = async ({ req: { user } }) => {
  const org = await req.payload.findByID({ collection: 'orgs', id: user.orgId })
  const team = await req.payload.findByID({ collection: 'teams', id: user.teamId })
  const subscription = await req.payload.findByID({ collection: 'subs', id: user.subId })
// ... (10 lines trimmed)

  return context.orgStatus
}
```

### Query Constraint Optimization

```ts
// ❌ Avoid: Non-indexed fields in constraints
export const slowQuery: Access = () => ({
  'metadata.internalCode': { equals: 'ABC123' }, // Slow if not indexed
})

// ✅ Better: Use indexed fields
export const fastQuery: Access = () => ({
  status: { equals: 'active' }, // Indexed field
  organizationId: { in: ['org1', 'org2'] }, // Indexed field
})
```

### Field Access on Large Arrays

```ts
// ❌ Slow: Complex access on array fields
const arrayField: ArrayField = {
  name: 'items',
  type: 'array',
  fields: [
// ... (31 lines trimmed)
    },
  ],
}
```

### Avoid N+1 Queries

```ts
// ❌ N+1 Problem: Query per access check
export const n1Access: Access = async ({ req, id }) => {
  // Runs for EACH document in list
  const doc = await req.payload.findByID({ collection: 'docs', id })
// ... (5 lines trimmed)
  return { isPublic: { equals: true } }
}
```

**Performance Best Practices:**

1. **Minimize Async Operations**: Use query constraints over async lookups when possible
2. **Cache Expensive Checks**: Store results in `req.context` for reuse
3. **Index Query Fields**: Ensure fields in query constraints are indexed
4. **Avoid Complex Logic in Array Fields**: Simple boolean checks preferred
5. **Use Query Constraints**: Let database filter rather than loading all records

**Source**: Synthesized (operational best practices)

## Enhanced Best Practices

Comprehensive security and implementation guidelines:

1. **Default Deny**: Start with restrictive access, gradually add permissions
2. **Type Guards**: Use TypeScript for user type safety and better IDE support
3. **Validate Data**: Never trust frontend-provided IDs or data
4. **Async for Critical Checks**: Use async operations for important security decisions
5. **Consistent Logic**: Apply same rules at field and collection levels
6. **Test Edge Cases**: Test with no user, wrong user, admin user scenarios
7. **Monitor Access**: Log failed access attempts for security review
8. **Regular Audit**: Review access rules quarterly or after major changes
9. **Cache Wisely**: Use `req.context` for expensive operations
10. **Document Intent**: Add comments explaining complex access rules
11. **Avoid Secrets in Client**: Never expose sensitive logic to client-side
12. **Rate Limit External Calls**: Protect against DoS on external validation services
13. **Handle Errors Gracefully**: Access functions should return `false` on error, not throw
14. **Use Environment Vars**: Store configuration (IPs, API keys) in env vars
15. **Test Local API**: Remember to set `overrideAccess: false` when testing
16. **Consider Performance**: Measure impact of async operations on login time
17. **Version Control**: Track access control changes in git history
18. **Principle of Least Privilege**: Grant minimum access required for functionality

**Sources**: `docs/access-control/*.mdx`, synthesized best practices
