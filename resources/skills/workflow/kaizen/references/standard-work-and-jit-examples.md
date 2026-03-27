# Standardized Work and Just-in-Time Examples

## Standardized Work

- match the codebase's existing API, error, and documentation patterns
- avoid introducing a new idiom just because it is your local preference

## Just-in-Time Design

- solve the current verified requirement first
- add abstraction only after repeated demand

```typescript
const logError = (error: Error) => {
  console.error(error.message)
}
```

That is often better than building a generic logging framework on day one.
