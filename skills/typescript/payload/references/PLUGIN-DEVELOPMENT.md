# Payload Plugin Development

Complete guide to creating Payload CMS plugins with TypeScript patterns, package structure, and best practices from the official Payload plugin template.

## Plugin Architecture

Plugins are functions that receive configuration options and return a function that transforms the Payload config:

```ts
import type { Config, Plugin } from 'payload'

interface MyPluginConfig {
  enabled?: boolean
// ... (7 lines trimmed)
    // Transform config here
  })
```

**Key Pattern:** Double arrow function (currying)

- First function: Accepts plugin options, returns plugin function
- Second function: Accepts Payload config, returns modified config

## Plugin Package Structure

### Simple Structure

```
plugin-<name>/
├── package.json              # Package metadata and dependencies
├── README.md                 # Plugin documentation
├── LICENSE.md                # License file
└── src/
    ├── index.ts              # Entry point, re-exports plugin and config types
    ├── plugin.ts             # Plugin implementation
    ├── types.ts              # TypeScript type definitions
    └── exports/              # Additional entry points (optional)
        └── types.ts          # Type-only exports
```

### Exhaustive Structure

```
plugin-<name>/
├── .swcrc                    # SWC compiler config
├── package.json              # Package metadata and dependencies
├── tsconfig.json             # TypeScript config
├── README.md                 # Plugin documentation
// ... (24 lines trimmed)
    │   └── index.ts
    └── ui/                   # Admin UI components (optional)
        └── Component.tsx
```

**Key additions from official template:**

- **dev/** directory with complete Payload project for local testing
- **src/exports/rsc.ts** for React Server Component exports
- **src/components/** for organizing React components
- **src/endpoints/** for custom API endpoint handlers
- Test configuration files (vitest.config.js, playwright.config.js)

## Package.json Configuration

```json
{
  "name": "payload-plugin-example",
  "version": "1.0.0",
  "description": "A Payload CMS plugin",
  "type": "module",
// ... (61 lines trimmed)
    "payload": "^3.0.0"
  }
}
```

**Key Points:**

- `type: "module"` for ESM
- Compiled output in `./dist`, source in `./src`
- Payload as peer dependency (user installs it)
- Multiple export entry points: main, `/types`, `/client`, `/rsc`
- `/client` for client components, `/rsc` for React Server Components
- SWC for fast compilation
- Dev scripts for local development with Next.js
- Test scripts for both integration (Vitest) and e2e (Playwright) tests
- `prepublishOnly` ensures build before publish

## Plugin Patterns

### Adding Fields to Collections

```ts
import type { Config, Plugin, Field } from 'payload'

export const seoPlugin =
  (options: { collections?: string[] }): Plugin =>
  (config: Config): Config => {
// ... (21 lines trimmed)
      }),
    }
  }
```

### Adding New Collections

```ts
import type { Config, Plugin, CollectionConfig } from 'payload'

export const redirectsPlugin =
  (options: { overrides?: Partial<CollectionConfig> }): Plugin =>
  (config: Config): Config => {
// ... (12 lines trimmed)
      collections: [...(config.collections || []), redirectsCollection],
    }
  }
```

### Adding Hooks

```ts
import type { Config, Plugin, CollectionAfterChangeHook } from 'payload'

const resaveChildrenHook: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'update') {
    // Resave child documents
// ... (30 lines trimmed)
      return collection
    }),
  })
```

### Adding Root-Level Endpoints

Add endpoints at the root config level (accessible at `/api/<path>`):

```ts
import type { Config, Plugin, Endpoint } from 'payload'

export const seoPlugin =
  (options: { generateTitle?: (doc: any) => string }): Plugin =>
  (config: Config): Config => {
// ... (12 lines trimmed)
      endpoints: [...(config.endpoints ?? []), generateTitleEndpoint],
    }
  }
```

**Example webhook endpoint:**

```ts
// Useful for integrations like Stripe
const webhookEndpoint: Endpoint = {
  path: '/stripe/webhook',
  method: 'post',
// ... (9 lines trimmed)
  },
}
```

### Field Overrides with Defaults

```ts
import type { Config, Plugin, Field } from 'payload'

type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

interface PluginConfig {
// ... (27 lines trimmed)
      }),
    }
  }
```

### Tabs UI Pattern

```ts
import type { Config, Plugin, TabsField, GroupField } from 'payload'

export const seoPlugin =
  (options: { tabbedUI?: boolean }): Plugin =>
  (config: Config): Config => {
// ... (47 lines trimmed)
      }),
    }
  }
```

### Disable Plugin Pattern

Allow users to disable plugin without removing it (important for database schema consistency):

```ts
import type { Config, Plugin } from 'payload'

interface PluginConfig {
  disabled?: boolean
  collections?: string[]
// ... (42 lines trimmed)

    return config
  }
```

### Admin Components

Add custom UI components to the admin panel:

```ts
import type { Config, Plugin } from 'payload'

export const myPlugin =
  (options: PluginConfig): Plugin =>
  (config: Config): Config => {
// ... (11 lines trimmed)

    return config
  }
```

**Component file structure:**

```tsx
// src/components/BeforeDashboardClient.tsx
'use client'
import { useConfig } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import { formatAdminURL } from 'payload/shared'
// ... (26 lines trimmed)

// src/exports/rsc.ts
export { BeforeDashboardServer } from '../components/BeforeDashboardServer.js'
```

### Translations (i18n)

```ts
// src/translations/index.ts
export const translations = {
  en: {
    'plugin-name:fieldLabel': 'Field Label',
    'plugin-name:fieldDescription': 'Field description',
// ... (17 lines trimmed)
      translations: deepMergeSimple(translations, config.i18n?.translations ?? {}),
    },
  })
```

### onInit Hook

```ts
export const myPlugin =
  (options: PluginConfig): Plugin =>
  (config: Config): Config => {
    const incomingOnInit = config.onInit

// ... (20 lines trimmed)

    return config
  }
```

## TypeScript Patterns

### Plugin Config Types

```ts
import type { CollectionSlug, GlobalSlug, Field, CollectionConfig } from 'payload'

export type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

export interface MyPluginConfig {
// ... (18 lines trimmed)
   */
  overrides?: Partial<CollectionConfig>
}
```

### Export Types

```ts
// src/exports/types.ts
export type { MyPluginConfig, FieldsOverride } from '../types.js'

