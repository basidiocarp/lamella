# GraphQL Resolvers

## Basic Resolver Pattern

```typescript
import type { GraphQLResolveInfo } from 'graphql'

type Resolver<TSource, TArgs, TContext, TReturn> = (
  parent: TSource,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TReturn> | TReturn

type Context = {
  userId?: string
  dataSources: {
    users: { byId(id: string): Promise<User | null> }
  }
}

const resolvers = {
  Query: {
    user: async (_parent, { id }: { id: string }, context: Context) => {
      return context.dataSources.users.byId(id)
    },
  },
}
```

## Context Setup

```typescript
import type { Request } from 'express'

export type Context = {
  requestId: string
  userId?: string
  loaders: ReturnType<typeof createLoaders>
  dataSources: DataSources
}

export async function buildContext({ req }: { req: Request }): Promise<Context> {
  const userId = req.header('x-user-id') ?? undefined
  const dataSources = createDataSources()

  return {
    requestId: req.header('x-request-id') ?? crypto.randomUUID(),
    userId,
    dataSources,
    loaders: createLoaders(dataSources),
  }
}
```

## DataLoader for N+1 Prevention

```typescript
import DataLoader from 'dataloader'

export function createLoaders(dataSources: DataSources) {
  return {
    userById: new DataLoader(async (ids: readonly string[]) => {
      const users = await dataSources.users.byIds([...ids])
      const byId = new Map(users.map((user) => [user.id, user]))
      return ids.map((id) => byId.get(id) ?? null)
    }),
  }
}
```

## Field Resolvers

```typescript
const resolvers = {
  User: {
    fullName: (user: User) => `${user.firstName} ${user.lastName}`,
    posts: (user: User, _args: unknown, context: Context) => {
      return context.dataSources.posts.byAuthor(user.id)
    },
  },
}
```

## Interface and Union Resolvers

```typescript
const resolvers = {
  Searchable: {
    __resolveType(obj: Article | Video | Podcast) {
      if ('content' in obj) return 'Article'
      if ('durationSeconds' in obj) return 'Video'
      return 'Podcast'
    },
  },
  SearchResult: {
    __resolveType(obj: Article | Video | Podcast) {
      if ('content' in obj) return 'Article'
      if ('durationSeconds' in obj) return 'Video'
      return 'Podcast'
    },
  },
}
```

## Error Handling

```typescript
import { GraphQLError } from 'graphql'

const resolvers = {
  Mutation: {
    updateUser: async (_parent, { input }, context: Context) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      return context.dataSources.users.update(context.userId, input)
    },
  },
}
```

## Pagination Pattern

```typescript
const resolvers = {
  Query: {
    posts: async (_parent, { first = 20, after }: { first?: number; after?: string }) => {
      const decodedCursor = after ? Buffer.from(after, 'base64').toString('utf8') : null
      return postRepository.list({ first, after: decodedCursor })
    },
  },
}
```

## Resolver Best Practices

1. Build a per-request context and keep it lightweight.
2. Use DataLoader for foreign-key lookups to prevent N+1 queries.
3. Throw explicit GraphQL errors with meaningful extension codes.
4. Keep auth checks in resolvers or shared auth helpers, not scattered in model code.
