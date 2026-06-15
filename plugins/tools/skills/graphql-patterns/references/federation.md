# Apollo Federation

## Subgraph Setup

```typescript
import { ApolloServer } from '@apollo/server'
import { buildSubgraphSchema } from '@apollo/subgraph'
import gql from 'graphql-tag'

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.5", import: ["@key"])

  type User @key(fields: "id") {
    id: ID!
    email: String!
    username: String!
  }

  type Query {
    user(id: ID!): User
  }
`

const resolvers = {
  Query: {
    user: (_parent, { id }) => ({ id, email: 'alice@example.com', username: 'alice' }),
  },
}

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
})
```

## Entity Keys and References

```graphql
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.5", import: ["@key", "@external"])

type Product @key(fields: "id") {
  id: ID!
  name: String!
}

type Review @key(fields: "id") {
  id: ID!
  product: Product!
  rating: Int!
  content: String!
}
```

Use `@key` for entities other subgraphs need to reference by identity.

## Extending Types Across Subgraphs

```graphql
# users subgraph
type User @key(fields: "id") {
  id: ID!
  email: String!
}

# posts subgraph
extend type User @key(fields: "id") {
  id: ID! @external
  posts: [Post!]!
}

type Post {
  id: ID!
  authorId: ID!
  author: User!
}
```

```typescript
const resolvers = {
  User: {
    __resolveReference: async (reference: { id: string }, { dataSources }) =>
      dataSources.users.byId(reference.id),
    posts: async (user: { id: string }, { dataSources }) =>
      dataSources.posts.byAuthor(user.id),
  },
}
```

## Federation Directives

```graphql
extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.5"
    import: ["@key", "@requires", "@provides", "@shareable", "@override"]
  )

type Inventory @key(fields: "sku") {
  sku: ID!
  inStock: Boolean! @shareable
  shippingEstimate: String! @requires(fields: "inStock")
}
```

Use:
- `@shareable` for fields multiple subgraphs can safely resolve
- `@requires` when a resolver depends on external fields
- `@override` during gradual ownership migration

## Gateway Configuration

```typescript
import { ApolloServer } from '@apollo/server'
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway'

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'users', url: 'http://localhost:4001/graphql' },
      { name: 'posts', url: 'http://localhost:4002/graphql' },
    ],
  }),
})

const server = new ApolloServer({ gateway })
```

## Value Types vs Entities

```graphql
type Address {
  street: String!
  city: String!
  country: String!
}

type Order @key(fields: "id") {
  id: ID!
  shippingAddress: Address!
}
```

Use value types for embedded data owned by one subgraph. Use entities for data
shared and extended across subgraphs.

## Best Practices

1. Keep subgraph boundaries aligned with service or team ownership.
2. Prefer a small number of stable entity keys.
3. Test schema composition in CI before deploying subgraphs.
4. Document who owns each entity and which fields are shared.
