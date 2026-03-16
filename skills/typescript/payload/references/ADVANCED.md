# Payload CMS Advanced Features

Complete reference for authentication, jobs, custom endpoints, components, plugins, and localization.

## Authentication

### Login

```ts
// REST API
const response = await fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
// ... (10 lines trimmed)
    password: 'password',
  },
})
```

### Forgot Password

```ts
await payload.forgotPassword({
  collection: 'users',
  data: {
    email: 'user@example.com',
  },
})
```

### Custom Strategy

```ts
import type { CollectionConfig, Strategy } from 'payload'

const customStrategy: Strategy = {
  name: 'custom',
  authenticate: async ({ payload, headers }) => {
// ... (12 lines trimmed)
  },
  fields: [],
}
```

### API Keys

```ts
import type { CollectionConfig } from 'payload'

export const APIKeys: CollectionConfig = {
  slug: 'api-keys',
  auth: {
    disableLocalStrategy: true,
    useAPIKey: true,
  },
  fields: [],
}
```

## Jobs Queue

Offload long-running or scheduled tasks to background workers.

### Tasks

```ts
import { buildConfig } from 'payload'
import type { TaskConfig } from 'payload'

export default buildConfig({
  jobs: {
// ... (17 lines trimmed)
    ],
  },
})
```

### Queueing Jobs

```ts
// In a hook or endpoint
await req.payload.jobs.queue({
  task: 'sendWelcomeEmail',
  input: {
    userEmail: 'user@example.com',
    userName: 'John',
  },
  waitUntil: new Date('2024-12-31'), // Optional: schedule for future
})
```

### Workflows

Multi-step jobs that run in sequence:

```ts
{
  slug: 'onboardUser',
  inputSchema: [{ name: 'userId', type: 'text' }],
  handler: async ({ job, req }) => {
    const results = await job.runInlineTask({
// ... (13 lines trimmed)
    })
  },
}
```

## Custom Endpoints

Add custom REST API routes to collections, globals, or root config. See [ENDPOINTS.md](ENDPOINTS.md) for detailed patterns, authentication, helpers, and real-world examples.

### Root Endpoints

```ts
import { buildConfig } from 'payload'
import type { Endpoint } from 'payload'

const helloEndpoint: Endpoint = {
  path: '/hello',
// ... (18 lines trimmed)
  collections: [],
  secret: process.env.PAYLOAD_SECRET || '',
})
```

### Collection Endpoints

```ts
import type { CollectionConfig, Endpoint } from 'payload'

const featuredEndpoint: Endpoint = {
  path: '/featured',
  method: 'get',
// ... (14 lines trimmed)
    { name: 'featured', type: 'checkbox' },
  ],
}
```

## Custom Components

### Field Component (Client)

```tsx
'use client'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

export const CustomField: TextFieldClientComponent = () => {
  const { value, setValue } = useField()

  return <input value={value || ''} onChange={(e) => setValue(e.target.value)} />
}
```

### Custom View

```tsx
'use client'
import { DefaultTemplate } from '@payloadcms/next/templates'

export const CustomView = () => {
  return (
    <DefaultTemplate>
      <h1>Custom Dashboard</h1>
      {/* Your content */}
    </DefaultTemplate>
  )
}
```

### Admin Config

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    components: {
// ... (10 lines trimmed)
  collections: [],
  secret: process.env.PAYLOAD_SECRET || '',
})
```

## Plugins

### Available Plugins

- **@payloadcms/plugin-seo** - SEO fields with meta title/description, Open Graph, preview generation
- **@payloadcms/plugin-redirects** - Manage URL redirects (301/302) for Next.js apps
- **@payloadcms/plugin-nested-docs** - Hierarchical document structures with breadcrumbs
- **@payloadcms/plugin-form-builder** - Dynamic form builder with submissions and validation
- **@payloadcms/plugin-search** - Full-text search integration (Algolia support)
- **@payloadcms/plugin-stripe** - Stripe payments, subscriptions, webhooks
- **@payloadcms/plugin-ecommerce** - Complete ecommerce solution (products, variants, carts, orders)
- **@payloadcms/plugin-import-export** - Import/export data via CSV
- **@payloadcms/plugin-multi-tenant** - Multi-tenancy with tenant isolation
- **@payloadcms/plugin-sentry** - Sentry error tracking integration
- **@payloadcms/plugin-mcp** - Model Context Protocol for AI integrations

### Using Plugins

```ts
import { buildConfig } from 'payload'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

export default buildConfig({
// ... (8 lines trimmed)
  collections: [],
  secret: process.env.PAYLOAD_SECRET || '',
})
```

### Creating Plugins

```ts
import type { Config } from 'payload'

interface PluginOptions {
  enabled?: boolean
}
// ... (14 lines trimmed)
      // Plugin initialization
    },
  })
```

## Localization

```ts
import { buildConfig } from 'payload'
import type { Field, Payload } from 'payload'

export default buildConfig({
  localization: {
// ... (17 lines trimmed)
  collection: 'posts',
  locale: 'es',
})
```

## TypeScript Type References

For complete TypeScript type definitions and signatures, reference these files from the Payload source:

### Core Configuration Types

- **[All Commonly-Used Types](https://github.com/payloadcms/payload/blob/main/packages/payload/src/index.ts)** - Check here first for commonly used types and interfaces. All core types are exported from this file.

### Database & Adapters

- **[Database Adapter Types](https://github.com/payloadcms/payload/blob/main/packages/payload/src/database/types.ts)** - Base adapter interface
- **[MongoDB Adapter](https://github.com/payloadcms/payload/blob/main/packages/db-mongodb/src/index.ts)** - MongoDB-specific options
- **[Postgres Adapter](https://github.com/payloadcms/payload/blob/main/packages/db-postgres/src/index.ts)** - Postgres-specific options

### Rich Text & Plugins

- **[Lexical Types](https://github.com/payloadcms/payload/blob/main/packages/richtext-lexical/src/exports/server/index.ts)** - Lexical editor configuration

When users need detailed type information, fetch these URLs to provide complete signatures and optional parameters.
