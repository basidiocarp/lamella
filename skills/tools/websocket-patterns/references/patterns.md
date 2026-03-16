# WebSocket Patterns Reference

## Rooms and Namespaces

### Rooms (Channel Grouping)

```javascript
const io = require('socket.io')(3000);

io.on('connection', (socket) => {
  // Join a room
  socket.on('join-room', (roomId) => {
// ... (43 lines trimmed)
// Get all sockets in a room
const sockets = await io.in('room123').fetchSockets();
console.log(`Room has ${sockets.length} connections`);
```

### Namespaces (Logical Separation)

```javascript
// Admin namespace
const adminNs = io.of('/admin');
adminNs.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);

// ... (21 lines trimmed)
    namespace.emit('message', data);
  });
});
```

## Broadcasting Patterns

```javascript
// Broadcast to everyone including sender
io.emit('event', data);

// Broadcast to everyone except sender
socket.broadcast.emit('event', data);
// ... (21 lines trimmed)
    console.log('All clients acknowledged:', responses);
  }
});
```

## Acknowledgments

```javascript
// Server expects acknowledgment
socket.emit('question', 'Do you agree?', (answer) => {
  console.log('Client answered:', answer);
});

// ... (21 lines trimmed)
    callback({ success: false, error: error.message });
  }
});
```

## Presence System

```javascript
const redis = require('ioredis');
const redisClient = new redis();

class PresenceManager {
  async userConnected(userId, socketId) {
// ... (92 lines trimmed)
    callback(presenceData);
  });
});
```

## Message Queue Pattern

```javascript
// Queue messages when client disconnected
const messageQueue = new Map();

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
// ... (35 lines trimmed)
    await saveMessageToDb(userId, message);
  }
}
```

## Pub/Sub Pattern

```javascript
const EventEmitter = require('events');

class MessageBus extends EventEmitter {
  constructor(io, redis) {
    super();
// ... (39 lines trimmed)
    });
  });
});
```

## Backpressure Handling

```javascript
io.on('connection', (socket) => {
  const MAX_BUFFER_SIZE = 10000;
  let bufferSize = 0;

  const originalEmit = socket.emit.bind(socket);
// ... (21 lines trimmed)
    console.log('Socket buffer drained');
  });
});
```
