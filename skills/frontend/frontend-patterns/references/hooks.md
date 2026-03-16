# Custom Hooks Patterns

## State Management Hook

```typescript
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}

// Usage
const [isOpen, toggleOpen] = useToggle()
```

## Async Data Fetching Hook

```typescript
interface UseQueryOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
}
// ... (42 lines trimmed)
    onError: err => console.error('Failed:', err)
  }
)
```

## Debounce Hook

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
// ... (15 lines trimmed)
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

## State Management: Context + Reducer Pattern

```typescript
interface State {
  markets: Market[]
  selectedMarket: Market | null
  loading: boolean
}
// ... (40 lines trimmed)
  if (!context) throw new Error('useMarkets must be used within MarketProvider')
  return context
}
```
