# GitOps Sync Policies

Use sync policy settings to control reconciliation speed, safety, and operator
expectations. The exact knobs differ between Argo CD and Flux, but the policy
goals are the same: predictable rollout behavior, bounded retries, and clear
guardrails for production.

## Argo CD

### Automated Sync

```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
    allowEmpty: false
```

Use automated sync by default in lower environments. In production, decide
explicitly whether `prune` and `selfHeal` are acceptable for the workload.

### Retry Policy

```yaml
syncPolicy:
  retry:
    limit: 5
    backoff:
      duration: 5s
      factor: 2
      maxDuration: 3m
```

### Sync Windows

```yaml
syncWindows:
  - kind: allow
    schedule: "0 8 * * *"
    duration: 1h
    applications:
      - my-app
  - kind: deny
    schedule: "0 22 * * *"
    duration: 8h
    applications:
      - "*"
```

### Useful Sync Options

- `PrunePropagationPolicy=foreground`
- `CreateNamespace=true`
- `PruneLast=true`
- `RespectIgnoreDifferences=true`
- `ApplyOutOfSyncOnly=true`

## Flux

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
spec:
  interval: 5m
  prune: true
  wait: true
  timeout: 5m
  retryInterval: 1m
  force: false
```

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: my-app
spec:
  interval: 1m
  timeout: 60s
```

## Health Checks

Add custom health assessment only when the controller cannot infer readiness
from the resource type.

```yaml
data:
  resource.customizations.health.argoproj.io/Rollout: |
    hs = {}
    if obj.status ~= nil and obj.status.phase == "Healthy" then
      hs.status = "Healthy"
      hs.message = "Rollout healthy"
      return hs
    end
    hs.status = "Progressing"
    hs.message = "Waiting for status"
    return hs
```

## Rules

- Non-production can usually tolerate full automated sync.
- Production should document whether sync is automatic, operator-approved, or
  window-limited.
- Retry and prune settings should match the blast radius of the application.
