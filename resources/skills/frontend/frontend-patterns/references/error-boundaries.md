# Error Boundaries Reference

React error boundary patterns for catching and handling component errors gracefully.

## Basic Error Boundary

```tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
// ... (43 lines trimmed)
    </div>
  );
}
```

## Resettable Error Boundary

```tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
// ... (33 lines trimmed)
    return this.props.children;
  }
}
```

## react-error-boundary Library

```tsx
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4 bg-red-50 rounded-lg">
// ... (17 lines trimmed)
    </ErrorBoundary>
  );
}
```

## Next.js Error Handling

### App Router error.tsx

```tsx
'use client';

import { useEffect } from 'react';

export default function Error({
// ... (14 lines trimmed)
    </div>
  );
}
```

### Global Error (app/global-error.tsx)

```tsx
'use client';

export default function GlobalError({
  error, reset,
}: {
// ... (11 lines trimmed)
    </html>
  );
}
```

### Not Found (app/not-found.tsx)

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-gray-600 mt-2">Page not found</p>
      <Link href="/" className="mt-4 text-blue-600 hover:underline">Go home</Link>
    </div>
  );
}
```

## Async Error Handling

```tsx
'use client';

import { useState } from 'react';

interface AsyncState<T> {
// ... (21 lines trimmed)

  return { ...state, execute };
}
```

## Error Reporting

```typescript
export function reportError(error: Error, context?: Record<string, unknown>) {
  fetch('/api/errors', {
    method: 'POST',
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }),
  }).catch(console.error);
}
```

## Best Practices

1. **Wrap at route level** for page-level isolation
2. **Wrap third-party components** separately
3. **Provide meaningful fallbacks** with recovery options
4. **Log errors** to monitoring service
5. **Don't catch errors you can't handle**
6. **Test error states** in development
