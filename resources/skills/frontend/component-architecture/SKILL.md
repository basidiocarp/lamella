---
name: component-architecture
description: "React, Vue, and Svelte component patterns: CSS-in-JS, composition, reusable architecture. Use when building UI component libraries, designing component APIs, or implementing frontend component architecture."
---

# Component Architecture


## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Concepts](#core-concepts)
  - [1. Component Composition Patterns](#1-component-composition-patterns)
  - [2. CSS-in-JS Approaches](#2-css-in-js-approaches)
  - [3. Component API Design](#3-component-api-design)
- [Quick Start: React Component with Tailwind](#quick-start-react-component-with-tailwind)
- [Framework Patterns](#framework-patterns)
  - [React: Compound Components](#react-compound-components)
  - [Vue 3: Composables](#vue-3-composables)
  - [Svelte 5: Runes](#svelte-5-runes)
- [Best Practices](#best-practices)
- [Common Issues](#common-issues)
- [Resources](#resources)


Build reusable, maintainable UI components using modern frameworks with clean composition patterns and styling approaches.

## When to Use This Skill

- Designing reusable component libraries or design systems
- Implementing complex component composition patterns
- Choosing and applying CSS-in-JS solutions
- Building accessible, responsive UI components
- Creating consistent component APIs across a codebase
- Refactoring legacy components into modern patterns
- Implementing compound components or render props

## Core Concepts

### 1. Component Composition Patterns

**Compound Components**: Related components that work together

```tsx
// Usage
<Select value={value} onChange={setValue}>
  <Select.Trigger>Choose option</Select.Trigger>
  <Select.Options>
    <Select.Option value="a">Option A</Select.Option>
    <Select.Option value="b">Option B</Select.Option>
  </Select.Options>
</Select>
```

**Render Props**: Delegate rendering to parent

```tsx
<DataFetcher url="/api/users">
  {({ data, loading, error }) =>
    loading ? <Spinner /> : <UserList users={data} />
  }
</DataFetcher>
```

**Slots (Vue/Svelte)**: Named content injection points

```vue
<template>
  <Card>
    <template #header>Title</template>
    <template #content>Body text</template>
    <template #footer><Button>Action</Button></template>
  </Card>
</template>
```

### 2. CSS-in-JS Approaches

| Solution              | Approach               | Best For                          |
| --------------------- | ---------------------- | --------------------------------- |
| **Tailwind CSS**      | Utility classes        | Rapid prototyping, design systems |
| **CSS Modules**       | Scoped CSS files       | Existing CSS, gradual adoption    |
| **styled-components** | Template literals      | React, dynamic styling            |
| **Emotion**           | Object/template styles | Flexible, SSR-friendly            |
| **Vanilla Extract**   | Zero-runtime           | Performance-critical apps         |

### 3. Component API Design

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Principles**:

- Use semantic prop names (`isLoading` vs `loading`)
- Provide sensible defaults
- Support composition via `children`
- Allow style overrides via `className` or `style`

## Quick Start: React Component with Tailwind

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
// ... (39 lines trimmed)
  ),
);
Button.displayName = "Button";
```

## Framework Patterns

### React: Compound Components

```tsx
import { createContext, useContext, useState, type ReactNode } from "react";

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (id: string) => void;
// ... (46 lines trimmed)
    </div>
  );
};
```

### Vue 3: Composables

```vue
<script setup lang="ts">
import { ref, computed, provide, inject, type InjectionKey } from "vue";

interface TabsContext {
  activeTab: Ref<string>;
// ... (15 lines trimmed)
const tabs = inject(TabsKey);
const isActive = computed(() => tabs?.activeTab.value === props.id);
</script>
```

### Svelte 5: Runes

```svelte
<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    onclick?: () => void;
// ... (10 lines trimmed)
<button class={classes} {onclick}>
  {@render children()}
</button>
```

## Best Practices

1. **Single Responsibility**: Each component does one thing well
2. **Prop Drilling Prevention**: Use context for deeply nested data
3. **Accessible by Default**: Include ARIA attributes, keyboard support
4. **Controlled vs Uncontrolled**: Support both patterns when appropriate
5. **Forward Refs**: Allow parent access to DOM nodes
6. **Memoization**: Use `React.memo`, `useMemo` for expensive renders
7. **Error Boundaries**: Wrap components that may fail

## Common Issues

- **Prop Explosion**: Too many props - consider composition instead
- **Style Conflicts**: Use scoped styles or CSS Modules
- **Re-render Cascades**: Profile with React DevTools, memo appropriately
- **Accessibility Gaps**: Test with screen readers and keyboard navigation
- **Bundle Size**: Tree-shake unused component variants

## Resources

- [React Component Patterns](https://reactpatterns.com/)
- [Vue Composition API Guide](https://vuejs.org/guide/reusability/composables.html)
- [Svelte Component Documentation](https://svelte.dev/docs/svelte-components)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [shadcn/ui Components](https://ui.shadcn.com/)
### Additional Resources

- [Accessibility Patterns](references/accessibility-patterns.md)
- [Component Patterns](references/component-patterns.md)
- [Css Styling Approaches](references/css-styling-approaches.md)
