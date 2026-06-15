---
name: modern-javascript-patterns
description: "Applies modern JavaScript patterns, utilities, and module-system guidance."
origin: lamella
---

# Modern JavaScript Patterns


## Contents

- [When to Use](#when-to-use)
- [Advanced Async Patterns](#advanced-async-patterns)
- [Utility Functions](#utility-functions)
- [Function Composition](#function-composition)
- [Generators for Lazy Evaluation](#generators-for-lazy-evaluation)
- [Tagged Template Literals](#tagged-template-literals)
- [Grouping (Object.groupBy - ES2024)](#grouping-objectgroupby---es2024)
- [Common Pitfalls](#common-pitfalls)

Standard ES6+ syntax is assumed knowledge. This skill covers non-obvious patterns, common utilities, and gotchas.

## When to Use

- Implementing advanced async patterns
- Building utility functions (debounce, throttle, memoize)
- Functional composition pipelines
- Working with generators for lazy evaluation

## Advanced Async Patterns

### Retry with Exponential Backoff

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
}
```

### Timeout Wrapper

```javascript
async function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}
```

### Concurrent Batch Processing

```javascript
async function processBatch(items, fn, concurrency = 5) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    results.push(...await Promise.all(batch.map(fn)));
  }
  return results;
}
```

## Utility Functions

### Debounce

```javascript
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

### Throttle

```javascript
function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

### Memoization

```javascript
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}
```

## Function Composition

```javascript
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// Usage
const processUser = pipe(
  user => ({ ...user, name: user.name.trim() }),
  user => ({ ...user, email: user.email.toLowerCase() }),
);
```

### Currying

```javascript
const curry = (fn) => (...args) =>
  args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args));

// Usage
const add = curry((a, b, c) => a + b + c);
const add5 = add(5);
add5(3, 2); // 10
```

## Generators for Lazy Evaluation

```javascript
function* lazyMap(iterable, transform) {
  for (const item of iterable) yield transform(item);
}

// Async generator for pagination
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const data = await fetch(`${url}?page=${page}`).then(r => r.json());
    if (!data.length) break;
    yield data;
    page++;
  }
}
```

## Tagged Template Literals

```javascript
function sql(strings, ...values) {
  return {
    text: strings.reduce((q, s, i) => `${q}$${i}${s}`),
    values
  };
}

const id = 5;
sql`SELECT * FROM users WHERE id = ${id}`
// { text: 'SELECT * FROM users WHERE id = $1', values: [5] }
```

## Grouping (Object.groupBy - ES2024)

```javascript
const grouped = Object.groupBy(users, user => user.role);
// { admin: [...], user: [...] }

// Polyfill for older environments
const groupBy = (arr, fn) => arr.reduce((acc, item) => {
  const key = fn(item);
  return { ...acc, [key]: [...(acc[key] || []), item] };
}, {});
```

## Common Pitfalls

| Issue | Problem | Solution |
|-------|---------|----------|
| `this` in callbacks | `this` is undefined | Use arrow functions or `.bind()` |
| Missing `await` | Function returns Promise, not value | Always `await` async calls |
| Unhandled rejection | Runtime crashes | Wrap in try/catch |
| Array mutation | `push`, `splice` mutate original | Use spread: `[...arr, item]` |
| Object mutation | Direct assignment mutates | Use spread: `{...obj, key: val}` |
| Promise in constructor | Anti-pattern | Use static async factory method |
| `for..in` on arrays | Iterates keys, not values | Use `for..of` or `.forEach()` |
| Blocking with `await` in loop | Sequential when parallel possible | Use `Promise.all()` |

## Reference Files

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Modern Syntax | `references/modern-syntax.md` | ES2023+ features, optional chaining, private fields |
| Async Patterns | `references/async-patterns.md` | Promises, async/await, error handling, event loop |
| Modules | `references/modules.md` | ESM vs CJS, dynamic imports, package.json exports |
| Browser APIs | `references/browser-apis.md` | Fetch, Web Workers, Storage, IntersectionObserver |
| Node Essentials | `references/node-essentials.md` | fs/promises, streams, EventEmitter, worker threads |
