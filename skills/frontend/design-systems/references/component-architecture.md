# Component Architecture Patterns

## Overview

Well-architected components are reusable, composable, and maintainable. This guide covers patterns for building flexible component APIs that scale across design systems.

## Compound Components

Compound components share implicit state through React context, allowing flexible composition.

```tsx
// Compound component pattern
import * as React from "react";

interface AccordionContextValue {
  openItems: Set<string>;
// ... (125 lines trimmed)
    </AccordionCompound>
  );
}
```

## Polymorphic Components

Polymorphic components can render as different HTML elements or other components.

```tsx
// Polymorphic component with proper TypeScript support
import * as React from "react";

type AsProp<C extends React.ElementType> = {
  as?: C;
// ... (90 lines trimmed)
    </>
  );
}
```

## Slot Pattern

Slots allow users to replace default elements with custom implementations.

```tsx
// Slot pattern for customizable components
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
// ... (28 lines trimmed)
    </Button>
  );
}
```

## Headless Components

Headless components provide behavior without styling, enabling complete visual customization.

```tsx
// Headless toggle hook
import * as React from "react";

interface UseToggleProps {
  defaultPressed?: boolean;
// ... (105 lines trimmed)
    }),
  };
}
```

## Variant System with CVA

Class Variance Authority (CVA) provides type-safe variant management.

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define variants
const badgeVariants = cva(
// ... (45 lines trimmed)
<Badge variant="success" size="lg">Active</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

## Responsive Variants

```tsx
import { cva } from "class-variance-authority";

// Responsive variant configuration
const containerVariants = cva("mx-auto w-full px-4", {
  variants: {
// ... (47 lines trimmed)
    .filter(Boolean)
    .join(" ");
}
```

## Composition Patterns

### Render Props

```tsx
interface DataListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  keyExtractor: (item: T) => string;
// ... (25 lines trimmed)
  renderItem={(user) => <UserCard user={user} />}
  renderEmpty={() => <EmptyState message="No users found" />}
/>;
```

### Children as Function

```tsx
interface DisclosureProps {
  children: (props: { isOpen: boolean; toggle: () => void }) => React.ReactNode;
  defaultOpen?: boolean;
}

// ... (13 lines trimmed)
    </>
  )}
</Disclosure>;
```

## Best Practices

1. **Prefer Composition**: Build complex components from simple primitives
2. **Use Controlled/Uncontrolled Pattern**: Support both modes for flexibility
3. **Forward Refs**: Always forward refs to root elements
4. **Spread Props**: Allow custom props to pass through
5. **Provide Defaults**: Set sensible defaults for optional props
6. **Type Everything**: Use TypeScript for prop validation
7. **Document Variants**: Show all variant combinations in Storybook
8. **Test Accessibility**: Verify keyboard navigation and screen reader support

## Resources

- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Headless UI](https://headlessui.com/)
- [Class Variance Authority](https://cva.style/docs)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)
