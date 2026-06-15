# Next.js App Router Code Patterns

## Pattern 1: Server Components with Data Fetching

```typescript
// app/products/page.tsx
import { Suspense } from "react";
import { FilterSidebar } from "@/components/filters";
import { ProductList, ProductListSkeleton } from "@/components/products";
import { getProducts } from "@/lib/data";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <FilterSidebar category={category} />
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductsContent category={category} />
      </Suspense>
    </div>
  );
}

async function ProductsContent({ category }: { category?: string }) {
  const products = await getProducts({ category });
  return <ProductList products={products} />;
}
```

## Pattern 2: Client Components with `"use client"`

```typescript
// components/products/AddToCartButton.tsx
"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/app/actions/cart";

export function AddToCartButton({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-3">
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
      />
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await addToCart({ productId, quantity });
          })
        }
      >
        {isPending ? "Adding..." : "Add to cart"}
      </button>
    </div>
  );
}
```

## Pattern 3: Server Actions

```typescript
// app/actions/cart.ts
"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function addToCart(input: {
  productId: string;
  quantity: number;
}) {
  // Persist mutation in your data layer here.
  await saveCartLine(input);

  revalidateTag("cart");
}

export async function submitOrder(orderId: string) {
  await finalizeOrder(orderId);
  redirect(`/orders/${orderId}/confirmation`);
}
```

## Pattern 4: Parallel Routes

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section>{children}</section>
      <aside className="space-y-6">
        {analytics}
        {team}
      </aside>
    </div>
  );
}
```

## Pattern 5: Intercepting Routes for Modals

```typescript
// app/@modal/(.)photos/[id]/page.tsx
import { PhotoModal } from "@/components/photo-modal";
import { getPhoto } from "@/lib/data";

export default async function PhotoModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await getPhoto(id);
  return <PhotoModal photo={photo} />;
}
```

## Pattern 6: Streaming with Suspense

```typescript
// app/product/[id]/page.tsx
import { Suspense } from "react";
import { ProductSummary, ProductSummarySkeleton } from "@/components/products";
import { Recommendations } from "@/components/recommendations";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Suspense fallback={<ProductSummarySkeleton />}>
        <ProductSummary id={id} />
      </Suspense>
      <Suspense fallback={<p>Loading recommendations...</p>}>
        <Recommendations productId={id} />
      </Suspense>
    </>
  );
}
```

## Pattern 7: Route Handlers

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const products = await listProducts({ category: category ?? undefined });
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = await createProduct(body);
  return NextResponse.json(product, { status: 201 });
}
```

## Pattern 8: Metadata and SEO

```typescript
// app/products/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: product.name,
      description: product.summary,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <article>{product.name}</article>;
}
```
