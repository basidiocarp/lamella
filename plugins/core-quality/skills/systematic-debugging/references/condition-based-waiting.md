# Condition-Based Waiting

Wait for the condition you care about, not for a guessed timeout.

## Core Pattern

```typescript
await waitFor(() => getResult() !== undefined, "result to be ready");
const result = getResult();
expect(result).toBeDefined();
```

## Generic Implementation

```typescript
async function waitFor<T>(
  condition: () => T | undefined | null | false,
  description: string,
  timeoutMs = 5000
): Promise<T> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const value = condition();
    if (value) return value;
    await new Promise((r) => setTimeout(r, 10));
  }

  throw new Error(`Timed out waiting for ${description}`);
}
```

## Rules

- prefer polling a real condition
- always use a timeout
- justify arbitrary sleeps when timing itself is under test
