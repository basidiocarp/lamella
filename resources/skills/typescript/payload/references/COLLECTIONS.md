# Payload CMS Collections Reference

Complete reference for collection configurations and patterns.

## Basic Collection

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
// ... (31 lines trimmed)
  defaultSort: '-createdAt',
  timestamps: true,
}
```

## Auth Collection

```ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: true,
// ... (21 lines trimmed)
    },
  ],
}
```

## Upload Collection

```ts
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
// ... (30 lines trimmed)
    },
  ],
}
```

## Live Preview

Enable real-time content preview during editing.

```ts
import type { CollectionConfig } from 'payload'

const generatePreviewPath = ({
  slug,
  collection,
// ... (33 lines trimmed)
    { name: 'slug', type: 'text' },
  ],
}
```

## Versioning & Drafts

Payload maintains version history and supports draft/publish workflows.

```ts
import type { CollectionConfig } from 'payload'

// Basic versioning (audit log only)
export const Users: CollectionConfig = {
  slug: 'users',
// ... (24 lines trimmed)
  },
  fields: [{ name: 'title', type: 'text' }],
}
```

### Draft API Usage

```ts
// Create draft
await payload.create({
  collection: 'posts',
  data: { title: 'Draft Post' },
  draft: true, // Saves as draft, skips required field validation
// ... (31 lines trimmed)
  },
  fields: [{ name: 'title', type: 'text' }],
}
```

### Document Status

The `_status` field is auto-injected when drafts are enabled:

- `draft` - Never published
- `published` - Published with no newer drafts
- `changed` - Published but has newer unpublished drafts

## Globals

Globals are single-instance documents (not collections).

```ts
import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
// ... (25 lines trimmed)
    },
  ],
}
```
