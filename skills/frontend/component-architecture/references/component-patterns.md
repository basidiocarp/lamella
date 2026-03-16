# Component Patterns Reference

## Compound Components Deep Dive

Compound components share implicit state while allowing flexible composition.

### Implementation with Context

```tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
// ... (116 lines trimmed)
    </div>
  );
};
```

### Usage

```tsx
<Tabs defaultValue="overview" onChange={console.log}>
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="features">Features</Tabs.Tab>
    <Tabs.Tab value="pricing" disabled>
// ... (9 lines trimmed)
    <ul>...</ul>
  </Tabs.Panel>
</Tabs>
```

## Render Props Pattern

Delegate rendering control to the consumer while providing state and helpers.

```tsx
interface DataLoaderRenderProps<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
// ... (42 lines trimmed)
    return <UserList users={data!} />;
  }}
</DataLoader>;
```

## Polymorphic Components

Components that can render as different HTML elements.

```tsx
type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);
// ... (48 lines trimmed)
<Text as="p" variant="body" size="lg">Paragraph</Text>
<Text as="h1" variant="heading" size="lg">Heading</Text>
<Text as="label" variant="label" htmlFor="input">Label</Text>
```

## Controlled vs Uncontrolled Pattern

Support both modes for maximum flexibility.

```tsx
interface InputProps {
  // Controlled
  value?: string;
  onChange?: (value: string) => void;
  // Uncontrolled
// ... (41 lines trimmed)

// Uncontrolled usage
<Input defaultValue="initial" onChange={console.log} />
```

## Slot Pattern

Allow consumers to replace internal parts.

```tsx
interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
// ... (24 lines trimmed)
>
  <p>Card content goes here.</p>
</Card>;
```

## Forward Ref Pattern

Allow parent components to access the underlying DOM node.

```tsx
import { forwardRef, useRef, useImperativeHandle } from "react";

interface InputHandle {
  focus: () => void;
  clear: () => void;
// ... (51 lines trimmed)
    </form>
  );
}
```
