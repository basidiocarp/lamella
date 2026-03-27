# GraphQL Subscriptions

## Basic Subscription Setup

```typescript
// schema.graphql
type Subscription {
  postCreated: Post!
  commentAdded(postId: ID!): Comment!
}
```

```typescript
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import http from 'http'

const app = express()
const httpServer = http.createServer(app)

app.use('/graphql', express.json(), expressMiddleware(server))
httpServer.listen(4000)
```

## PubSub

```typescript
import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'

const pubsub = new RedisPubSub({
  publisher: new Redis(process.env.REDIS_URL!),
  subscriber: new Redis(process.env.REDIS_URL!),
})

export const EVENTS = {
  POST_CREATED: 'POST_CREATED',
  COMMENT_ADDED: 'COMMENT_ADDED',
} as const
```

## Subscription Resolvers

```typescript
import { withFilter } from 'graphql-subscriptions'

const resolvers = {
  Subscription: {
    postCreated: {
      subscribe: () => pubsub.asyncIterator([EVENTS.POST_CREATED]),
    },
    commentAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([EVENTS.COMMENT_ADDED]),
        (payload, variables) => payload.commentAdded.postId === variables.postId
      ),
    },
  },
}
```

## Connection Management

```typescript
import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
})

useServer(
  {
    schema,
    context: async (ctx) => {
      const token = ctx.connectionParams?.authorization
      const user = token ? await authService.verify(token) : null
      return { user }
    },
  },
  wsServer
)
```

## Publishing Events

```typescript
await pubsub.publish(EVENTS.POST_CREATED, {
  postCreated: newPost,
})

await pubsub.publish(EVENTS.COMMENT_ADDED, {
  commentAdded: newComment,
})
```

## Client Usage

```typescript
import { createClient } from 'graphql-ws'

const client = createClient({
  url: 'ws://localhost:4000/graphql',
  connectionParams: {
    authorization: 'Bearer token',
  },
})

const dispose = client.subscribe(
  {
    query: `
      subscription OnCommentAdded($postId: ID!) {
        commentAdded(postId: $postId) {
          id
          content
        }
      }
    `,
    variables: { postId: 'post-1' },
  },
  {
    next: (value) => console.log(value),
    error: (err) => console.error(err),
    complete: () => console.log('done'),
  }
)

// later
dispose()
```

## Best Practices

1. Authenticate on websocket connect and authorize in filters.
2. Use server-side filtering to avoid sending irrelevant events.
3. Use Redis-backed PubSub for multi-instance deployments.
4. Track active connections and clean up resources on disconnect.
