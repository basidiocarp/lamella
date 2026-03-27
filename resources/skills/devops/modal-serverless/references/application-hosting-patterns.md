# Application Hosting Patterns

## ASGI and WSGI

Use `@modal.asgi_app()` for FastAPI, Starlette, or similar frameworks, and
`@modal.wsgi_app()` for Flask or Django.

## Custom Servers

Use `@modal.web_server(port)` only when the framework manages its own socket.

Rules:

- bind to `0.0.0.0`
- avoid `shell=True`
- pair web servers with concurrency settings when many connections are expected
