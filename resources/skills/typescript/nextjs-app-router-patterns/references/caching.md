# Next.js App Router - Caching Strategies

## Data Cache

```typescript
// No cache (always fresh)
fetch(url, { cache: "no-store" });

// Cache forever (static)
fetch(url, { cache: "force-cache" });

// Revalidate after 60 seconds
fetch(url, { next: { revalidate: 60 } });

// Cache tagged data for targeted invalidation
fetch(url, { next: { tags: ["products"] } });

// Server Action invalidation
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateProduct() {
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

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Or opt into runtime signals that make the route dynamic
export default async function DynamicPage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme");
  return <div>{theme?.value}</div>;
}
```

## Router Cache (Client-side)

```typescript
// Prefetch links (default behavior)
import Link from "next/link";

<Link href="/products">Products</Link>;

// Disable prefetch
<Link href="/products" prefetch={false}>
  Products
</Link>;

// Programmatic navigation with refresh
import { useRouter } from "next/navigation";

const router = useRouter();
router.refresh();
```

## Cache Best Practices

| Scenario | Strategy |
|----------|----------|
| Static content | `force-cache` (default) |
| User-specific data | `no-store` |
| Frequently updated | Short revalidate window |
| On-demand updates | Tag-based invalidation |
| Real-time data | `no-store` plus client polling |
