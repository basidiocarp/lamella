# Component Patterns

## Composition Over Inheritance

```typescript
// ✅ GOOD: Component composition
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined'
}
// ... (15 lines trimmed)
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

## Compound Components

```typescript
interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

// ... (37 lines trimmed)
    <Tab id="details">Details</Tab>
  </TabList>
</Tabs>
```

## Render Props Pattern

```typescript
interface DataLoaderProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

// ... (21 lines trimmed)
    return <MarketList markets={markets!} />
  }}
</DataLoader>
```

## Error Boundary Pattern

```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// ... (35 lines trimmed)
<ErrorBoundary>
  <App />
</ErrorBoundary>
```
