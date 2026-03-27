# Form and Layout Patterns

Form components with validation and responsive grid patterns.

## Pattern 1: Input Component

```typescript
import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <input
        aria-invalid={Boolean(error)}
        className={cn(
          'h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-900',
          error && 'border-red-500 focus:border-red-600',
          className
        )}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
```

## Pattern 2: Responsive Form Grid

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const gridVariants = cva('grid gap-4', {
  variants: {
    columns: {
      one: 'grid-cols-1',
      two: 'grid-cols-1 md:grid-cols-2',
      three: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    },
  },
  defaultVariants: {
    columns: 'two',
  },
})

type GridProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof gridVariants>

export function FormGrid({ children, className, columns }: GridProps) {
  return <div className={cn(gridVariants({ columns }), className)}>{children}</div>
}

<FormGrid columns="two">
  <Input placeholder="First name" />
  <Input placeholder="Last name" />
  <Input className="md:col-span-2" placeholder="Email" type="email" />
</FormGrid>
```
