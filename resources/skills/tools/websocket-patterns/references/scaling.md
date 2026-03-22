# Horizontal Scaling Reference

## Architecture Overview

```
┌─────────────┐
│Load Balancer│ (nginx/HAProxy with sticky sessions)
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│WS #1│ │WS #2│ ... (Socket.IO servers)
└──┬──┘ └──┬──┘
   │       │
   └───┬───┘
       │
   ┌───▼───┐
   │ Redis │ (Pub/Sub adapter)
   └───────┘
```

## Redis Adapter Configuration

### Socket.IO with Redis

```javascript
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

// ... (18 lines trimmed)
io.emit('news', { hello: 'world' });

httpServer.listen(3000);
```

### Redis Streams for Reliable Delivery

```javascript
const { createAdapter } = require('@socket.io/redis-streams-adapter');

const redisClient = createClient({ url: 'redis://localhost:6379' });

redisClient.connect().then(() => {
  io.adapter(createAdapter(redisClient, {
    streamName: 'socket.io-stream',
    maxLen: 10000, // Keep last 10k messages
    readCount: 100 // Process 100 messages at a time
  }));
});
```

## Sticky Sessions

### Nginx Configuration

```nginx
upstream websocket_backend {
    ip_hash; # Sticky sessions based on IP
    server ws1.example.com:3000;
    server ws2.example.com:3000;
    server ws3.example.com:3000;
// ... (19 lines trimmed)
        proxy_read_timeout 7d;
    }
}
```

### HAProxy Configuration

```haproxyconf
frontend websocket_frontend
    bind *:80
    mode http
    option httplog
    use_backend websocket_backend
// ... (10 lines trimmed)
    server ws1 10.0.1.1:3000 check
    server ws2 10.0.1.2:3000 check
    server ws3 10.0.1.3:3000 check
```

### Cookie-based Sticky Sessions

```javascript
// Server-side: Set affinity cookie
io.engine.on('connection', (rawSocket) => {
  const serverID = process.env.SERVER_ID || 'server1';
  rawSocket.request.res.setHeader(
    'Set-Cookie',
    `io=${serverID}; Path=/; HttpOnly; SameSite=Lax`
  );
});
```

```nginx
# Nginx: Use cookie for routing
upstream websocket_backend {
    server ws1.example.com:3000;
    server ws2.example.com:3000;
}
// ... (8 lines trimmed)
    proxy_pass http://$backend_server;
    # ... other proxy settings
}
```

## State Management

### Shared State in Redis

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// Store user connection info
io.on('connection', async (socket) => {
// ... (29 lines trimmed)
    io.to(`user:${userId}`).emit(event, data);
  }
}
```

## Connection Limits

### Per-Server Limits

```javascript
const MAX_CONNECTIONS = 50000;

io.engine.on('connection', (socket) => {
  const currentConnections = io.engine.clientsCount;

  if (currentConnections > MAX_CONNECTIONS) {
    socket.close(1008, 'Server at capacity');
    return;
  }
});
```

### Kubernetes Horizontal Pod Autoscaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: websocket-server-hpa
spec:
// ... (17 lines trimmed)
      target:
        type: AverageValue
        averageValue: "40000" # Scale when avg > 40k connections/pod
```

## Graceful Shutdown

```javascript
const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');

  // Stop accepting new connections
  io.close(() => {
// ... (10 lines trimmed)

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
```

## Performance Optimization

### Node.js Clustering

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numWorkers = os.cpus().length;
// ... (14 lines trimmed)
  io.listen(3000);
  console.log(`Worker ${process.pid} started`);
}
```

### uWebSockets.js for Maximum Performance

```javascript
const uWS = require('uWebSockets.js');

const app = uWS.App()
  .ws('/*', {
    compression: uWS.SHARED_COMPRESSOR,
// ... (18 lines trimmed)
      console.log('Listening on port 9001');
    }
  });
```
