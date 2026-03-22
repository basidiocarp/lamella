# GraphQL Subscriptions

## Basic Subscription Setup

```typescript
// schema.graphql
type Subscription {
  postCreated: Post!
  postUpdated(id: ID!): Post!
  commentAdded(postId: ID!): Comment!
// ... (68 lines trimmed)
app.use('/graphql', express.json(), expressMiddleware(server));

httpServer.listen(4000);
```

## PubSub Implementation

```typescript
// pubsub.ts
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

// In-memory (development only)
// ... (19 lines trimmed)
  COMMENT_ADDED: 'COMMENT_ADDED',
  USER_ONLINE: 'USER_ONLINE',
} as const;
```

## Subscription Resolvers

```typescript
import { withFilter } from 'graphql-subscriptions';
import { pubsub, EVENTS } from './pubsub';

const resolvers = {
  Subscription: {
// ... (86 lines trimmed)
    },
  },
};
```

## Advanced Filtering

```typescript
// Type-safe payload
interface PostCreatedPayload {
  postCreated: Post;
  tags: string[];
  isPublic: boolean;
// ... (38 lines trimmed)
    },
  },
};
```

## Connection Management

```typescript
import { useServer } from 'graphql-ws/lib/use/ws';

const wsServer = useServer(
  {
    schema,
// ... (51 lines trimmed)
  },
  wsServer
);
```

## Subscription Patterns

```typescript
// Pattern 1: Entity updates
type Subscription {
  entityUpdated(id: ID!): Entity!
}

// ... (28 lines trimmed)
    },
  },
};
```

## Error Handling

```typescript
const resolvers = {
  Subscription: {
    postCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([EVENTS.POST_CREATED]),
// ... (28 lines trimmed)
    },
  },
};
```

## Client Usage

```typescript
// Apollo Client setup
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
// ... (51 lines trimmed)

// Unsubscribe
subscription.unsubscribe();
```

## Scaling Subscriptions

```typescript
// Use Redis for multi-instance deployments
import { RedisPubSub } from 'graphql-redis-subscriptions';

// Horizontal scaling pattern
const pubsub = new RedisPubSub({
// ... (10 lines trimmed)
// Load balancing with sticky sessions
// Ensure same user connects to same server instance
// for connection state management
```

## Subscription Best Practices

1. **Authentication**: Always validate auth in onConnect and filters
2. **Authorization**: Check permissions in withFilter
3. **Rate Limiting**: Limit subscriptions per user
4. **Filtering**: Use withFilter for server-side filtering
5. **Cleanup**: Always clean up subscriptions on disconnect
6. **Scaling**: Use Redis PubSub for multi-instance deployments
7. **Error Handling**: Gracefully handle errors in filters and resolvers
8. **Testing**: Test subscription lifecycle and filtering
9. **Monitoring**: Track active connections and subscription count
10. **Performance**: Avoid N+1 in subscription resolvers
