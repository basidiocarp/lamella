# Asynchronous Patterns

## Promise Patterns

```javascript
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchWithTimeout = async (url, timeout = 5000) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}
```

## Async / Await Best Practices

```javascript
const fetchAllData = async () => {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users').then((r) => r.json()),
    fetch('/api/posts').then((r) => r.json()),
    fetch('/api/comments').then((r) => r.json()),
  ])

  return { users, posts, comments }
}
```

## Error Handling

```javascript
const safeApiCall = async (url) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { ok: false, status: response.status, data: null }
    }

    return { ok: true, status: response.status, data: await response.json() }
  } catch (error) {
    return { ok: false, status: 0, data: null, error }
  }
}
```

## Promise Combinators

```javascript
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/invalid'),
])

const firstAvailable = await Promise.any([
  fetchFromCache(),
  fetchFromNetwork(),
])
```

## Async Generators

```javascript
async function* fetchPaginatedData(baseUrl) {
  let page = 1

  while (true) {
    const response = await fetch(`${baseUrl}?page=${page}`)
    const { items, hasMore } = await response.json()
    yield items
    if (!hasMore) break
    page += 1
  }
}
```

## Concurrency Control

```javascript
class AsyncQueue {
  #running = 0
  #maxConcurrent
  #queue = []

  constructor(maxConcurrent = 4) {
    this.#maxConcurrent = maxConcurrent
  }

  async run(task) {
    if (this.#running >= this.#maxConcurrent) {
      await new Promise((resolve) => this.#queue.push(resolve))
    }

    this.#running += 1
    try {
      return await task()
    } finally {
      this.#running -= 1
      this.#queue.shift()?.()
    }
  }
}
```
