# Payload Custom API Endpoints Reference

Custom REST API endpoints extend Payload's auto-generated CRUD operations with custom logic, authentication flows, webhooks, and integrations.

## Quick Reference

### Endpoint Configuration

| Property  | Type                                              | Description                                                     |
| --------- | ------------------------------------------------- | --------------------------------------------------------------- |
| `path`    | `string`                                          | Route path after collection/global slug (e.g., `/:id/tracking`) |
| `method`  | `'get' \| 'post' \| 'put' \| 'patch' \| 'delete'` | HTTP method (lowercase)                                         |
| `handler` | `(req: PayloadRequest) => Promise<Response>`      | Async function returning Web API Response                       |
| `custom`  | `Record<string, any>`                             | Extension point for plugins/metadata                            |

### Request Context

| Property          | Type                    | Description                                            |
| ----------------- | ----------------------- | ------------------------------------------------------ |
| `req.user`        | `User \| null`          | Authenticated user (null if not authenticated)         |
| `req.payload`     | `Payload`               | Payload instance for operations (find, create...)      |
| `req.routeParams` | `Record<string, any>`   | Path parameters (e.g., `:id`)                          |
| `req.url`         | `string`                | Full request URL                                       |
| `req.method`      | `string`                | HTTP method                                            |
| `req.headers`     | `Headers`               | Request headers                                        |
| `req.json()`      | `() => Promise<any>`    | Parse JSON body                                        |
| `req.text()`      | `() => Promise<string>` | Read body as text                                      |
| `req.data`        | `any`                   | Parsed body (after `addDataAndFileToRequest()`)        |
| `req.file`        | `File`                  | Uploaded file (after `addDataAndFileToRequest()`)      |
| `req.locale`      | `string`                | Request locale (after `addLocalesToRequestFromData()`) |
| `req.i18n`        | `I18n`                  | i18n instance                                          |
| `req.t`           | `TFunction`             | Translation function                                   |

## Common Patterns

### Authentication Check

Custom endpoints are **not authenticated by default**. Check `req.user` to enforce authentication.

```ts
import { APIError } from 'payload'

export const authenticatedEndpoint = {
  path: '/protected',
// ... (8 lines trimmed)
  },
}
```

### Using Payload Operations

Use `req.payload` for database operations with access control and hooks.

```ts
export const getRelatedPosts = {
  path: '/:id/related',
  method: 'get',
  handler: async (req) => {
    const { id } = req.routeParams
// ... (13 lines trimmed)
    return Response.json(posts)
  },
}
```

### Route Parameters

Access path parameters via `req.routeParams`.

```ts
export const getTrackingEndpoint = {
  path: '/:id/tracking',
  method: 'get',
  handler: async (req) => {
// ... (9 lines trimmed)
  },
}
```

### Request Body Handling

**Option 1: Manual JSON parsing**

```ts
export const createEndpoint = {
  path: '/create',
  method: 'post',
  handler: async (req) => {
// ... (8 lines trimmed)
  },
}
```

**Option 2: Using helper (handles JSON + files)**

```ts
import { addDataAndFileToRequest } from 'payload'

export const uploadEndpoint = {
  path: '/upload',
  method: 'post',
// ... (12 lines trimmed)
    return Response.json(result)
  },
}
```

### CORS Headers

Use `headersWithCors` helper to apply config CORS settings.

```ts
import { headersWithCors } from 'payload'

export const corsEndpoint = {
  path: '/public-data',
  method: 'get',
// ... (8 lines trimmed)
    })
  },
}
```

### Error Handling

Throw `APIError` with status codes for proper error responses.

```ts
import { APIError } from 'payload'

export const validateEndpoint = {
  path: '/validate',
  method: 'post',
// ... (8 lines trimmed)
    return Response.json({ valid: true })
  },
}
```

### Query Parameters

Extract query params from URL.

```ts
export const searchEndpoint = {
  path: '/search',
  method: 'get',
  handler: async (req) => {
    const url = new URL(req.url)
// ... (13 lines trimmed)
    return Response.json(results)
  },
}
```

## Helper Functions

### addDataAndFileToRequest

Parses request body and attaches to `req.data` and `req.file`.

