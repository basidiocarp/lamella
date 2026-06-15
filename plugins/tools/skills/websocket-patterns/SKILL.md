---
name: websocket-patterns
description: "Designs real-time systems with WebSockets or Socket.IO."
origin: lamella
---
# WebSocket Patterns

Design real-time communication flows that stay reliable under disconnects, retries, and scale-out.

## Scope

Covers Socket.IO, native WebSockets, horizontal scaling with Redis pub/sub, and low-latency messaging.

## When to Use This Skill

- Building WebSocket servers (Socket.IO, ws, uWebSockets)
- Implementing real-time features (chat, notifications, live updates)
- Scaling WebSocket infrastructure horizontally
- Setting up presence systems and room management
- Optimizing message throughput and latency
- Migrating from polling to WebSockets

## Core Workflow

1. **Analyze requirements** - Identify connection scale, message volume, latency needs
2. **Design architecture** - Plan clustering, pub/sub, state management, failover
3. **Implement** - Build WebSocket server with authentication, rooms, events
4. **Scale** - Configure Redis adapter, sticky sessions, load balancing
5. **Monitor** - Track connections, latency, throughput, error rates

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Protocol | `references/protocol.md` | WebSocket handshake, frames, ping/pong, close codes |
| Scaling | `references/scaling.md` | Horizontal scaling, Redis pub/sub, sticky sessions |
| Patterns | `references/patterns.md` | Rooms, namespaces, broadcasting, acknowledgments |
| Security | `references/security.md` | Routing page for auth, authorization, rate limiting, validation, and transport hardening |
| Alternatives | `references/alternatives.md` | SSE, long polling, when to choose WebSockets |

## Constraints

### MUST DO
- Implement automatic reconnection with exponential backoff
- Use sticky sessions for load balancing
- Handle connection state properly (connecting, connected, disconnecting)
- Implement heartbeat/ping-pong to detect dead connections
- Authenticate connections before allowing events
- Use rooms/namespaces for message scoping
- Queue messages during disconnection
- Log connection metrics (count, latency, errors)

### MUST NOT DO
- Skip connection authentication
- Broadcast sensitive data to all clients
- Store large state in memory without clustering strategy
- Ignore connection limit planning
- Mix WebSocket and HTTP on same port without proper config
- Forget to handle connection cleanup
- Use polling when WebSockets are appropriate
- Skip load testing before production

## Output Templates

When implementing WebSocket features, provide:
1. Server setup (Socket.IO/ws configuration)
2. Event handlers (connection, message, disconnect)
3. Client library (connection, events, reconnection)
4. Brief explanation of scaling strategy

## Knowledge Reference

Socket.IO, ws, uWebSockets.js, Redis adapter, sticky sessions, nginx WebSocket proxy, JWT over WebSocket, rooms/namespaces, acknowledgments, binary data, compression, heartbeat, backpressure, horizontal pod autoscaling
