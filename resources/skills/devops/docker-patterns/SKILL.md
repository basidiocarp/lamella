---
name: docker-patterns
description: Provides Docker and Docker Compose patterns for Dockerfile generation, compose configs, container security, networking, volumes, and multi-service orchestration. Use when creating Dockerfiles, generating `docker-compose.yml` files, initializing Docker in projects, configuring networking, setting up volumes, or securing containers.
---

# Docker Patterns


## Contents

- [When to Use](#when-to-use)
- [Docker Init by Project Type](#docker-init-by-project-type)
- [Docker Compose for Local Development](#docker-compose-for-local-development)
  - [Standard Web App Stack](#standard-web-app-stack)
  - [Development vs Production Dockerfile](#development-vs-production-dockerfile)
  - [Override Files](#override-files)
- [Networking](#networking)
  - [Service Discovery](#service-discovery)
  - [Custom Networks](#custom-networks)
  - [Exposing Only What's Needed](#exposing-only-whats-needed)
- [Volume Strategies](#volume-strategies)
  - [Common Patterns](#common-patterns)
- [Container Security](#container-security)
  - [Dockerfile Hardening](#dockerfile-hardening)
  - [Compose Security](#compose-security)
  - [Secret Management](#secret-management)
- [.dockerignore](#dockerignore)
- [Debugging](#debugging)
  - [Common Commands](#common-commands)
  - [Debugging Network Issues](#debugging-network-issues)
- [Anti-Patterns](#anti-patterns)


Docker and Docker Compose best practices for containerized development.

## When to Use

- Initializing Docker in a new or existing project
- Creating Dockerfiles from scratch
- Generating docker-compose.yml files
- Setting up Docker Compose for local development
- Designing multi-container architectures
- Troubleshooting container networking or volume issues
- Reviewing Dockerfiles for security and size

## Docker Init by Project Type

When initializing Docker for a project, detect the language/framework and generate: Dockerfile, docker-compose.yaml, .dockerignore, and .env.example.

### Node.js

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
// ... (10 lines trimmed)
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

### Python

```dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir uv
COPY requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt
// ... (8 lines trimmed)
ENV PYTHONUNBUFFERED=1
EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

### Go

```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
// ... (8 lines trimmed)
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["/server"]
```

## Docker Compose for Local Development

### Standard Web App Stack

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: .
// ... (47 lines trimmed)
volumes:
  pgdata:
  redisdata:
```

### Development vs Production Dockerfile

```dockerfile
# Stage: dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
// ... (25 lines trimmed)
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

### Override Files

```yaml
# docker-compose.override.yml (auto-loaded, dev-only settings)
services:
  app:
    environment:
      - DEBUG=app:*
// ... (12 lines trimmed)
        limits:
          cpus: "1.0"
          memory: 512M
```

```bash
# Development (auto-loads override)
docker compose up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Networking

### Service Discovery

Services in the same Compose network resolve by service name:
```
# From "app" container:
postgres://postgres:postgres@db:5432/app_dev    # "db" resolves to the db container
redis://redis:6379/0                             # "redis" resolves to the redis container
```

### Custom Networks

```yaml
services:
  frontend:
    networks:
      - frontend-net

// ... (9 lines trimmed)
networks:
  frontend-net:
  backend-net:
```

### Exposing Only What's Needed

```yaml
services:
  db:
    ports:
      - "127.0.0.1:5432:5432"   # Only accessible from host, not network
    # Omit ports entirely in production -- accessible only within Docker network
```

## Volume Strategies

```yaml
volumes:
  # Named volume: persists across container restarts, managed by Docker
  pgdata:

  # Bind mount: maps host directory into container (for development)
  # - ./src:/app/src

  # Anonymous volume: preserves container-generated content from bind mount override
  # - /app/node_modules
```

### Common Patterns

```yaml
services:
  app:
    volumes:
      - .:/app                   # Source code (bind mount for hot reload)
// ... (5 lines trimmed)
      - pgdata:/var/lib/postgresql/data          # Persistent data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql  # Init scripts
```

## Container Security

### Dockerfile Hardening

```dockerfile
# 1. Use specific tags (never :latest)
FROM node:22.12-alpine3.20

# 2. Run as non-root
RUN addgroup -g 1001 -S app && adduser -S app -u 1001
USER app

# 3. Drop capabilities (in compose)
# 4. Read-only root filesystem where possible
# 5. No secrets in image layers
```

### Compose Security

```yaml
services:
  app:
    security_opt:
      - no-new-privileges:true
// ... (6 lines trimmed)
    cap_add:
      - NET_BIND_SERVICE          # Only if binding to ports < 1024
```

### Secret Management

```yaml
# GOOD: Use environment variables (injected at runtime)
services:
  app:
    env_file:
      - .env                     # Never commit .env to git
// ... (12 lines trimmed)

# BAD: Hardcoded in image
# ENV API_KEY=sk-proj-xxxxx      # NEVER DO THIS
```

## .dockerignore

```
node_modules
.git
.env
.env.*
// ... (7 lines trimmed)
README.md
tests/
```

## Debugging

### Common Commands

```bash
# View logs
docker compose logs -f app           # Follow app logs
docker compose logs --tail=50 db     # Last 50 lines from db

# Execute commands in running container
// ... (13 lines trimmed)
docker compose down                   # Stop and remove containers
docker compose down -v                # Also remove volumes (DESTRUCTIVE)
docker system prune                   # Remove unused images/containers
```

### Debugging Network Issues

```bash
# Check DNS resolution inside container
docker compose exec app nslookup db

# Check connectivity
docker compose exec app wget -qO- http://api:3000/health

# Inspect network
docker network ls
docker network inspect <project>_default
```

## Anti-Patterns

```
# BAD: Using docker compose in production without orchestration
# Use Kubernetes, ECS, or Docker Swarm for production multi-container workloads

# BAD: Storing data in containers without volumes
# Containers are ephemeral -- all data lost on restart without volumes
// ... (9 lines trimmed)

# BAD: Putting secrets in docker-compose.yml
# Use .env files (gitignored) or Docker secrets
```
