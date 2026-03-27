# Horizontal Scaling Reference

Use this file as the routing page for scaling WebSocket systems.

## Open These References By Task

1. [routing-and-sticky-sessions.md](./routing-and-sticky-sessions.md)
   Use for load balancers, affinity, and sticky session strategies.
2. [redis-and-shared-state.md](./redis-and-shared-state.md)
   Use for Socket.IO Redis adapters, streams, and shared presence state.
3. [capacity-and-autoscaling.md](./capacity-and-autoscaling.md)
   Use for per-node limits, HPA rules, and scaling triggers.
4. [graceful-shutdown-and-runtime-performance.md](./graceful-shutdown-and-runtime-performance.md)
   Use for drain behavior, clustering, and runtime optimization.

## Core Scaling Rules

- keep routing affinity explicit
- move shared connection state out of process memory
- define hard connection limits before production load
- shut down nodes gracefully so clients can reconnect cleanly
