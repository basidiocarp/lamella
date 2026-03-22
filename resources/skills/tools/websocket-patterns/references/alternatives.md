# Real-Time Communication Alternatives

## Technology Comparison

| Feature | WebSocket | SSE | Long Polling | HTTP/2 Push | WebRTC |
|---------|-----------|-----|--------------|-------------|--------|
| Bidirectional | Yes | No | Yes | No | Yes |
| Real-time | Yes | Yes | Near | Yes | Yes |
| Browser Support | Excellent | Good | Universal | Good | Good |
| Proxy Issues | Some | Rare | Rare | Some | Some |
| Overhead | Low | Low | High | Medium | Medium |
| Use Case | Chat, games | Feeds, updates | Legacy | Assets | Audio/video |

## Server-Sent Events (SSE)

### When to Use SSE

- One-way server-to-client communication
- Live feeds, notifications, stock tickers
- Automatic reconnection needed
- Simpler than WebSockets
- Better firewall/proxy compatibility

### SSE Server (Node.js)

```javascript
const express = require('express');
const app = express();

app.get('/events', (req, res) => {
  // Set SSE headers
// ... (23 lines trimmed)
});

app.listen(3000);
```

### SSE Client

```javascript
const eventSource = new EventSource('http://localhost:3000/events');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
// ... (11 lines trimmed)

// Close connection
eventSource.close();
```

### SSE with Express

```javascript
const express = require('express');
const app = express();

class SSEManager {
  constructor() {
// ... (40 lines trimmed)
}, 10000);

app.listen(3000);
```

## Long Polling

### When to Use Long Polling

- Legacy browser support needed
- Firewall/proxy blocks WebSockets
- Very infrequent updates
- Fallback mechanism

### Long Polling Server

```javascript
const express = require('express');
const app = express();

const pendingRequests = new Map();
const messages = [];
// ... (37 lines trimmed)
});

app.listen(3000);
```

### Long Polling Client

```javascript
const clientId = Math.random().toString(36);

async function poll() {
  try {
    const response = await fetch(
// ... (17 lines trimmed)
}

poll();
```

## HTTP/2 Server Push (Deprecated)

Note: HTTP/2 Server Push is deprecated and removed from Chrome. Use 103 Early Hints instead.

```javascript
// Example for historical context only
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
// ... (15 lines trimmed)
});

server.listen(3000);
```

## Decision Matrix

### Choose WebSocket When:

- Bidirectional communication needed
- Low latency critical (< 50ms)
- High message frequency (> 1 msg/sec)
- Gaming, chat, collaborative editing
- Binary data transfer
- Custom protocol needed

### Choose SSE When:

- One-way server-to-client only
- Stock tickers, live feeds
- News/notifications
- Simpler implementation preferred
- Better proxy compatibility needed
- Automatic reconnection important

### Choose Long Polling When:

- Legacy browser support required (IE8/9)
- WebSocket blocked by firewall
- Very infrequent updates
- Fallback mechanism only

### Choose HTTP Streaming When:

- Large data transfers
- File uploads with progress
- Video/audio streaming
- One-way data flow

### Choose WebRTC When:

- Peer-to-peer communication
- Audio/video calls
- Screen sharing
- File transfer between peers
- Low latency P2P needed

## Hybrid Approach

```javascript
// Socket.IO with automatic fallback
const io = require('socket.io')(3000, {
  transports: ['websocket', 'polling'], // Try WebSocket first
  upgrade: true,
  allowUpgrades: true
});

io.on('connection', (socket) => {
  console.log('Connected via:', socket.conn.transport.name);

  socket.conn.on('upgrade', () => {
    console.log('Upgraded to:', socket.conn.transport.name);
  });
});
```

## Performance Characteristics

### Latency (p99)

- WebSocket: 5-20ms
- SSE: 10-50ms
- Long Polling: 100-500ms
- HTTP/2: 20-100ms

### Throughput (messages/sec)

- WebSocket: 10,000+ per connection
- SSE: 1,000+ per connection
- Long Polling: 1-10 per connection

### Connection Limits (per server)

- WebSocket: 50,000-100,000
- SSE: 50,000-100,000
- Long Polling: 10,000-20,000

### Overhead (per message)

- WebSocket: 2-6 bytes
- SSE: ~20 bytes
- Long Polling: 500-2000 bytes (HTTP headers)

## Migration Path

### From Polling to WebSocket

```javascript
// Step 1: Support both
app.get('/api/messages', (req, res) => {
  // Legacy polling endpoint
  res.json({ messages: getRecentMessages() });
});

io.on('connection', (socket) => {
  // New WebSocket endpoint
  socket.on('subscribe', (channel) => {
    socket.join(channel);
  });
});

// Step 2: Gradually migrate clients
// Step 3: Deprecate polling endpoint
```

### From SSE to WebSocket

```javascript
// SSE provides read-only, add WebSocket for writes
app.get('/events', sseHandler);  // Keep for reads

io.on('connection', (socket) => {
  socket.on('action', (data) => {
    // Handle writes via WebSocket
    processAction(data);
  });
});

// Eventually migrate reads to WebSocket too
```

## Best Practices

1. Start with simplest solution (SSE for one-way)
2. Use Socket.IO for automatic fallbacks
3. Monitor actual requirements before over-engineering
4. Consider mobile/network constraints
5. Implement graceful degradation
6. Load test before production
7. Have fallback strategy
8. Monitor connection success rates
