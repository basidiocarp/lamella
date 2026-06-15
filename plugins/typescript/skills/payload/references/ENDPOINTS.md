# Payload Custom API Endpoints Reference

Use this file as the quick router for Payload custom endpoint work.

## When to Add a Custom Endpoint

Use one when:
- CRUD generation is not enough
- auth, preview, webhook, or integration logic needs a custom flow
- request or response shape does not fit normal collection operations

Avoid one when:
- a standard collection/global operation already works
- the behavior belongs in hooks instead of a new route

## Endpoint Shape

```ts
export const customEndpoint = {
  path: '/custom-path',
  method: 'post',
  handler: async (req) => {
    return Response.json({ ok: true })
  },
}
```

## Reference Split

See:
- [`endpoint-patterns.md`](./endpoint-patterns.md)
- [`endpoint-helpers.md`](./endpoint-helpers.md)

Keep this file as the overview. Use the focused references for actual implementation patterns.
