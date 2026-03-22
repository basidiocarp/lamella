# Payload CMS Hooks Reference

Complete reference for collection hooks, field hooks, and hook context patterns.

## Collection Hooks

```ts
export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    // Before validation
    beforeValidate: [
// ... (41 lines trimmed)
    ],
  },
}
```

## Field Hooks

```ts
import type { EmailField, FieldHook } from 'payload'

const beforeValidateHook: FieldHook = ({ value }) => {
  return value.trim().toLowerCase()
}
// ... (14 lines trimmed)
    afterRead: [afterReadHook],
  },
}
```

## Hook Context

Share data between hooks or control hook behavior using request context:

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
// ... (11 lines trimmed)
  },
  fields: [{ name: 'title', type: 'text' }],
}
```

## Next.js Revalidation with Context Control

```ts
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'
import type { Page } from '../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
// ... (25 lines trimmed)
  }
  return doc
}
```

## Date Field Auto-Set

Automatically set date when document is published:

```ts
import type { DateField } from 'payload'

const publishedOnField: DateField = {
  name: 'publishedOn',
  type: 'date',
// ... (14 lines trimmed)
    ],
  },
}
```

## Hook Patterns Best Practices

- Use `beforeValidate` for data formatting
- Use `beforeChange` for business logic
- Use `afterChange` for side effects
- Use `afterRead` for computed fields
- Store expensive operations in `context`
- Pass `req` to nested operations for transaction safety (see [ADAPTERS.md#threading-req-through-operations](ADAPTERS.md#threading-req-through-operations))
