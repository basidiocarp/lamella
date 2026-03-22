# GraphQL Security

## Query Depth Limiting

```typescript
import depthLimit from 'graphql-depth-limit';
import { ApolloServer } from '@apollo/server';

const server = new ApolloServer({
  typeDefs,
// ... (34 lines trimmed)
//     }
//   }
// }
```

## Query Complexity Analysis

```typescript
import { createComplexityRule } from 'graphql-validation-complexity';
import { GraphQLError } from 'graphql';

// Define field complexities
const complexityRule = createComplexityRule({
// ... (39 lines trimmed)
  resolvers,
  validationRules: [complexityRule],
});
```

## Custom Complexity Directives

```graphql
# Schema definition
directive @cost(
  complexity: Int!
  multipliers: [String!]
) on FIELD_DEFINITION
// ... (19 lines trimmed)
  # Expensive computation
  recommendations: [User!]! @cost(complexity: 20)
}
```

```typescript
// Complexity calculator implementation
import { DirectiveNode } from 'graphql';

function calculateComplexity(
  field: any,
// ... (24 lines trimmed)

  return cost + childComplexity;
}
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

// IP-based rate limiting
// ... (41 lines trimmed)
    return { userId };
  },
});
```

## Authentication

```typescript
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

// JWT verification
function verifyToken(token: string): User | null {
// ... (53 lines trimmed)
    },
  },
};
```

## Authorization Patterns

```typescript
// Directive-based authorization
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';

function authDirective(directiveName: string) {
// ... (54 lines trimmed)
`;

const schema = authDirective('auth')(makeExecutableSchema({ typeDefs, resolvers }));
```

## Field-Level Authorization

```typescript
// Row-level security
const resolvers = {
  Query: {
    posts: async (parent, args, context: Context) => {
      // Filter based on user permissions
// ... (30 lines trimmed)
    },
  },
};
```

## Query Allowlisting

```typescript
// Persisted queries (automatic allowlisting)
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { createHash } from 'crypto';

// Client side
// ... (45 lines trimmed)
    },
  ],
});
```

## Input Validation

```typescript
import { z } from 'zod';

// Zod schema for input validation
const CreatePostSchema = z.object({
  title: z.string().min(3).max(200),
// ... (26 lines trimmed)
    },
  },
};
```

## Introspection Control

```typescript
// Disable introspection in production
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';

const server = new ApolloServer({
// ... (27 lines trimmed)
    },
  ],
});
```

## CSRF Protection

```typescript
import csrf from 'csurf';

// CSRF protection for mutations
const csrfProtection = csrf({ cookie: true });

app.post('/graphql', csrfProtection, expressMiddleware(server));

// Client must send CSRF token
// fetch('/graphql', {
//   method: 'POST',
//   headers: {
//     'CSRF-Token': csrfToken,
//   },
//   body: JSON.stringify({ query }),
// });
```

## Security Best Practices

1. **Depth Limiting**: Prevent deeply nested queries
2. **Complexity Analysis**: Calculate and limit query cost
3. **Rate Limiting**: Limit requests per user/IP
4. **Authentication**: Verify user identity in context
5. **Authorization**: Check permissions in resolvers
6. **Input Validation**: Validate all mutation inputs
7. **Query Allowlisting**: Use persisted queries in production
8. **Introspection Control**: Disable in production
9. **Error Sanitization**: Don't expose sensitive data in errors
10. **CORS Configuration**: Restrict allowed origins
11. **HTTPS Only**: Always use HTTPS in production
12. **Audit Logging**: Log sensitive operations
