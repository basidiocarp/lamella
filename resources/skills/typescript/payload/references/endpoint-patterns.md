# Payload Endpoint Patterns

Use these patterns for the most common custom endpoint shapes.

## Authentication Check

```ts
import { APIError } from 'payload'

export const protectedEndpoint = {
  path: '/protected',
  method: 'get',
  handler: async (req) => {
    if (!req.user) throw new APIError('Unauthorized', 401)
    return Response.json({ user: req.user.id })
  },
}
```

Custom endpoints are not automatically protected. Check `req.user` explicitly when auth matters.

## Payload Operations

```ts
export const relatedPostsEndpoint = {
  path: '/:id/related',
  method: 'get',
  handler: async (req) => {
    const { id } = req.routeParams
    const posts = await req.payload.find({
      collection: 'posts',
      where: { author: { equals: id } },
    })
    return Response.json(posts)
  },
}
```

Prefer `req.payload` operations so hooks, access control, and config behavior stay consistent.

## Request Body Handling

```ts
export const createEndpoint = {
  path: '/create',
  method: 'post',
  handler: async (req) => {
    const body = await req.json()
    return Response.json({ received: body })
  },
}
```

For uploads or mixed forms, use the helper layer instead of manual parsing.

## Query Parameters

```ts
export const searchEndpoint = {
  path: '/search',
  method: 'get',
  handler: async (req) => {
    const url = new URL(req.url)
    const query = url.searchParams.get('q') ?? ''
    return Response.json({ query })
  },
}
```

## Error Handling

```ts
import { APIError } from 'payload'

throw new APIError('Invalid input', 400)
```

Use `APIError` for expected failures so callers get consistent status codes and message handling.

## Real-World Fits

Custom endpoints are a good fit for:
- login or external auth flows
- webhooks
- preview or import/export helpers
- tenant-aware actions
