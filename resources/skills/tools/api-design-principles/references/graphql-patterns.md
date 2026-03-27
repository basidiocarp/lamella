# GraphQL Design Patterns

Use these patterns when turning GraphQL principles into concrete schema and
resolver choices.

## Schema Shape

Keep types focused on client tasks:

```graphql
type User {
  id: ID!
  email: String!
  orders(first: Int, after: String): OrderConnection!
}
```

Prefer explicit inputs and payloads for mutations.

## Resolver Design

Resolvers should orchestrate domain calls, not contain the whole business
system. Keep validation, persistence, and transformation boundaries obvious.

## DataLoader

Use DataLoaders or equivalent batching to avoid N+1 query behavior when fields
fan out across related entities.

## Error Handling

Mutation payloads should return structured errors instead of relying entirely on
transport-level exceptions.

## Practical Rule

Good GraphQL design is not “one endpoint for everything.” It is a disciplined
schema plus resolver layer that stays predictable for clients and efficient for
the backend.
