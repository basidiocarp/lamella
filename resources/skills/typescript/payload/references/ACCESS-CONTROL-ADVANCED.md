# Payload CMS Access Control Advanced Patterns

Use this page as the routing layer for advanced Payload access-control work.

## Load Order

| Need | Reference |
| --- | --- |
| locale, device, IP, and time-based access shapes | `access-control-context-and-time.md` |
| subscriptions, factory helpers, and collection templates | `access-control-factories-and-templates.md` |
| debugging and performance guardrails | `access-control-debugging-and-performance.md` |

## Core Rules

- default deny, then add the minimum business exceptions
- prefer query constraints over slow per-document async logic
- cache expensive shared checks in `req.context`
- return `false` on access-check errors rather than throwing through the request path
