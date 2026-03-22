---
name: deployment
description: Deployment strategies, CI/CD pipeline design, Docker containerization, health checks, rollback procedures, and production readiness. Use when implementing deployment workflows, configuring CI/CD pipelines, planning rollback procedures, or preparing production releases.
---

# Deployment

## Contents

- [When to Use](#when-to-use)
- [Deployment Strategies](#deployment-strategies)
- [CI/CD Pipeline Design](#cicd-pipeline-design)
- [Health Checks](#health-checks)
- [Environment Configuration](#environment-configuration)
- [Rollback Strategies](#rollback-strategies)
- [Production Readiness Checklist](#production-readiness-checklist)
- [Pipeline Best Practices](#pipeline-best-practices)

## When to Use

- Setting up CI/CD pipelines (GitHub Actions, GitLab CI, Azure Pipelines)
- Planning deployment strategy (blue-green, canary, rolling)
- Implementing health checks and readiness probes
- Preparing for a production release
- Dockerizing an application
- Designing deployment gates and approval workflows
- Implementing progressive delivery

## Deployment Strategies

### Rolling Deployment (Default)

Replace instances gradually — old and new run simultaneously during rollout.

```yaml
# Kubernetes
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 2
    maxUnavailable: 1
```

**Use when:** Standard deployments, backward-compatible changes. Zero downtime but requires backward compatibility.

### Blue-Green Deployment

Two identical environments. Switch traffic atomically.

```bash
# Switch traffic to green
kubectl label service my-app version=green
# Rollback: switch back to blue
kubectl label service my-app version=blue
```

**Use when:** Critical services, zero-tolerance for issues. Doubles infrastructure cost temporarily.

### Canary Deployment

Route a small percentage of traffic to the new version first.

```yaml
# Argo Rollouts
strategy:
  canary:
    steps:
      - setWeight: 10
      - pause: { duration: 5m }
      - setWeight: 50
      - pause: { duration: 5m }
      - setWeight: 100
```

**Use when:** High-traffic services, risky changes. Requires traffic splitting + monitoring.

### Feature Flags

Deploy without releasing. Instant rollback via flag toggle.

```python
if flagsmith.has_feature("new_checkout_flow"):
    process_checkout_v2()
else:
    process_checkout_v1()
```

## CI/CD Pipeline Design

### Standard Pipeline Flow

```
PR opened:
  lint → typecheck → unit tests → integration tests → preview deploy

Merged to main:
  lint → typecheck → tests → build image → deploy staging → smoke tests → approve → deploy production
```

### Approval Gate Patterns

**Manual approval (GitHub Actions):**
```yaml
deploy-production:
  needs: staging-deploy
  environment:
    name: production
```

**Time-based (GitLab CI):**
```yaml
deploy:production:
  when: delayed
  start_in: 30 minutes
```

**Multi-approver (Azure Pipelines):**
```yaml
- task: ManualValidation@0
  inputs:
    notifyUsers: "team-leads@example.com"
```

### Multi-Stage Pipeline Example

```yaml
name: Production Pipeline
on:
  push:
    branches: [main]
jobs:
// ... (26 lines trimmed)
    environment: production
    steps:
      - run: kubectl apply -f k8s/production/
```

## Health Checks

### Application Health Endpoint

```typescript
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/health/detailed", async (req, res) => {
// ... (8 lines trimmed)
    checks,
  });
});
```

### Kubernetes Probes

```yaml
livenessProbe:
  httpGet: { path: /health, port: 3000 }
  initialDelaySeconds: 10
  periodSeconds: 30
  failureThreshold: 3
readinessProbe:
  httpGet: { path: /health, port: 3000 }
  initialDelaySeconds: 5
  periodSeconds: 10
startupProbe:
  httpGet: { path: /health, port: 3000 }
  failureThreshold: 30
```

## Environment Configuration

### Twelve-Factor App Pattern

All config via environment variables — never in code:

```bash
DATABASE_URL=postgres://user:pass@host:5432/db
REDIS_URL=redis://host:6379/0
NODE_ENV=production
```

### Configuration Validation (Fail Fast)

```typescript
import { z } from "zod";
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});
export const env = envSchema.parse(process.env);
```

## Rollback Strategies

### Automated Rollback

```yaml
- name: Health check
  id: health
  run: |
    for i in {1..10}; do
      curl -sf https://app.example.com/health && exit 0
      sleep 10
    done
    exit 1
- name: Rollback on failure
  if: failure()
  run: kubectl rollout undo deployment/my-app
```

### Manual Rollback

```bash
kubectl rollout history deployment/my-app
kubectl rollout undo deployment/my-app
kubectl rollout undo deployment/my-app --to-revision=3
```

### Rollback Checklist

- [ ] Previous image/artifact available and tagged
- [ ] Database migrations are backward-compatible
- [ ] Feature flags can disable new features without deploy
- [ ] Monitoring alerts configured for error rate spikes

## Production Readiness Checklist

### Application
- [ ] All tests pass (unit, integration, E2E)
- [ ] No hardcoded secrets
- [ ] Structured logging (JSON), no PII
- [ ] Health check endpoint returns meaningful status

### Infrastructure
- [ ] Docker image builds reproducibly (pinned versions)
- [ ] Environment variables validated at startup
- [ ] Resource limits set (CPU, memory)
- [ ] SSL/TLS on all endpoints

### Monitoring
- [ ] Metrics exported (request rate, latency, errors)
- [ ] Alerts for error rate > threshold
- [ ] Log aggregation set up

### Operations
- [ ] Rollback plan documented and tested
- [ ] Runbook for common failure scenarios
- [ ] On-call rotation defined

## Pipeline Best Practices

1. **Fail fast** — run quick tests first
2. **Parallel execution** — independent jobs concurrently
3. **Cache dependencies** between runs
4. **Environment parity** — keep environments consistent
5. **Secrets management** — use secret stores (Vault, etc.)
6. **Monitoring integration** — track DORA metrics (deployment frequency, lead time, change failure rate, MTTR)
7. **Rollback automation** — auto-rollback on health check failure
