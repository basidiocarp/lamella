# WebSocket Security Reference

Use this file as the routing page for WebSocket security work.

## Open These References By Task

1. [authentication-and-authorization.md](./authentication-and-authorization.md)
   Use for connection auth, room access, and privileged events.
2. [rate-limiting-and-ddos.md](./rate-limiting-and-ddos.md)
   Use for per-socket controls, distributed throttling, and connection caps.
3. [input-validation-and-xss.md](./input-validation-and-xss.md)
   Use for schema validation, sanitization, and safe message handling.
4. [cors-and-transport-hardening.md](./cors-and-transport-hardening.md)
   Use for handshake policy, message size limits, and session handling.

## Core Security Rules

- authenticate before accepting events
- authorize room joins and admin actions explicitly
- validate inbound payloads before broadcasting or persistence
- rate-limit both connections and messages
- keep transport and origin policy explicit, not permissive by default
