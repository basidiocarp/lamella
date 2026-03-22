# REST to GraphQL Migration Guide

---

## When to Use This Guide

**Migrate to GraphQL when:**
- Multiple round-trips required for complex UI views
- Over-fetching or under-fetching data is problematic
- Supporting diverse client needs (mobile, web, desktop)
- Team boundaries require federated API architecture
- Real-time subscriptions are core requirements
- Type safety across client-server boundary needed
- API versioning complexity is growing

**Success indicators:**
- Client applications make many sequential REST calls
- Different clients need different data shapes
- Mobile apps suffer from bandwidth constraints
- Frontend teams wait on backend API changes
- Multiple REST versions exist concurrently

## When NOT to Use GraphQL

**Stick with REST when:**
- Simple CRUD operations with stable clients
- File upload/download is primary use case
- HTTP caching is critical (CDN, browser cache)
- Team lacks GraphQL expertise and training budget
- Existing REST API is well-designed and sufficient
- Third-party integrations require REST endpoints
- Query complexity would create security risks

**Warning signs:**
- Team of 1-2 developers (operational overhead)
- Primarily server-to-server communication
- Static content delivery is the main requirement
- No complex data relationship navigation needed

---

## Concept Mapping: REST to GraphQL

| REST Concept | GraphQL Equivalent | Notes |
|--------------|-------------------|-------|
| GET /users | Query users | Read operations |
| GET /users/:id | Query user(id: ID!) | Single entity fetch |
| POST /users | Mutation createUser | Create operations |
| PUT /users/:id | Mutation updateUser | Update operations |
| DELETE /users/:id | Mutation deleteUser | Delete operations |
| PATCH /users/:id | Mutation updateUserPartial | Partial updates |
| Query params (?filter=...) | Field arguments | Filtering/sorting |
| URL path segments | Nested field selection | Data relationships |
| Multiple endpoints | Single query | Eliminate round-trips |
| Webhook callbacks | Subscriptions | Real-time updates |
| HTTP status codes | Errors array + data | Partial success model |
| API versioning | Schema evolution | Deprecation over versions |
| /users?include=posts | users { posts } | Eager loading control |
| Offset pagination | Cursor-based connections | Relay specification |
| Accept header | Operation selection | Content negotiation |
| OAuth/JWT tokens | Context authentication | Same auth patterns |

---

## Pattern 1: GET Endpoints to Queries

### REST Endpoint

```typescript
// GET /api/users/:id
interface UserResponse {
  id: string;
  name: string;
  email: string;
// ... (21 lines trimmed)
    }))
  });
});
```

### GraphQL Schema

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  createdAt: DateTime!
// ... (18 lines trimmed)
}

scalar DateTime
```

### GraphQL Resolver with DataLoader

```typescript
import DataLoader from 'dataloader';
import { IResolvers } from '@graphql-tools/utils';

// Batch loading to prevent N+1 queries
const createPostsByUserIdLoader = (db: Database) =>
// ... (71 lines trimmed)
    };
  },
});
```

### Client Query Examples

```typescript
// Flexible field selection - client controls response shape
const MINIMAL_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
// ... (36 lines trimmed)
    }
  }
`;
```

---

## Pattern 2: POST/PUT/DELETE to Mutations

### REST Endpoints

```typescript
// POST /api/users
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email) {
// ... (15 lines trimmed)
  await db.users.delete(req.params.id);
  res.status(204).send();
});
```

### GraphQL Schema

```graphql
type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(input: UpdateUserInput!): UpdateUserPayload!
  deleteUser(id: ID!): DeleteUserPayload!
}
// ... (37 lines trimmed)
  UNAUTHORIZED
  INTERNAL_ERROR
}
```

### GraphQL Mutation Resolvers

```typescript
const resolvers: IResolvers<any, Context> = {
  Mutation: {
    createUser: async (_, { input }, { db, user }) => {
      try {
        // Validation
// ... (82 lines trimmed)
    },
  },
};
```

### Client Mutation Examples

```typescript
const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
// ... (30 lines trimmed)
    navigate(`/users/${data.createUser.user.id}`);
  }
};
```

---

## Pattern 3: Pagination Migration

### REST Offset Pagination

```typescript
// GET /api/posts?page=2&limit=20
app.get('/api/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
// ... (15 lines trimmed)
    },
  });
});
```

### GraphQL Cursor-Based Pagination (Relay Connections)

```graphql
type Query {
  posts(
    first: Int
    after: String
    last: Int
// ... (25 lines trimmed)
  authorId: ID
  titleContains: String
}
```

### Cursor Pagination Resolver

```typescript
import { encodeCursor, decodeCursor } from './cursor-utils';

const resolvers: IResolvers = {
  Query: {
    posts: async (_, args, { db }) => {
// ... (60 lines trimmed)
  const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
  return parseInt(decoded.replace('cursor:', ''));
};
```

### Client Pagination Query

```typescript
const POSTS_QUERY = gql`
  query Posts($first: Int!, $after: String, $filter: PostFilter) {
    posts(first: $first, after: $after, filter: $filter) {
      edges {
        node {
// ... (54 lines trimmed)
    </div>
  );
};
```

---

## Pattern 4: Authentication Translation

### REST Authentication

```typescript
// REST middleware
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

// ... (9 lines trimmed)
  next();
});
```

### GraphQL Authentication Context

```typescript
import { ApolloServer } from '@apollo/server';
import { GraphQLError } from 'graphql';

