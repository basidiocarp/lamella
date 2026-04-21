---
name: javascript-testing-patterns
description: "Applies non-obvious testing patterns for Jest and Vitest."
origin: lamella
---

# JavaScript Testing Patterns


## Contents

- [Framework Setup](#framework-setup)
- [Mocking Patterns](#mocking-patterns)
- [Testing Async Code](#testing-async-code)
- [Integration Testing](#integration-testing)
- [React Testing](#react-testing)
- [Test Factories (Faker)](#test-factories-faker)
- [Common Gotchas](#common-gotchas)

Standard Jest/Vitest syntax is assumed. This skill covers setup, mocking patterns, and testing infrastructure.

## Framework Setup

### Vitest (Recommended)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // or 'jsdom' for browser
    coverage: {
      provider: 'v8',
      thresholds: { branches: 80, functions: 80, lines: 80 },
      exclude: ['**/*.d.ts', '**/*.config.ts', '**/dist/**'],
    },
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

## Mocking Patterns

### Module Mocking

```typescript
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: '123' }),
    })),
  },
}));
```

### Dependency Injection for Testability

```typescript
// Good: Injectable dependencies
export class UserService {
  constructor(private repo: IUserRepository) {}
}

// Test
const mockRepo = { findById: vi.fn(), create: vi.fn() };
const service = new UserService(mockRepo);
```

### Global Fetch Mock

```typescript
global.fetch = vi.fn();

beforeEach(() => vi.clearAllMocks());

it('should fetch', async () => {
  (fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'test' }),
  });
});
```

### Spying

```typescript
const loggerSpy = vi.spyOn(logger, 'info');
// ... run code
expect(loggerSpy).toHaveBeenCalledWith('expected message');
loggerSpy.mockRestore(); // cleanup
```

## Testing Async Code

### Timer Mocking

```typescript
vi.useFakeTimers();
const callback = vi.fn();
setTimeout(callback, 1000);

vi.advanceTimersByTime(1000);
expect(callback).toHaveBeenCalled();
vi.useRealTimers();
```

### Testing Rejections

```typescript
await expect(service.fetchUser('invalid')).rejects.toThrow('Not found');
```

## Integration Testing

### Supertest for APIs

```typescript
import request from 'supertest';
import { app } from '../src/app';

beforeEach(async () => {
  await db.query('TRUNCATE TABLE users CASCADE');
});

it('should create user', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({ name: 'John', email: 'john@test.com' })
    .expect(201);

  expect(response.body).toHaveProperty('id');
});
```

## React Testing

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';

const { result } = renderHook(() => useCounter(10));

act(() => result.current.increment());

expect(result.current.count).toBe(11);
```

### Query Priority

Prefer in order:
1. `getByRole` - most accessible
2. `getByLabelText` - form elements
3. `getByPlaceholderText` - inputs
4. `getByText` - non-interactive
5. `getByTestId` - last resort

## Test Factories (Faker)

```typescript
import { faker } from '@faker-js/faker';

export function createUserFixture(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    ...overrides,
  };
}

// Usage
const user = createUserFixture({ name: 'John' });
```

## Common Gotchas

| Issue | Problem | Solution |
|-------|---------|----------|
| Shared state | Tests affect each other | Use `beforeEach` to reset |
| Mock not reset | Previous mock values leak | `vi.clearAllMocks()` in beforeEach |
| Async not awaited | Test passes but incomplete | Always `await` async operations |
| Timer tests hang | Real timers in test | Use `vi.useFakeTimers()` |
| DOM state persists | Component state leaks | `cleanup()` after each test |
| Snapshot too large | Hard to review changes | Snapshot smaller units |