// Usage
import type { MyPluginConfig } from '@payloadcms/plugin-example/types'
```

## Client Components

### Custom Field Component

```tsx
// src/fields/CustomField/Component.tsx
'use client'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
// ... (9 lines trimmed)
  )
}
```

```ts
// src/fields/CustomField/index.ts
import type { Field } from 'payload'

export const CustomField = (overrides?: Partial<Field>): Field => ({
// ... (7 lines trimmed)
  ...overrides,
})
```

## Best Practices

### Preserve Existing Config

Always spread existing config and add to arrays:

```ts
// ✅ Good
collections: [...(config.collections || []), newCollection]

// ❌ Bad
collections: [newCollection]
```

### Respect User Overrides

Allow users to override plugin defaults:

```ts
const collection: CollectionConfig = {
  slug: 'redirects',
  fields: defaultFields,
  ...options.overrides, // User overrides last
}
```

### Conditional Logic

Check if collections/globals are enabled:

```ts
collections: config.collections?.map((collection) => {
  const isEnabled = options.collections?.includes(collection.slug)
  if (isEnabled) {
    // Transform collection
  }
  return collection
})
```

### Hook Composition

Preserve existing hooks:

```ts
hooks: {
  ...collection.hooks,
  afterChange: [
    myHook,
    ...(collection.hooks?.afterChange || []),
  ],
}
```

### Type Safety

Use Payload's exported types:

```ts
import type { Config, Plugin, CollectionConfig, Field, CollectionSlug, GlobalSlug } from 'payload'
```

### Field Path Imports

Use absolute paths for client components:

```ts
admin: {
  components: {
    Field: '/fields/CustomField/Component#CustomFieldComponent',
  },
}
```

### onInit Pattern

Always call existing `onInit` before your initialization. See [onInit Hook](#oninit-hook) pattern for full example.

## Advanced Patterns

These patterns are extracted from official Payload plugins and represent production-ready techniques for complex plugin development.

### Advanced Configuration

#### Async Plugin Function

Allow plugin function to be async for awaiting collection overrides or async operations:

```ts
export const myPlugin =
  (pluginConfig?: PluginConfig) =>
  async (incomingConfig: Config): Promise<Config> => {
    // Can await async operations during initialization
// ... (7 lines trimmed)
    }
  }
