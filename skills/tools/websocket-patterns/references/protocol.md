# WebSocket Protocol Reference

## Protocol Basics

### Handshake Process

```
Client → Server: HTTP Upgrade Request
GET /socket.io/?EIO=4&transport=websocket HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Version: 13

Server → Client: HTTP 101 Switching Protocols
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
```

### Frame Structure

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
// ... (10 lines trimmed)
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
```

## Opcodes

```javascript
const OPCODES = {
  CONTINUATION: 0x0, // Continuation frame
  TEXT: 0x1,         // Text frame
  BINARY: 0x2,       // Binary frame
  CLOSE: 0x8,        // Connection close
  PING: 0x9,         // Heartbeat ping
  PONG: 0xA          // Heartbeat pong
};
```

## Ping/Pong Mechanism

```javascript
// Server-side ping/pong with ws library
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
// ... (23 lines trimmed)
wss.on('close', () => {
  clearInterval(interval);
});
```

## Close Codes

```javascript
const CLOSE_CODES = {
  1000: 'Normal Closure',
  1001: 'Going Away',
  1002: 'Protocol Error',
  1003: 'Unsupported Data',
// ... (9 lines trimmed)

// Proper close handling
ws.close(1000, 'Normal closure');
```

## Message Size Limits

```javascript
// Set max payload size (default 100MB)
const wss = new WebSocket.Server({
  port: 8080,
  maxPayload: 1024 * 1024 // 1MB
});

// Handle too large messages
ws.on('error', (error) => {
  if (error.message.includes('Max payload size exceeded')) {
    ws.close(1009, 'Message too big');
  }
});
```

## Compression (permessage-deflate)

```javascript
const wss = new WebSocket.Server({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
// ... (10 lines trimmed)
    threshold: 1024 // Only compress messages > 1KB
  }
});
```

## Binary Data Handling

```javascript
// Send binary data
const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03]);
ws.send(buffer, { binary: true });

// Receive binary data
// ... (13 lines trimmed)
    console.log('Received:', view);
  }
};
```

## Protocol Comparison

| Feature | WebSocket | Socket.IO |
|---------|-----------|-----------|
| Protocol | Native WS | WS + fallbacks |
| Handshake | HTTP Upgrade | Engine.IO handshake |
| Reconnection | Manual | Automatic |
| Broadcasting | Manual | Built-in |
| Rooms | Manual | Built-in |
| Acknowledgments | Manual | Built-in |
| Binary | Native | Converted |
| Overhead | Minimal | Higher |
| Fallback | None | Long polling, SSE |
