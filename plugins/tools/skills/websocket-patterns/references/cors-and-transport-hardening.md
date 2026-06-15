# CORS and Transport Hardening

Use this reference for handshake policy, transport sizing, and session safety.

## Explicit CORS

```javascript
const io = require("socket.io")(3000, {
  cors: {
    origin: ["https://example.com", "https://app.example.com"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization"]
  },
  maxHttpBufferSize: 1e6,
  pingTimeout: 60_000,
  pingInterval: 25_000
});
```

## Session IDs

```javascript
const crypto = require("crypto");

function generateSecureSessionId() {
  return crypto.randomBytes(32).toString("hex");
}
```

## Rules

- keep allowed origins explicit
- set message-size limits to cap abuse
- use heartbeat settings that match expected network conditions
- generate cryptographically strong session identifiers
- prefer secure cookies or auth payloads over ad hoc transport parameters
