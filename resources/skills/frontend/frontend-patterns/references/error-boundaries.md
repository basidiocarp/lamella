# Error Boundaries

Use error boundaries to isolate rendering failures and offer a real recovery
path.

## Good Coverage

- route or page-level boundaries
- boundaries around third-party widgets
- resettable boundaries for retryable local failures
- framework-native fallbacks such as Next.js `error.tsx`

## Rules

- show a meaningful fallback with retry or escape options
- log the error to your monitoring path
- do not use boundaries as a substitute for async or request-state handling
