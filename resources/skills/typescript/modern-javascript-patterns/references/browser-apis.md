# Browser APIs

## Fetch API

```javascript
// Basic GET request
const response = await fetch('/api/users');
const data = await response.json();

// POST with JSON
// ... (41 lines trimmed)
    body: formData,
  });
};
```

## Web Workers

```javascript
// main.js - Create and communicate with worker
const worker = new Worker('/worker.js');

worker.postMessage({ command: 'process', data: largeArray });

// ... (31 lines trimmed)
};

sharedWorker.port.postMessage({ type: 'init' });
```

## Service Workers & PWA

```javascript
// Register Service Worker
if ('serviceWorker' in navigator) {
  const registration = await navigator.serviceWorker.register('/sw.js');
  console.log('SW registered:', registration);

// ... (54 lines trimmed)
    event.waitUntil(syncMessages());
  }
});
```

## Local Storage & IndexedDB

```javascript
// LocalStorage (synchronous, max 5-10MB)
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');
localStorage.removeItem('theme');
localStorage.clear();
// ... (40 lines trimmed)
    request.onerror = () => reject(request.error);
  });
};
```

## Intersection Observer

```javascript
// Lazy loading images
const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
// ... (28 lines trimmed)

const sentinel = document.querySelector('#load-more-sentinel');
loadMoreObserver.observe(sentinel);
```

## Mutation Observer

```javascript
// Watch DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      console.log('Nodes added/removed:', mutation.addedNodes, mutation.removedNodes);
// ... (12 lines trimmed)

// Disconnect when done
observer.disconnect();
```

## Web Notifications

```javascript
// Request permission
const permission = await Notification.requestPermission();

if (permission === 'granted') {
  new Notification('Hello!', {
// ... (25 lines trimmed)
    clients.openWindow(event.notification.data)
  );
});
```

## Canvas & WebGL

```javascript
// Canvas 2D
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Draw rectangle
// ... (21 lines trimmed)
// Clear canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
```

## Performance APIs

```javascript
// Performance timing
const timing = performance.timing;
const loadTime = timing.loadEventEnd - timing.navigationStart;
console.log('Page load time:', loadTime);

// ... (14 lines trimmed)

const measures = performance.getEntriesByType('measure');
console.log(measures);
```

## Quick Reference

| API | Use Case | Browser Support |
|-----|----------|----------------|
| Fetch | HTTP requests | Modern browsers |
| Web Workers | CPU-intensive tasks | Modern browsers |
| Service Workers | Offline, caching | Modern browsers |
| IndexedDB | Large client storage | Modern browsers |
| IntersectionObserver | Lazy loading, infinite scroll | Modern browsers |
| MutationObserver | DOM change detection | Modern browsers |
| Notifications | User alerts | Modern browsers (permission) |
| Canvas | 2D graphics | All browsers |
| WebGL | 3D graphics | Modern browsers |
