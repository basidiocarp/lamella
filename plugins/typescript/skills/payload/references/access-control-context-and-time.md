# Context and Time-Based Access

## Context-Aware Patterns

Useful inputs include:

- `req.user`
- `req.locale`
- `req.headers`
- `id`
- `data`

Examples:

```ts
export const localeSpecificAccess: Access = ({ req: { user, locale } }) => {
  if (user) return true
  return locale === "en"
}
```

```ts
export const mobileOnlyAccess: Access = ({ req: { headers } }) => {
  const userAgent = headers?.get("user-agent") || ""
  return /mobile|android|iphone/i.test(userAgent)
}
```

## Time-Based Patterns

Use query constraints when possible:

```ts
export const recentRecordsAccess = (days: number): Access => {
  return ({ req: { user } }) => {
    if (!user) return false
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    return { createdAt: { greater_than_equal: since.toISOString() } }
  }
}
```

This keeps filtering in the database instead of loading records only to reject them later.
