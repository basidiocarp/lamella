# Transport and Introspection

Use this reference for production-edge hardening around the GraphQL endpoint.

## Introspection Policy

Disable or tightly gate introspection in production unless the API is intended
for exploratory public use.

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== "production"
});
```

## CSRF and CORS

- treat browser-exposed GraphQL endpoints like any other state-changing API
- restrict origins explicitly
- require CSRF controls for cookie-authenticated mutation flows

## Transport Rules

- require HTTPS in production
- set request-size limits at the gateway
- log operation names and transport failures for auditability
