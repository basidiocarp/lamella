# Payload CMS Querying Reference

Complete reference for querying data across Local API, REST, and GraphQL.

## Query Operators

```ts
import type { Where } from 'payload'

// Equals
const equalsQuery: Where = { color: { equals: 'blue' } }

// ... (18 lines trimmed)

// Near (point fields)
const nearQuery: Where = { location: { near: '-122.4194,37.7749,10000' } }
```

## AND/OR Logic

```ts
import type { Where } from 'payload'

const complexQuery: Where = {
  or: [
    { color: { equals: 'mint' } },
    {
      and: [{ color: { equals: 'white' } }, { featured: { equals: false } }],
    },
  ],
}
```

## Nested Properties

```ts
import type { Where } from 'payload'

const nestedQuery: Where = {
  'author.role': { equals: 'editor' },
  'meta.featured': { exists: true },
}
```

## Local API

```ts
// Find documents
const posts = await payload.find({
  collection: 'posts',
  where: {
    status: { equals: 'published' },
// ... (48 lines trimmed)
    status: { equals: 'published' },
  },
})
```

### Threading req Parameter

When performing operations in hooks or nested operations, pass the `req` parameter to maintain transaction context:

```ts
// ✅ CORRECT: Pass req for transaction safety
const afterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await req.payload.create({
    collection: 'audit-log',
    data: { action: 'created', docId: doc.id },
// ... (9 lines trimmed)
    // Missing req - runs in separate transaction
  })
}
```

This is critical for MongoDB replica sets and Postgres. See [ADAPTERS.md#threading-req-through-operations](ADAPTERS.md#threading-req-through-operations) for details.

### Access Control in Local API

**Important**: Local API bypasses access control by default (`overrideAccess: true`). When passing a `user` parameter, you must explicitly set `overrideAccess: false` to respect that user's permissions.

```ts
// ❌ WRONG: User is passed but access control is bypassed
const posts = await payload.find({
  collection: 'posts',
  user: currentUser,
  // Missing: overrideAccess: false
// ... (15 lines trimmed)
  // overrideAccess defaults to true
  // Result: Returns all posts regardless of access control
})
```

**When to use `overrideAccess: false`:**

- Performing operations on behalf of a user
- Testing access control logic
- API routes that should respect user permissions
- Any operation where `user` parameter is provided

**When `overrideAccess: true` is appropriate:**

- Administrative operations (migrations, seeds, cron jobs)
- Internal system operations
- Operations explicitly intended to bypass access control

See [ACCESS-CONTROL.md#important-notes](ACCESS-CONTROL.md#important-notes) for more details.

## REST API

```ts
import { stringify } from 'qs-esm'

const query = {
  status: { equals: 'published' },
}
// ... (9 lines trimmed)

const response = await fetch(`https://api.example.com/api/posts${queryString}`)
const data = await response.json()
```

### REST Endpoints

```txt
GET    /api/{collection}           - Find documents
GET    /api/{collection}/{id}      - Find by ID
POST   /api/{collection}           - Create
PATCH  /api/{collection}/{id}      - Update
DELETE /api/{collection}/{id}      - Delete
GET    /api/{collection}/count     - Count documents

GET    /api/globals/{slug}         - Get global
POST   /api/globals/{slug}         - Update global
```

## GraphQL

```graphql
query {
  Posts(where: { status: { equals: published } }, limit: 10, sort: "-createdAt") {
    docs {
      id
      title
// ... (25 lines trimmed)
    id
  }
}
```

## Performance Best Practices

- Set `maxDepth` on relationships to prevent over-fetching
- Use `select` to limit returned fields
- Index frequently queried fields
- Use `virtual` fields for computed data
- Cache expensive operations in hook `context`
