# WebSocket Patterns

## Rooms and Namespaces

### Rooms

Use rooms to group clients that should receive the same broadcast.

```ts
io.on("connection", (socket) => {
  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
    socket.to(roomId).emit("system", `${socket.id} joined`);
  });

  socket.on("message", ({ roomId, text }) => {
    io.to(roomId).emit("message", {
      sender: socket.id,
      text,
    });
  });
});
```

### Namespaces

Use namespaces when whole groups of sockets need separate middleware or event
contracts.

```ts
const admin = io.of("/admin");

admin.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("missing auth"));
  next();
});

admin.on("connection", (socket) => {
  socket.emit("ready", { role: "admin" });
});
```

## Broadcasting Patterns

```ts
// everyone
io.emit("announcement", { message: "deploy starting" });

// everyone except sender
socket.broadcast.emit("typing", { userId: socket.id });

// a room only
io.to("project-123").emit("task-updated", { taskId: "abc" });
```

## Acknowledgments

Use acknowledgments when the sender needs confirmation or validation feedback.

```ts
socket.on("send-message", async (payload, ack) => {
  try {
    const saved = await messages.create(payload);
    ack({ ok: true, id: saved.id });
  } catch (error) {
    ack({ ok: false, error: "message_persist_failed" });
  }
});
```

## Presence System

```ts
const onlineUsers = new Map<string, Set<string>>();

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;
  const sessions = onlineUsers.get(userId) ?? new Set<string>();
  sessions.add(socket.id);
  onlineUsers.set(userId, sessions);

  io.emit("presence", { userId, online: true });

  socket.on("disconnect", () => {
    const remaining = onlineUsers.get(userId);
    if (!remaining) return;
    remaining.delete(socket.id);
    if (remaining.size === 0) {
      onlineUsers.delete(userId);
      io.emit("presence", { userId, online: false });
    }
  });
});
```

## Message Queue Pattern

Queue messages when the downstream consumer is slower than the incoming stream.

```ts
const queue: Array<{ event: string; payload: unknown }> = [];

socket.on("event", (payload) => {
  queue.push({ event: "event", payload });
});

setInterval(() => {
  const next = queue.shift();
  if (!next) return;
  processEvent(next.payload);
}, 25);
```

## Pub/Sub Pattern

Use Redis or another broker when events must cross multiple Socket.IO nodes.

```ts
sub.on("message", (_channel, message) => {
  const event = JSON.parse(message);
  io.to(event.roomId).emit(event.type, event.payload);
});

socket.on("publish", (event) => {
  pub.publish("ws-events", JSON.stringify(event));
});
```

## Backpressure Handling

Protect the server from slow consumers and oversized bursts.

```ts
socket.on("stream-chunk", (chunk) => {
  if (socket.conn.transport.writable === false) {
    socket.emit("slow-consumer", { retryInMs: 250 });
    return;
  }

  if (chunk.length > MAX_CHUNK_SIZE) {
    socket.emit("error", { code: "chunk_too_large" });
    return;
  }

  handleChunk(chunk);
});
```