interface AuthContext {
  user: User | null;
// ... (36 lines trimmed)
    };
  },
});
```

### Field-Level Authorization

```typescript
import { GraphQLFieldResolver } from 'graphql';

// Authorization directive
const resolvers: IResolvers = {
  Query: {
// ... (23 lines trimmed)
    },
  },
};
```

---

## BFF (Backend for Frontend) Architecture

### Multi-Client GraphQL Gateway

```typescript
// Schema stitching for different clients
import { stitchSchemas } from '@graphql-tools/stitch';

// Mobile-optimized schema
const mobileSchema = makeExecutableSchema({
// ... (47 lines trimmed)

  return webServer.handleRequest(req, res);
});
```

---

## Incremental Migration Strategy

### Phase 1: GraphQL Wrapper (Weeks 1-2)

```typescript
// Wrap existing REST endpoints with GraphQL
const resolvers: IResolvers = {
  Query: {
    user: async (_, { id }) => {
// ... (7 lines trimmed)
// Allows GraphQL adoption without backend rewrites
// Clients can start using GraphQL immediately
```

### Phase 2: Parallel Implementation (Weeks 3-6)

```typescript
// Implement GraphQL resolvers with direct DB access
// Keep REST endpoints running
const resolvers: IResolvers = {
  Query: {
    user: async (_, { id }, { db }) => {
// ... (20 lines trimmed)
  const user = await db.users.findById(req.params.id);
  res.json(user);
});
```

### Phase 3: Client Migration (Weeks 7-12)

```typescript
// Gradual client migration with monitoring
import { setContext } from '@apollo/client/link/context';

const migrationLink = setContext((_, { headers }) => {
// ... (8 lines trimmed)
// A/B test GraphQL vs REST in production
// Monitor performance, errors, client satisfaction
```

### Phase 4: REST Deprecation (Week 13+)

```typescript
// Deprecate REST endpoints gradually
app.get('/api/users/:id', (req, res) => {
  res.status(410).json({
    error: 'This endpoint is deprecated',
// ... (5 lines trimmed)

// Eventually remove REST entirely
```

---

## Common Pitfalls

### Pitfall 1: N+1 Query Problem

```typescript
// BAD - Causes N+1 queries
const resolvers = {
  User: {
    posts: async (user, _, { db }) => {
      // Called once per user - N queries if you fetch N users
// ... (11 lines trimmed)
    },
  },
};
```

### Pitfall 2: Exposing Database Schema Directly

```typescript
// BAD - Tightly coupled to database
type User {
  user_id: Int!          # Database column name
  first_name: String     # Database structure leaks
// ... (8 lines trimmed)
  createdAt: DateTime!   # Proper type
}
```

### Pitfall 3: Missing Error Handling

```typescript
// BAD - Errors kill entire response
const resolvers = {
  Query: {
    dashboard: async () => {
      const user = await fetchUser();     // Throws on error
// ... (29 lines trimmed)
    },
  },
};
```

### Pitfall 4: Ignoring Query Complexity

```typescript
// BAD - No limits on query depth/complexity
// Client can write expensive queries that DOS the server

// GOOD - Implement complexity limits
import { createComplexityLimitRule } from 'graphql-validation-complexity';
// ... (21 lines trimmed)
    posts: [Post!]! @cost(complexity: 5, multipliers: ["first"])
  }
`;
```

### Pitfall 5: Over-Normalization

```typescript
// BAD - Too granular, requires many queries
type Query {
  userName(id: ID!): String
  userEmail(id: ID!): String
  userPosts(userId: ID!): [Post!]!
// ... (9 lines trimmed)
  email: String!
  posts: [Post!]!
}
```

---

## Cross-References

**Related Skills:**
- **graphql-patterns/references/schema-design.md** - Type system patterns and schema structure
- **graphql-patterns/references/federation-guide.md** - Multi-service GraphQL architecture
- **backend-developer** - REST API implementation patterns
- **api-designer** - API design principles and consistency

**When to Escalate:**
- Federation across microservices → See federation-guide.md
- Schema design questions → See schema-design.md
- Complex subscription requirements → Consult graphql-patterns
- Performance optimization → Partner with performance-engineer

---

## Migration Checklist

- [ ] Identify most-used REST endpoints
- [ ] Map REST resources to GraphQL types
- [ ] Design schema following best practices
- [ ] Implement DataLoaders for all relations
- [ ] Add authentication/authorization
- [ ] Implement pagination (cursor-based)
- [ ] Set up query complexity limits
- [ ] Create client migration plan
- [ ] Monitor performance metrics
- [ ] Document GraphQL queries for clients
- [ ] Train team on GraphQL patterns
- [ ] Plan REST endpoint sunset timeline

**Migration complete when:**
- All critical paths use GraphQL
- REST endpoints deprecated with sunset dates
- Client applications fully migrated
- Performance metrics meet or exceed REST baseline
- Team confident in GraphQL maintenance
