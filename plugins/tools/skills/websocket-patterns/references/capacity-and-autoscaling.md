# Capacity and Autoscaling

Use this reference for connection ceilings and scale-out triggers.

## Per-Server Limits

```javascript
const MAX_CONNECTIONS = 50000;

io.engine.on("connection", (socket) => {
  if (io.engine.clientsCount > MAX_CONNECTIONS) {
    socket.close(1008, "Server at capacity");
  }
});
```

## Kubernetes HPA Shape

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: websocket-server-hpa
spec:
  minReplicas: 2
  maxReplicas: 20
```

## Rules

- set hard ceilings before load testing
- scale on meaningful signals such as active connections, CPU, or adapter lag
- keep enough headroom for reconnect storms
