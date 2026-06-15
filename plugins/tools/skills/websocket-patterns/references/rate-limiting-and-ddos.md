# Rate Limiting and DDoS Controls

Use this reference for message throttling, connection caps, and distributed
limits.

## Per-Socket Limiter

```javascript
class SocketRateLimiter {
  constructor(maxRequests = 100, windowMs = 60_000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  allow(id) {
    const now = Date.now();
    const state = this.requests.get(id) || { count: 0, resetAt: now + this.windowMs };

    if (now > state.resetAt) {
      state.count = 0;
      state.resetAt = now + this.windowMs;
    }

    state.count += 1;
    this.requests.set(id, state);
    return state.count <= this.maxRequests;
  }
}
```

## Redis-Backed Limiter

```javascript
async function checkRateLimit(redis, userId, maxRequests = 100, windowSec = 60) {
  const key = `rate_limit:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec);
  return count <= maxRequests;
}
```

## Connection Caps

```javascript
const connectionCounts = new Map();
const MAX_CONNECTIONS_PER_IP = 10;

io.engine.on("connection", (rawSocket) => {
  const ip = rawSocket.request.headers["x-forwarded-for"] || rawSocket.request.socket.remoteAddress;
  const nextCount = (connectionCounts.get(ip) || 0) + 1;
  connectionCounts.set(ip, nextCount);

  if (nextCount > MAX_CONNECTIONS_PER_IP) rawSocket.close();
});
```

## Rules

- limit connections per IP
- limit messages per socket or user
- use Redis for shared limits across nodes
- log dropped events and disconnect reasons
