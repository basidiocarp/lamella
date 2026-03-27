# Query Guardrails

Use this reference for cost controls that prevent abusive or accidental heavy
queries.

## Depth Limiting

```typescript
import depthLimit from "graphql-depth-limit";
import { ApolloServer } from "@apollo/server";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(8)]
});
```

## Complexity Analysis

```typescript
import { createComplexityRule } from "graphql-validation-complexity";

const complexityRule = createComplexityRule({
  maximumComplexity: 5000,
  scalarCost: 1,
  objectCost: 2,
  listFactor: 10
});
```

## Persisted Queries

Prefer allowlisted or persisted queries for public clients in production. That
reduces the query surface and makes rate limiting easier to reason about.

## Request Throttling

- throttle by user or API key first
- fall back to IP rate limits at the edge
- log rejected operations with operation name and cost
