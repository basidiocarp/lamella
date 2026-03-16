# Modern JavaScript Syntax (ES2023+)

## Optional Chaining and Nullish Coalescing

```javascript
// Optional chaining - safe property access
const userName = user?.profile?.name;
const firstItem = items?.[0];
const result = api?.fetchData?.();

// Nullish coalescing - default only for null/undefined
const port = config.port ?? 3000;
const name = user.name ?? 'Anonymous';

// Combining both patterns
const displayName = user?.profile?.name ?? user?.email ?? 'Guest';

// Optional chaining with delete
delete user?.temporaryData?.cache;
```

## Private Class Fields

```javascript
class BankAccount {
  // Private fields
  #balance = 0;
  #accountNumber;

// ... (26 lines trimmed)
    return this.#apiKey;
  }
}
```

## Top-Level Await

```javascript
// No need for async IIFE wrapper
const data = await fetch('/api/config').then(r => r.json());
const db = await connectDatabase(data.dbUrl);

// Dynamic imports with await
const module = await import(`./modules/${moduleName}.js`);

// Error handling at top level
try {
  const config = await loadConfig();
  startServer(config);
} catch (error) {
  console.error('Failed to start:', error);
  process.exit(1);
}
```

## Array Methods (Modern)

```javascript
// at() - negative indexing
const last = items.at(-1);
const secondLast = items.at(-2);

// findLast() and findLastIndex()
// ... (10 lines trimmed)

// flatMap() for transform and flatten
const nestedResults = users.flatMap(user => user.posts);
```

## Object and String Enhancements

```javascript
// Object.groupBy() - group array elements
const groupedByAge = Object.groupBy(users, user => user.age);
const groupedByStatus = Object.groupBy(orders, o => o.status);

// Object.hasOwn() - safer hasOwnProperty
// ... (8 lines trimmed)
// replaceAll()
const cleaned = text.replaceAll('old', 'new');
const sanitized = input.replaceAll(/[<>]/g, '');
```

## WeakRef and FinalizationRegistry

```javascript
// WeakRef - hold weak references to objects
class Cache {
  #cache = new Map();

  set(key, value) {
// ... (22 lines trimmed)
    registry.unregister(this);
  }
}
```

## Logical Assignment Operators

```javascript
// ||= - assign if falsy
config.timeout ||= 5000;
user.name ||= 'Anonymous';

// &&= - assign if truthy
user.profile &&= sanitize(user.profile);

// ??= - assign if nullish
options.port ??= 3000;
settings.theme ??= 'dark';
```

## Numeric Separators and BigInt

```javascript
// Numeric separators for readability
const billion = 1_000_000_000;
const bytes = 0xFF_EC_DE_5E;
const trillion = 1_000_000_000_000n;

// BigInt for large integers
const hugeNumber = 9007199254740991n;
const result = hugeNumber + 1n;
const mixed = BigInt(123) + 456n;

// BigInt operations
const divided = 10n / 3n; // 3n (truncates)
const power = 2n ** 64n;
```

## Pattern Matching (Stage 3 Proposal)

```javascript
// Using switch with enhanced patterns (when available)
function processValue(value) {
  switch (true) {
    case typeof value === 'string':
      return value.toUpperCase();
// ... (12 lines trimmed)
  if (status === 200) return data;
  return null;
}
```

## Iterator Helpers (Stage 3)

```javascript
// When available - chaining iterator operations
const result = [1, 2, 3, 4, 5]
  .values()
  .map(x => x * 2)
  .filter(x => x > 5)
// ... (11 lines trimmed)
for (const num of range) {
  console.log(num);
}
```

## Temporal API (Stage 3)

```javascript
// Modern date/time handling (when available)
import { Temporal } from '@js-temporal/polyfill';

const now = Temporal.Now.instant();
const date = Temporal.PlainDate.from('2024-01-15');
const time = Temporal.PlainTime.from('14:30:00');

// Duration calculations
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
const later = now.add(duration);

// Timezone handling
const zonedTime = now.toZonedDateTimeISO('America/New_York');
```

## Quick Reference

| Feature | ES Version | Syntax |
|---------|-----------|--------|
| Optional chaining | ES2020 | `obj?.prop` |
| Nullish coalescing | ES2020 | `value ?? default` |
| Private fields | ES2022 | `#fieldName` |
| Top-level await | ES2022 | `await import()` |
| Logical assignment | ES2021 | `x ??= y` |
| Array.at() | ES2022 | `arr.at(-1)` |
| Object.hasOwn() | ES2022 | `Object.hasOwn(obj, 'key')` |
| Array.findLast() | ES2023 | `arr.findLast(fn)` |
| toSorted() | ES2023 | `arr.toSorted()` |
