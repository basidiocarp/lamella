# Realtime, Auth, and URLs

## Streaming and WebSockets

- use streaming responses for incremental output
- use ASGI or web-server modes for websocket workloads
- treat each long-lived connection as a capacity planning decision

## Authentication

- Modal proxy auth is the simplest first layer
- add bearer-token validation when the endpoint belongs to your app's auth model

## URLs

- document the generated URL pattern or custom domain explicitly
- retrieve URLs programmatically for output or tests when needed
