# Apollo Federation

## Subgraph Setup

```typescript
// users-subgraph/schema.graphql
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.5", import: ["@key", "@shareable"])

type User @key(fields: "id") {
// ... (38 lines trimmed)
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});
```

## Entity Keys and References

```graphql
# products-subgraph/schema.graphql
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.5", import: [
    "@key",
    "@shareable",
// ... (24 lines trimmed)
  rating: Int!
  content: String!
}
```

## Extending Types Across Subgraphs

```graphql
# users-subgraph: owns User
type User @key(fields: "id") {
  id: ID!
  email: String!
  username: String!
// ... (12 lines trimmed)
  authorId: ID!
  author: User!
}
```

```typescript
// posts-subgraph/resolvers.ts
const resolvers = {
  User: {
    // Reference resolver: fetch User stub by id
    __resolveReference: async (
// ... (16 lines trimmed)
    },
  },
};
```

## Federation Directives

```graphql
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.5", import: [
    "@key",
    "@requires",
    "@provides",
// ... (58 lines trimmed)
  products: [Product!]! @tag(name: "public")
  adminUsers: [User!]! @tag(name: "admin")
}
```

## Gateway Configuration

```typescript
// gateway/server.ts
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';

const gateway = new ApolloGateway({
// ... (26 lines trimmed)

await server.listen(4000);
console.log('Gateway ready at http://localhost:4000');
```

## Managed Federation (Apollo Studio)

```typescript
// gateway/server.ts with managed federation
import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';

const gateway = new ApolloGateway({
// ... (18 lines trimmed)
    ApolloServerPluginInlineTrace(),
  ],
});
```

## Value Types vs Entities

```graphql
# Value type: no @key, resolved entirely by one subgraph
type Address {
  street: String!
  city: String!
  country: String!
// ... (13 lines trimmed)
  id: ID! @external
  orders: [Order!]!
}
```

## Interface Objects

```graphql
# accounts-subgraph
type User implements Account @key(fields: "id") {
  id: ID!
  email: String!
  role: String!
// ... (24 lines trimmed)
type Account @key(fields: "id") @interfaceObject {
  id: ID!
}
```

## Query Planning Optimization

```graphql
# Inefficient: requires multiple roundtrips
type Query {
  user(id: ID!): User
}

// ... (17 lines trimmed)

# Gateway can fulfill some User fields from Post subgraph
# without fetching from User subgraph
```

## Error Handling in Federation

```typescript
const resolvers = {
  User: {
    __resolveReference: async (
      reference: { id: string },
      context: Context
// ... (17 lines trimmed)
    },
  },
};
```

## Federation Best Practices

1. **Entity Design**: Use @key for types that need to be extended
2. **Subgraph Boundaries**: Align with team/service boundaries
3. **Shared Types**: Use @shareable for truly shared fields
4. **Migration**: Use @override for gradual subgraph migration
5. **Performance**: Use @provides to optimize query planning
6. **Value Types**: Use plain types for embedded data
7. **Composition**: Test schema composition in CI/CD
8. **Versioning**: Use managed federation for safe deployments
9. **Monitoring**: Track query planning and resolver performance
10. **Documentation**: Document entity ownership and extension patterns
