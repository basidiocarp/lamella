# Next.js App Router - Code Patterns

## Pattern 1: Server Components with Data Fetching

```typescript
// app/products/page.tsx
import { Suspense } from 'react'
import { ProductList, ProductListSkeleton } from '@/components/products'
import { FilterSidebar } from '@/components/filters'

// ... (51 lines trimmed)
    </div>
  )
}
```

## Pattern 2: Client Components with 'use client'

```typescript
// components/products/AddToCartButton.tsx
'use client'

import { useState, useTransition } from 'react'
import { addToCart } from '@/app/actions/cart'
// ... (25 lines trimmed)
    </div>
  )
}
```

## Pattern 3: Server Actions

```typescript
// app/actions/cart.ts
"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
// ... (36 lines trimmed)
  // Redirect to confirmation
  redirect(`/orders/${order.id}/confirmation`);
}
```

## Pattern 4: Parallel Routes

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
// ... (27 lines trimmed)
  const members = await getTeamMembers()
  return <TeamList members={members} />
}
```

## Pattern 5: Intercepting Routes (Modal Pattern)

```typescript
// File structure for photo modal
// app/
// ├── @modal/
// │   ├── (.)photos/[id]/page.tsx  # Intercept
// │   └── default.tsx
// ... (54 lines trimmed)
    </html>
  )
}
```

## Pattern 6: Streaming with Suspense

```typescript
// app/product/[id]/page.tsx
import { Suspense } from 'react'

export default async function ProductPage({
  params,
// ... (33 lines trimmed)
  const products = await getRecommendations(productId) // ML-based, slow
  return <ProductCarousel products={products} />
}
```

## Pattern 7: Route Handlers (API Routes)

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
// ... (31 lines trimmed)

  return NextResponse.json(product);
}
```

## Pattern 8: Metadata and SEO

```typescript
// app/products/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
// ... (36 lines trimmed)

  return <ProductDetail product={product} />
}
```
