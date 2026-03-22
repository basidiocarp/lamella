# Asynchronous Patterns

## Promise Patterns

```javascript
// Promise creation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithTimeout = (url, timeout = 5000) => {
  return Promise.race([
// ... (8 lines trimmed)
  const posts = await fetch(`/api/users/${userId}/posts`).then(r => r.json());
  return { user, posts };
};
```

## Async/Await Best Practices

```javascript
// Parallel execution with Promise.all
const fetchAllData = async () => {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
// ... (23 lines trimmed)
  const [user, settings, history] = await Promise.all(promises);
  return { user, settings, history };
};
```

## Error Handling Strategies

```javascript
// Try-catch with specific error handling
const safeApiCall = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
// ... (41 lines trimmed)
    }
  }
};
```

## Promise Combinators

```javascript
// Promise.allSettled - wait for all, regardless of rejection
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/invalid')
// ... (19 lines trimmed)
  fetchFromCache(),
  fetchFromNetwork()
]);
```

## Async Generators

```javascript
// Async generator for pagination
async function* fetchPaginatedData(baseUrl) {
  let page = 1;
  let hasMore = true;

// ... (30 lines trimmed)
    }
  }
}
```

## Concurrent Queue Management

```javascript
// Limit concurrent operations
class AsyncQueue {
  #queue = [];
  #running = 0;
  #maxConcurrent;
// ... (23 lines trimmed)
const results = await Promise.all(
  urls.map(url => queue.run(() => fetch(url)))
);
```

## Event Loop Understanding

```javascript
// Microtasks vs Macrotasks
console.log('1: Synchronous');

setTimeout(() => console.log('2: Macrotask (setTimeout)'), 0);

// ... (20 lines trimmed)

  return results;
};
```

## AbortController for Cancellation

```javascript
// Abort fetch requests
const controller = new AbortController();
const { signal } = controller;

setTimeout(() => controller.abort(), 5000);
// ... (21 lines trimmed)
    throw error;
  }
};
```

## Stream Processing

```javascript
// Process ReadableStream
const processStream = async (url) => {
  const response = await fetch(url);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
// ... (19 lines trimmed)

const response = await fetch('/data');
const transformed = response.body.pipeThrough(transformStream);
```

## Quick Reference

| Pattern | Use Case | Example |
|---------|----------|---------|
| `Promise.all()` | Parallel, fail-fast | `await Promise.all([p1, p2])` |
| `Promise.allSettled()` | Parallel, all results | `await Promise.allSettled([p1, p2])` |
| `Promise.race()` | First to complete | `await Promise.race([p1, p2])` |
| `Promise.any()` | First to succeed | `await Promise.any([p1, p2])` |
| `async function*` | Async iteration | `for await (const x of gen())` |
| `AbortController` | Cancellation | `fetch(url, { signal })` |
| `queueMicrotask()` | Priority microtask | `queueMicrotask(fn)` |
