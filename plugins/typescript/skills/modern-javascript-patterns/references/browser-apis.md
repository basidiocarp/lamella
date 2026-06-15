# Browser APIs

## Fetch API

```javascript
const response = await fetch('/api/users')
const users = await response.json()

await fetch('/api/users', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' }),
})

const formData = new FormData()
formData.append('file', fileInput.files[0])
await fetch('/upload', { method: 'POST', body: formData })
```

## Web Workers

```javascript
const worker = new Worker('/worker.js')

worker.postMessage({ command: 'process', data: largeArray })
worker.onmessage = (event) => {
  console.log('Worker result:', event.data)
}
```

## Service Workers

```javascript
if ('serviceWorker' in navigator) {
  const registration = await navigator.serviceWorker.register('/sw.js')
  console.log('Registered service worker', registration.scope)
}
```

## Local Storage and IndexedDB

```javascript
localStorage.setItem('theme', 'dark')
const theme = localStorage.getItem('theme')

const openDb = indexedDB.open('app-db', 1)
openDb.onupgradeneeded = () => {
  openDb.result.createObjectStore('users', { keyPath: 'id' })
}
```

## Intersection Observer

```javascript
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src
      observer.unobserve(entry.target)
    }
  }
})

document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img))
```

## Mutation Observer

```javascript
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      console.log('DOM changed')
    }
  }
})

observer.observe(document.body, { childList: true, subtree: true })
```

## Notifications

```javascript
const permission = await Notification.requestPermission()
if (permission === 'granted') {
  new Notification('Build complete', { body: 'Your export is ready.' })
}
```

## Performance APIs

```javascript
performance.mark('search-start')
await runSearch()
performance.mark('search-end')
performance.measure('search', 'search-start', 'search-end')

console.log(performance.getEntriesByName('search'))
```
