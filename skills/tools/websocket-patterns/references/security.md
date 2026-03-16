# WebSocket Security Reference

## Authentication

### JWT Authentication

```javascript
const io = require('socket.io')(3000);
const jwt = require('jsonwebtoken');

// Middleware for authentication
io.use((socket, next) => {
// ... (21 lines trimmed)
    saveMessage(socket.userId, data);
  });
});
```

### Query Parameter Authentication (Less Secure)

```javascript
// Use only for initial handshake, then upgrade to token
io.use((socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Invalid token'));
    socket.userId = decoded.userId;
    next();
  });
});
```

### Cookie Authentication

```javascript
const cookieParser = require('cookie-parser');

io.use((socket, next) => {
  const cookies = socket.handshake.headers.cookie;

// ... (22 lines trimmed)
    }
  );
});
```

## Authorization

### Room-Based Authorization

```javascript
io.on('connection', (socket) => {
  socket.on('join-room', async (roomId) => {
    // Check if user has permission
    const hasAccess = await checkRoomAccess(socket.userId, roomId);

// ... (28 lines trimmed)
    });
  });
});
```

### Admin-Only Events

```javascript
const ADMIN_EVENTS = ['kick-user', 'ban-user', 'delete-message'];

io.use((socket, next) => {
  // Attach role to socket after auth
  getUserRole(socket.userId).then(role => {
// ... (15 lines trimmed)
    });
  });
});
```

## Rate Limiting

### Per-Socket Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

class SocketRateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
// ... (41 lines trimmed)
    limiter.reset(socket.id);
  });
});
```

### Redis-Based Distributed Rate Limiting

```javascript
const Redis = require('ioredis');
const redis = new Redis();

async function checkRateLimit(userId, maxRequests = 100, windowSec = 60) {
  const key = `rate_limit:${userId}`;
// ... (32 lines trimmed)
    io.to(data.roomId).emit('message', data);
  });
});
```

## CORS Configuration

```javascript
const io = require('socket.io')(3000, {
  cors: {
    origin: ['https://example.com', 'https://app.example.com'],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Authorization']
  }
});

// Dynamic CORS
io.engine.on('initial_headers', (headers, req) => {
  headers['Access-Control-Allow-Origin'] = req.headers.origin;
});
```

## Input Validation

```javascript
const Joi = require('joi');

const messageSchema = Joi.object({
  roomId: Joi.string().uuid().required(),
  text: Joi.string().min(1).max(1000).required(),
// ... (21 lines trimmed)
    });
  });
});
```

## XSS Protection

```javascript
const sanitizeHtml = require('sanitize-html');

function sanitizeMessage(text) {
  return sanitizeHtml(text, {
    allowedTags: [], // Strip all HTML
// ... (12 lines trimmed)
    io.to(data.roomId).emit('message', sanitized);
  });
});
```

## DDoS Protection

### Connection Limiting

```javascript
const connectionLimits = new Map();
const MAX_CONNECTIONS_PER_IP = 10;

io.engine.on('connection', (rawSocket) => {
  const ip = rawSocket.request.headers['x-forwarded-for'] ||
// ... (17 lines trimmed)
    }
  });
});
```

### Message Size Limits

```javascript
const io = require('socket.io')(3000, {
  maxHttpBufferSize: 1e6, // 1MB max message size
  pingTimeout: 60000,
  pingInterval: 25000
});
// ... (8 lines trimmed)
    // Process message
  });
});
```

## Secure Session Management

```javascript
const sessions = new Map();

io.on('connection', (socket) => {
  const sessionId = generateSecureSessionId();

// ... (26 lines trimmed)
function generateSecureSessionId() {
  return require('crypto').randomBytes(32).toString('hex');
}
```

## Audit Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
// ... (29 lines trimmed)
    });
  });
});
```
