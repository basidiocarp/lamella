# Authentication and Authorization

Use this reference for connection identity, room access, and privileged event
checks.

## Token-Based Authentication

```javascript
const io = require("socket.io")(3000);
const jwt = require("jsonwebtoken");

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});
```

## Room Authorization

```javascript
io.on("connection", (socket) => {
  socket.on("join-room", async (roomId) => {
    const allowed = await checkRoomAccess(socket.userId, roomId);
    if (!allowed) {
      socket.emit("error", { code: "ROOM_FORBIDDEN" });
      return;
    }

    socket.join(roomId);
  });
});
```

## Admin-Only Events

```javascript
const ADMIN_EVENTS = new Set(["kick-user", "ban-user", "delete-message"]);

io.on("connection", async (socket) => {
  socket.role = await getUserRole(socket.userId);

  socket.use(([event], next) => {
    if (ADMIN_EVENTS.has(event) && socket.role !== "admin") {
      return next(new Error("Forbidden"));
    }
    next();
  });
});
```

## Rules

- prefer auth payload or secure cookies over query params
- scope identity to the socket once, then reuse it
- check room access before `join`
- gate privileged events centrally, not per handler copy-paste
