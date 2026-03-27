# Routing and Sticky Sessions

Use this reference for load-balancer behavior and session affinity.

## Architecture Shape

```text
Load Balancer
  -> WS Node 1
  -> WS Node 2
  -> Redis adapter / shared state
```

## Nginx Affinity

```nginx
upstream websocket_backend {
    ip_hash;
    server ws1.example.com:3000;
    server ws2.example.com:3000;
}
```

## Cookie Affinity

Use a cookie-based strategy when IP pinning is too coarse or unreliable.

```javascript
io.engine.on("connection", (rawSocket) => {
  const serverID = process.env.SERVER_ID || "server1";
  rawSocket.request.res.setHeader(
    "Set-Cookie",
    `io=${serverID}; Path=/; HttpOnly; SameSite=Lax`
  );
});
```

## Rules

- do not rely on random routing for stateful long-lived sockets
- prefer cookie affinity when clients sit behind shared NATs
- document the failover behavior when a node disappears
