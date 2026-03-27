# Web Endpoints

Use this page as the routing layer for Modal web endpoint patterns.

## Load Order

| Need | Reference |
| --- | --- |
| quick endpoint handlers and request models | `fastapi-endpoints.md` |
| ASGI, WSGI, and custom server hosting | `application-hosting-patterns.md` |
| streaming, websockets, auth, and URL handling | `realtime-auth-and-urls.md` |

## Core Rules

- start with the simplest endpoint decorator that matches the use case
- prefer framework-native apps for anything beyond a toy handler
- keep auth and deployment URL details explicit in the plan
