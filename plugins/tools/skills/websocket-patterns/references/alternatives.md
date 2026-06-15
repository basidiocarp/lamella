# Real-Time Communication Alternatives

Use this reference when WebSockets might not be the best transport.

## Quick Comparison

| Option | Direction | Best fit |
|--------|-----------|----------|
| WebSocket | Bidirectional | chat, collaboration, low-latency state sync |
| SSE | Server to client | notifications, feeds, status streams |
| Long polling | Request loop | legacy environments and fallback paths |
| WebRTC | Peer to peer | audio, video, direct data channels |

## SSE

Choose SSE when the server pushes updates and the client never needs its own
persistent channel back.

```javascript
const eventSource = new EventSource('/events');
eventSource.onmessage = event => {
  console.log(JSON.parse(event.data));
};
```

## Long Polling

Choose long polling when proxies or clients make persistent upgraded
connections unreliable.

```javascript
async function poll() {
  const response = await fetch('/poll');
  const data = await response.json();
  console.log(data);
  await poll();
}
```

## WebRTC

Choose WebRTC for browser-to-browser media or direct peer data channels. Do not
pick it just to avoid running a normal realtime backend.

## Practical Rules

- Prefer WebSockets for true bidirectional application state.
- Prefer SSE for simpler one-way server push.
- Keep long polling as a compatibility or migration fallback.
- Ignore HTTP/2 server push for new design work. It is effectively dead.
