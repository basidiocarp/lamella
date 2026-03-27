# Redis and Shared State

Use this reference when multiple WebSocket nodes must coordinate events or
presence.

## Socket.IO Redis Adapter

```javascript
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);
io.adapter(createAdapter(pubClient, subClient));
```

## Redis Streams

Use streams when you need more durable fan-out than plain pub/sub.

```javascript
const { createAdapter } = require("@socket.io/redis-streams-adapter");
io.adapter(createAdapter(redisClient, { streamName: "socket.io-stream", maxLen: 10000 }));
```

## Shared Presence

Store user-to-socket mappings or room metadata in Redis, not only local memory.

## Rules

- keep ephemeral routing local, but shared identity and room state central
- clean up Redis state on disconnect
- watch adapter lag and Redis memory growth
