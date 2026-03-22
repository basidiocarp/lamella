# Next.js App Router - Caching Strategies

## Data Cache

```typescript
// No cache (always fresh)
fetch(url, { cache: "no-store" });

// Cache forever (static)
fetch(url, { cache: "force-cache" });
// ... (13 lines trimmed)
  revalidateTag("products");
  revalidatePath("/products");
}
```

## Request Memoization

```typescript
// Same request is automatically deduped within a single render
async function getUser(id: string) {
  // This fetch is automatically memoized
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// Multiple components calling getUser(123) will only make 1 request
```

## Full Route Cache

```typescript
// Static by default (cached at build time)
export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}
// ... (8 lines trimmed)
  const cookieStore = await cookies(); // Makes route dynamic
  // ...
}
```

## Router Cache (Client-side)

```typescript
// Prefetch links (default behavior)
import Link from "next/link";

<Link href="/products">Products</Link>; // Prefetched on hover

// Disable prefetch
<Link href="/products" prefetch={false}>
  Products
</Link>;

// Programmatic navigation with refresh
import { useRouter } from "next/navigation";

const router = useRouter();
router.refresh(); // Invalidate router cache
```

## Cache Best Practices

| Scenario | Strategy |
|----------|----------|
| Static content | `force-cache` (default) |
| User-specific data | `no-store` |
| Frequently updated | Short revalidate (e.g., 60s) |
| On-demand updates | Tag-based invalidation |
| Real-time data | `no-store` + client polling |
