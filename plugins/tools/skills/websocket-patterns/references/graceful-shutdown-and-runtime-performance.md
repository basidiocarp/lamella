# Graceful Shutdown and Runtime Performance

Use this reference for draining nodes and tuning runtime throughput.

## Graceful Shutdown

```javascript
function gracefulShutdown() {
  io.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
```

Stop new work first, let existing sockets close or reconnect, then exit.

## Runtime Options

- Node cluster for CPU fan-out
- `uWebSockets.js` when raw performance matters more than ecosystem familiarity
- bounded compression and heartbeat tuning to control memory pressure

## Rules

- drain before terminating pods or hosts
- emit reconnect-safe signals during shutdown
- benchmark runtime changes against real message patterns, not toy traffic
