# Kaizen Code Examples

Detailed code examples demonstrating each pillar of the Kaizen methodology.

## Continuous Improvement Examples

### Iterative Refinement

```typescript
// Iteration 1: Make it work
const calculateTotal = (items: Item[]) => {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
// ... (19 lines trimmed)
    return total + (item.price * item.quantity);
  }, 0);
};
```

Each step is complete, tested, and working.

### Anti-Pattern: Everything at Once

```typescript
// Bad: Trying to do everything at once
const calculateTotal = (items: Item[]): number => {
  // Validate, optimize, add features, handle edge cases all together
  if (!items?.length) return 0;
  const validItems = items.filter(item => {
    if (item.price < 0) throw new Error('Negative price');
    if (item.quantity < 0) throw new Error('Negative quantity');
    return item.quantity > 0; // Also filtering zero quantities
  });
  // Plus caching, plus logging, plus currency conversion...
  return validItems.reduce(...); // Too many concerns at once
};
```

Overwhelming, error-prone, hard to verify.

## Poka-Yoke (Error Proofing) Examples

### Type System Error Proofing

```typescript
// Bad: string status can be any value
type OrderBad = {
  status: string; // Can be "pending", "PENDING", "pnding", anything!
  total: number;
};
// ... (13 lines trimmed)
  | { status: 'delivered'; deliveredAt: Date; signature: string };

// Now impossible to have shipped without trackingNumber
```

### Non-Empty Array Pattern

```typescript
// Make invalid states unrepresentable
type NonEmptyArray<T> = [T, ...T[]];

const firstItem = <T>(items: NonEmptyArray<T>): T => {
  return items[0]; // Always safe, never undefined!
};

// Caller must prove array is non-empty
const items: number[] = [1, 2, 3];
if (items.length > 0) {
  firstItem(items as NonEmptyArray<number>); // Safe
}
```

### Validation Error Proofing

```typescript
// Bad: Validation after use
const processPayment = (amount: number) => {
  const fee = amount * 0.03; // Used before validation!
  if (amount <= 0) throw new Error('Invalid amount');
  // ...
// ... (30 lines trimmed)
  const amount = validatePositive(req.body.amount); // Validate once
  processPayment(amount); // Use everywhere safely
};
```

### Guards and Preconditions

```typescript
// Early returns prevent deeply nested code
const processUser = (user: User | null) => {
  if (!user) {
    logger.error('User not found');
    return;
// ... (12 lines trimmed)
  // Main logic here, guaranteed user is valid and active
  sendEmail(user.email, 'Welcome!');
};
```

### Configuration Error Proofing

```typescript
// Bad: Optional config with unsafe defaults
type ConfigBad = {
  apiKey?: string;
  timeout?: number;
};
// ... (21 lines trimmed)
// App fails at startup if config invalid, not during request
const config = loadConfig();
const client = new APIClient(config);
```

## Standardized Work Examples

### Following Patterns

```typescript
// Existing codebase pattern for API clients
class UserAPIClient {
  async getUser(id: string): Promise<User> {
    return this.fetch(`/users/${id}`);
  }
}

// New code follows the same pattern
class OrderAPIClient {
  async getOrder(id: string): Promise<Order> {
    return this.fetch(`/orders/${id}`);
  }
}
```

### Anti-Pattern: Breaking Consistency

```typescript
// Bad: Existing pattern uses classes
class UserAPIClient { /* ... */ }

// New code introduces different pattern without discussion
const getOrder = async (id: string): Promise<Order> => {
  // Breaking consistency "because I prefer functions"
};
```

### Error Handling Patterns

```typescript
// Project standard: Result type for recoverable errors
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

// All services follow this pattern
const fetchUser = async (id: string): Promise<Result<User, Error>> => {
// ... (15 lines trimmed)
  return;
}
const user = result.value; // Type-safe!
```

### Documentation Standards

```typescript
/**
 * Retries an async operation with exponential backoff.
 *
 * Why: Network requests fail temporarily; retrying improves reliability
 * When to use: External API calls, database operations
// ... (11 lines trimmed)
): Promise<T> => {
  // Implementation...
};
```

## Just-In-Time (JIT) Examples

### YAGNI in Action

```typescript
// Good: Current requirement - Log errors to console
const logError = (error: Error) => {
  console.error(error.message);
};
```

### Anti-Pattern: Over-Engineering

```typescript
// Bad: Over-engineered for "future needs"
interface LogTransport {
  write(level: LogLevel, message: string, meta?: LogMetadata): Promise<void>;
}

// ... (13 lines trimmed)
const logError = (error: Error) => {
  Logger.getInstance().log('error', error.message);
};
```

### Evolving Complexity

```typescript
// Start simple
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// ... (10 lines trimmed)
    currency: locale === 'en-US' ? 'USD' : 'EUR',
  }).format(amount);
};
```

Complexity added only when needed.

### Premature Abstraction

```typescript
// Bad: One use case, but building generic framework
abstract class BaseCRUDService<T> {
  abstract getAll(): Promise<T[]>;
  abstract getById(id: string): Promise<T>;
  abstract create(data: Partial<T>): Promise<T>;
// ... (15 lines trimmed)
};

// Abstract only when pattern proven across 3+ cases
```

### Performance Optimization

```typescript
// Good: Simple approach first
const filterActiveUsers = (users: User[]): User[] => {
  return users.filter(user => user.isActive);
};

// ... (9 lines trimmed)
  // Adds complexity, harder to maintain
  // No evidence it was needed
};
```
