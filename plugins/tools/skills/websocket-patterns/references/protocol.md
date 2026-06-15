# WebSocket Protocol Essentials

Use this reference when you need protocol-level behavior instead of
library-level abstractions.

## Handshake

WebSocket starts as an HTTP upgrade:

```text
GET /socket HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: <random>
Sec-WebSocket-Version: 13
```

The server replies with `101 Switching Protocols` and the negotiated
`Sec-WebSocket-Accept`.

## Core Frame Types

- `0x1` text
- `0x2` binary
- `0x8` close
- `0x9` ping
- `0xA` pong

Use ping and pong for heartbeat and dead-connection detection.

## Close Codes

Important codes:

- `1000` normal closure
- `1001` going away
- `1002` protocol error
- `1009` message too big

Close with a code and short reason when the library allows it.

## Size and Compression

Set a sensible max payload and enable compression only when payload size
justifies the extra CPU cost.

## Practical Rules

- Use binary frames for binary data, not base64 inside text frames.
- Do not treat Socket.IO details as the native WebSocket protocol.
- Keep heartbeat behavior explicit on the server side if the library does not
  do it for you.
