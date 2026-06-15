# Component Patterns

## Composition Over Inheritance

```typescript
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'outlined'
}

export function Card({ children, variant = 'default' }: CardProps) {
  const className =
    variant === 'outlined'
      ? 'rounded-xl border border-slate-300 bg-white p-4'
      : 'rounded-xl bg-slate-50 p-4 shadow-sm'

  return <section className={className}>{children}</section>
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <header className="mb-3 text-lg font-semibold">{children}</header>
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="text-sm text-slate-700">{children}</div>
}

export function CardFooter({ children }: { children: ReactNode }) {
  return <footer className="mt-4 border-t pt-3 text-sm">{children}</footer>
}

<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

## Compound Components

```typescript
import { createContext, useContext, useState, type ReactNode } from 'react'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tabs components must be used inside <Tabs>')
  return context
}

export function Tabs({
  defaultTab,
  children,
}: {
  defaultTab: string
  children: ReactNode
}) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>
}

export function TabList({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 border-b pb-2">{children}</div>
}

export function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabsContext()
  const selected = activeTab === id

  return (
    <button
      aria-selected={selected}
      className={selected ? 'font-semibold text-blue-600' : 'text-slate-500'}
      onClick={() => setActiveTab(id)}
      role="tab"
    >
      {children}
    </button>
  )
}

export function TabPanel({ whenActive, children }: { whenActive: string; children: ReactNode }) {
  const { activeTab } = useTabsContext()
  return activeTab === whenActive ? <div className="pt-4">{children}</div> : null
}

<Tabs defaultTab="overview">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="details">Details</Tab>
  </TabList>
  <TabPanel whenActive="overview">Overview content</TabPanel>
  <TabPanel whenActive="details">Details content</TabPanel>
</Tabs>
```

## Render Props Pattern

```typescript
import { useEffect, useState, type ReactNode } from 'react'

interface DataLoaderProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => ReactNode
}

export function DataLoader<T>({ url, children }: DataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        const payload = (await response.json()) as T
        if (!cancelled) setData(payload)
      } catch (err) {
        if (!cancelled) setError(err as Error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [url])

  return <>{children(data, loading, error)}</>
}

interface Market {
  id: string
  title: string
}

<DataLoader<Market[]> url="/api/markets">
  {(markets, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <ErrorState message={error.message} />
    return <MarketList markets={markets ?? []} />
  }}
</DataLoader>
```

## Error Boundary Pattern

```typescript
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Captured render error', { error, info })
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="rounded-lg border border-red-300 bg-red-50 p-4">
          <h2 className="font-semibold text-red-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-800">{this.state.error?.message}</p>
        </section>
      )
    }

    return this.props.children
  }
}

<ErrorBoundary>
  <App />
</ErrorBoundary>
```