```

#### Collection Override with Async Support

Allow users to override entire collections with async functions:

```ts
type CollectionOverride = (args: {
  defaultCollection: CollectionConfig
}) => CollectionConfig | Promise<CollectionConfig>

// ... (9 lines trimmed)
  ? await config.products.collectionOverride({ defaultCollection })
  : defaultCollection
```

#### Config Sanitization Pattern

Normalize plugin configuration with defaults:

```ts
export const sanitizePluginConfig = ({ pluginConfig }: Props): SanitizedPluginConfig => {
  const config = { ...pluginConfig } as Partial<SanitizedPluginConfig>

  // Normalize boolean|object configs
  if (typeof config.addresses === 'undefined' || config.addresses === true) {
// ... (17 lines trimmed)
    const sanitized = sanitizePluginConfig({ pluginConfig })
    // Use sanitized config throughout
  }
```

#### Collection Slug Mapping

Track collection slugs when users can override them:

```ts
type CollectionSlugMap = {
  products: string
  variants: string
  orders: string
}
// ... (13 lines trimmed)
  type: 'relationship',
  relationTo: collectionSlugMap.products,
}
```

#### Multi-Collection Configuration

Plugin operates on multiple collections with collection-specific config:

```ts
interface PluginConfig {
  sync: Array<{
    collection: string
    fields?: string[]
    onSync?: (doc: any) => Promise<void>
// ... (14 lines trimmed)
    },
  ]
}
```

### TypeScript Extensions

#### TypeScript Schema Extension

Add custom properties to generated TypeScript schema:

```ts
incomingConfig.typescript = incomingConfig.typescript || {}
incomingConfig.typescript.schema = incomingConfig.typescript.schema || []

incomingConfig.typescript.schema.push((args) => {
  const { jsonSchema } = args
// ... (13 lines trimmed)

  return jsonSchema
})
```

#### Module Declaration Augmentation

Extend Payload types for plugin-specific field properties:

```ts
// In plugin types file
declare module 'payload' {
  export interface FieldCustom {
    'plugin-import-export'?: {
      disabled?: boolean
// ... (14 lines trimmed)
    },
  },
}
```

### Advanced Hooks

#### Global Error Hooks

Add global error handling:

```ts
return {
  ...config,
  hooks: {
    afterError: [
      ...(config.hooks?.afterError ?? []),
// ... (14 lines trimmed)
    ],
  },
}
```

#### Multiple Hook Types on Same Collection

Coordinate multiple lifecycle hooks together for complex workflows (e.g., validation → sync → cache → cleanup):

```ts
collection.hooks = {
  ...collection.hooks,

  beforeValidate: [
    ...(collection.hooks?.beforeValidate || []),
// ... (30 lines trimmed)
    },
  ],
}
```

### Access Control & Filtering

#### Access Control Wrapper Pattern

Wrap existing access control with plugin-specific logic:

```ts
// From plugin-multi-tenant
export const multiTenantPlugin =
  (pluginOptions: PluginOptions) =>
  (config: Config): Config => ({
    ...config,
// ... (19 lines trimmed)
      }
    }),
  })
```

#### BaseFilter Composition

Combine plugin filters with existing baseListFilter:

```ts
// From plugin-multi-tenant
const existingBaseFilter = collection.admin?.baseListFilter
const tenantFilter = { tenant: { equals: req.user?.tenant } }

collection.admin = {
  ...collection.admin,
  baseListFilter: existingBaseFilter ? { and: [existingBaseFilter, tenantFilter] } : tenantFilter,
}
```

#### Relationship FilterOptions Modification

Add filters to relationship field options:

```ts
// From plugin-multi-tenant
collection.fields = collection.fields.map((field) => {
  if (field.type === 'relationship') {
    return {
// ... (8 lines trimmed)
  return field
})
```

### Admin UI Customization

#### Metadata Storage Pattern

Use admin.meta for plugin-specific UI state without database fields:

```ts
// From plugin-nested-docs
export const nestedDocsPlugin =
  (pluginOptions: PluginOptions) =>
  (config: Config): Config => ({
    ...config,
// ... (11 lines trimmed)
      },
    })),
  })
