# CVA and Compound Components

Patterns for building type-safe, variant-based components with Class Variance Authority (CVA).

## Pattern 1: CVA (Class Variance Authority) Components

```typescript
// components/ui/button.tsx
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ... (53 lines trimmed)
<Button variant="destructive" size="lg">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button asChild><Link href="/home">Home</Link></Button>
```

## Pattern 2: Compound Components (React 19)

```typescript
// components/ui/card.tsx
import { cn } from '@/lib/utils'

// React 19: ref is a regular prop, no forwardRef
export function Card({
// ... (92 lines trimmed)
    <Button>Save</Button>
  </CardFooter>
</Card>
```

## Utility Functions

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
// ... (8 lines trimmed)

// Disabled utility
export const disabled = "disabled:pointer-events-none disabled:opacity-50";
```
