# CVA and Compound Components

Patterns for building type-safe, variant-based components with Class Variance Authority.

Use CVA when a component has a stable set of visual variants. Use plain `cn()`
when the styling is mostly ad hoc and the variant matrix is small.

## Pattern 1: CVA Button

```typescript
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-800',
        destructive: 'bg-red-600 text-white hover:bg-red-500',
        outline: 'border border-slate-300 bg-white hover:bg-slate-50',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({ asChild, className, size, variant, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ size, variant }), className)} {...props} />
}

<Button variant="destructive" size="lg">Delete</Button>
<Button variant="outline">Cancel</Button>
```

## Pattern 2: Compound Card

```typescript
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border bg-white shadow-sm', className)} {...props} />
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="border-b px-6 py-4">{children}</div>
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="px-6 py-4">{children}</div>
}

export function CardFooter({ children }: { children: ReactNode }) {
  return <div className="flex justify-end gap-2 border-t px-6 py-4">{children}</div>
}

<Card>
  <CardHeader>
    <CardTitle>Edit profile</CardTitle>
  </CardHeader>
  <CardContent>Form fields go here.</CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

## Utility Function

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