```

#### Conditional Component Rendering

Add components based on plugin configuration:

```ts
// From plugin-seo
const beforeFields = collection.admin?.components?.beforeFields || []

if (pluginOptions.uploadsCollection === collection.slug) {
// ... (8 lines trimmed)
  },
}
```

#### Custom Provider Pattern

Inject context providers for shared state:

```ts
// From plugin-nested-docs
collection.admin = {
  ...collection.admin,
  components: {
// ... (5 lines trimmed)
  },
}
```

#### Custom Actions

Add collection-level action buttons:

```ts
// From plugin-import-export
collection.admin = {
  ...collection.admin,
  components: {
// ... (6 lines trimmed)
  },
}
```

#### Custom List Item Views

Modify how items appear in collection lists:

```ts
// From plugin-ecommerce
collection.admin = {
  ...collection.admin,
  components: {
// ... (8 lines trimmed)
  },
}
```

#### Custom Collection Endpoints

Add collection-scoped endpoints (accessible at `/api/<collection-slug>/<path>`):

```ts
// From plugin-import-export
collection.endpoints = [
  ...(collection.endpoints || []),
  {
    path: '/import',
// ... (12 lines trimmed)
    },
  },
]
```

### Field & Collection Modifications

#### Admin Folders Override

Control admin UI organization:

```ts
// From plugin-redirects
collection.admin = {
  ...collection.admin,
  group: pluginOptions.group || 'Settings',
  hidden: pluginOptions.hidden,
  defaultColumns: pluginOptions.defaultColumns || ['from', 'to', 'updatedAt'],
}
```

### Background Jobs & Async Operations

#### Jobs Registration

Register plugin background tasks:

```ts
// From plugin-stripe
export const stripePlugin =
  (pluginOptions: PluginOptions) =>
  (config: Config): Config => ({
    ...config,
// ... (12 lines trimmed)
      ],
    },
  })
```

## Testing Plugins

### Local Development with dev/ Directory (optional)

Include a `dev/` directory with a complete Payload project for local development:

1. Create `dev/.env` from `.env.example`:

```bash
DATABASE_URL=mongodb://127.0.0.1/plugin-dev
PAYLOAD_SECRET=your-secret-here
```

2. Configure `dev/payload.config.ts`:

```ts
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { myPlugin } from '../src/index.js'

export default buildConfig({
// ... (11 lines trimmed)
    },
  ],
})
```

3. Run development server:

```bash
npm run dev  # Starts Next.js on http://localhost:3000
```

### Integration Tests (Vitest) (optional)

Create `dev/int.spec.ts`:

```ts
import type { Payload } from 'payload'
import config from '@payload-config'
import { createPayloadRequest, getPayload } from 'payload'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { customEndpointHandler } from '../src/endpoints/handler.js'
// ... (34 lines trimmed)
    expect(data).toMatchObject({ message: 'Hello' })
  })
})
```

Run: `npm run test:int`

### End-to-End Tests (Playwright)

Create `dev/e2e.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('Plugin e2e tests', () => {
  test('should render custom admin component', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await expect(page.getByText('Added by the plugin')).toBeVisible()
  })
})
```

Run: `npm run test:e2e`

## Common Plugin Types

### Field Enhancer

Adds fields to existing collections (SEO, timestamps, audit logs)

### Collection Provider

Adds new collections (redirects, forms, logs)

### Hook Injector

Adds hooks to collections (nested docs, cache invalidation)

### UI Enhancer

Adds custom components (dashboards, field types)

### Integration

Connects external services (Stripe, Sentry, storage adapters)

### Adapter

Provides infrastructure (database, storage, email)

## Resources

- [Plugin Examples](https://github.com/payloadcms/payload/tree/main/packages/) - Official plugins source code, payload-\* prefix
- [Plugin Template](https://github.com/payloadcms/payload/tree/main/templates/plugin) - Starter template for new plugins
