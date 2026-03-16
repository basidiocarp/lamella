# Form and Layout Patterns

Form components with validation and responsive grid system patterns.

## Pattern 3: Form Components

```typescript
// components/ui/input.tsx
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
// ... (84 lines trimmed)
    </form>
  )
}
```

## Pattern 4: Responsive Grid System

```typescript
// components/ui/grid.tsx
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const gridVariants = cva('grid', {
// ... (65 lines trimmed)
    ))}
  </Grid>
</Container>
```