```ts
import { addDataAndFileToRequest } from 'payload'

export const endpoint = {
  path: '/process',
// ... (9 lines trimmed)
  },
}
```

**Handles:**

- JSON bodies (`Content-Type: application/json`)
- Form data (`Content-Type: multipart/form-data`)
- File uploads

### addLocalesToRequestFromData

Extracts locale from request data and validates against config.

```ts
import { addLocalesToRequestFromData } from 'payload'

export const endpoint = {
  path: '/translate',
  method: 'post',
// ... (11 lines trimmed)
    return Response.json(result)
  },
}
```

### headersWithCors

Applies CORS headers from Payload config.

```ts
import { headersWithCors } from 'payload'

export const endpoint = {
  path: '/data',
  method: 'get',
// ... (10 lines trimmed)
    })
  },
}
```

## Real-World Examples

### Multi-Tenant Login Endpoint

From `examples/multi-tenant`:

```ts
import { APIError, generatePayloadCookie, headersWithCors } from 'payload'

export const externalUsersLogin = {
  path: '/login-external',
  method: 'post',
// ... (42 lines trimmed)
    })
  },
}
```

### Webhook Handler (Stripe)

From `packages/plugin-ecommerce`:

```ts
export const webhookEndpoint = {
  path: '/webhooks',
  method: 'post',
  handler: async (req) => {
    const body = await req.text()
// ... (19 lines trimmed)
    }
  },
}
```

### Data Preview Endpoint

From `packages/plugin-import-export`:

```ts
import { addDataAndFileToRequest } from 'payload'

export const previewEndpoint = {
  path: '/preview',
  method: 'post',
// ... (27 lines trimmed)
    })
  },
}
```

### Reindex Action Endpoint

From `packages/plugin-search`:

```ts
export const reindexEndpoint = (pluginConfig) => ({
  path: '/reindex',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
// ... (11 lines trimmed)
    })
  },
})
```

## Endpoint Placement

### Collection Endpoints

Mounted at `/api/{collection-slug}/{path}`.

```ts
import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
// ... (11 lines trimmed)
    },
  ],
}
```

### Global Endpoints

Mounted at `/api/globals/{global-slug}/{path}`.

```ts
import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  fields: [
// ... (11 lines trimmed)
    },
  ],
}
```

## Advanced Patterns

### Factory Functions

Create reusable endpoint factories for plugins.

```ts
export const createWebhookEndpoint = (config) => ({
  path: '/webhook',
  method: 'post',
  handler: async (req) => {
    const signature = req.headers.get('x-webhook-signature')
// ... (8 lines trimmed)
    return Response.json({ received: true })
  },
})
```

### Conditional Endpoints

Add endpoints based on config options.

```ts
export const MyCollection: CollectionConfig = {
  slug: 'posts',
  fields: [
    /* ... */
  ],
// ... (16 lines trimmed)
      : []),
  ],
}
```

### OpenAPI Documentation

Use `custom` property for API documentation metadata.

```ts
export const endpoint = {
  path: '/search',
  method: 'get',
  handler: async (req) => {
    // Handler implementation
// ... (22 lines trimmed)
    },
  },
}
```

## Best Practices

1. **Always check authentication** - Custom endpoints are not authenticated by default
2. **Use `req.payload` for operations** - Ensures access control and hooks execute
3. **Use helpers for common tasks** - `addDataAndFileToRequest`, `headersWithCors`, etc.
4. **Throw `APIError` for errors** - Provides consistent error responses
5. **Return Web API `Response`** - Use `Response.json()` for consistent responses
6. **Validate input** - Check required fields, validate types
7. **Handle CORS** - Use `headersWithCors` for cross-origin requests
8. **Log errors** - Use `req.payload.logger` for debugging
9. **Document with `custom`** - Add OpenAPI metadata for API docs
10. **Factory pattern for reuse** - Create endpoint factories for plugins

## Resources

- REST API Overview: <https://payloadcms.com/docs/rest-api/overview>
- Custom Endpoints: <https://payloadcms.com/docs/rest-api/overview#custom-endpoints>
- Access Control: <https://payloadcms.com/docs/access-control/overview>
- Local API: <https://payloadcms.com/docs/local-api/overview>
