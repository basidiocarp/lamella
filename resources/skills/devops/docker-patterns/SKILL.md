---
name: docker-patterns
description: "Guides Dockerfiles, Compose setups, networking, volumes, and container security."
origin: lamella
---

# Docker Patterns

Use this skill when the task is to design or harden containerized development and deployment flows. Keep the main file focused on decision points and minimal safe patterns rather than long framework-specific boilerplate.

## When to Use

- Adding Docker to a project for the first time
- Building a local multi-service stack with Compose
- Hardening images or Compose definitions for production
- Debugging container networking, bind mounts, or health checks
- Standardizing `.dockerignore`, runtime users, and secret handling

## Core Workflow

1. Pick the smallest base image that still supports the runtime.
2. Separate build and runtime stages where possible.
3. Run as a non-root user.
4. Mount source only for local development, not production.
5. Expose only the ports and networks that are actually needed.
6. Keep secrets out of images and committed Compose files.

## Minimal Production Dockerfile Pattern

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## Minimal Compose Pattern

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## Guardrails

- Pin image tags; avoid `latest`.
- Use `.dockerignore` to exclude VCS data, env files, and build artifacts.
- Prefer named volumes for database state and bind mounts only for source code.
- Add health checks only when the service exposes a real readiness endpoint.
- Use `env_file` or runtime injection for secrets, not `ENV` in the image.

## Common Pitfalls

- Shipping dev dependencies in the runtime image
- Running containers as root by default
- Publishing database or internal service ports unnecessarily
- Letting bind mounts hide installed dependencies
- Treating Compose as a production secret manager
