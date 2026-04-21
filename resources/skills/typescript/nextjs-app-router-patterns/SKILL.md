---
name: nextjs-app-router-patterns
description: "Applies Next.js App Router architecture, caching strategies, and component patterns."
origin: lamella
---

# Next.js App Router Patterns

## Contents

- [Core Concepts](#core-concepts)
- [File Conventions](#file-conventions)
- [Component Patterns](#component-patterns)
- [Data Fetching](#data-fetching)
- [Caching Quick Reference](#caching-quick-reference)
- [References](#references)

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Server Components** | Default. Run on server, no client JS. Use for data fetching. |
| **Client Components** | `'use client'` directive. For interactivity, hooks, browser APIs. |
| **Layouts** | Shared UI that preserves state across navigation |
| **Route Groups** | `(folder)` - organize without affecting URL |
| **Parallel Routes** | `@folder` - render multiple pages simultaneously |
| **Intercepting Routes** | `(.)folder` - modal patterns |

## File Conventions

```
app/
├── layout.tsx        # Root layout (required)
├── page.tsx          # Home route "/"
├── loading.tsx       # Suspense boundary
├── error.tsx         # Error boundary
├── not-found.tsx     # 404 page
├── (marketing)/      # Route group
│   └── about/page.tsx
├── dashboard/
│   ├── layout.tsx    # Nested layout
│   ├── page.tsx
│   └── @modal/       # Parallel route slot
│       └── (.)settings/page.tsx  # Intercepted route
└── api/
    └── route.ts      # API route
```

## Component Patterns

**Server Component (default)**:
```tsx
// No directive needed
async function Page() {
  const data = await fetchData(); // Direct async
  return <div>{data.title}</div>;
}
```

**Client Component**:
```tsx
'use client';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Composition Pattern**:
```tsx
// Server Component with Client children
import { ClientButton } from './ClientButton';

async function Page() {
  const data = await fetchData();
  return (
    <div>
      <h1>{data.title}</h1>
      <ClientButton /> {/* Interactive island */}
    </div>
  );
}
```

## Data Fetching

```tsx
// app/posts/page.tsx - Server Component
async function PostsPage() {
  // Fetch runs on server, result is cached
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Revalidate every hour
  }).then(r => r.json());

  return <PostList posts={posts} />;
}
```

## Caching Quick Reference

| Method | Cache | Revalidate |
|--------|-------|------------|
| `fetch()` | Cached by default | `next: { revalidate: n }` |
| `unstable_cache()` | Function results | Time or tag-based |
| `revalidatePath()` | N/A | On-demand |
| `revalidateTag()` | N/A | On-demand by tag |

**No cache**: `fetch(url, { cache: 'no-store' })`

**Time-based**: `fetch(url, { next: { revalidate: 60 } })`

**Tag-based**:
```tsx
// Fetch with tag
fetch(url, { next: { tags: ['posts'] } });

// Revalidate by tag
revalidateTag('posts');
```

## References

- [references/patterns.md](references/patterns.md) - Advanced patterns and examples
- [references/caching.md](references/caching.md) - Detailed caching strategies
