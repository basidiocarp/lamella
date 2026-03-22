# GitOps Sync Policies

## ArgoCD Sync Policies

### Automated Sync

```yaml
syncPolicy:
  automated:
    prune: true # Delete resources removed from Git
    selfHeal: true # Reconcile manual changes
    allowEmpty: false # Prevent empty sync
```

### Manual Sync

```yaml
syncPolicy:
  syncOptions:
    - PrunePropagationPolicy=foreground
    - CreateNamespace=true
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

## Flux Sync Policies

### Kustomization Sync

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

### Source Sync Interval

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: my-app
spec:
  interval: 1m
  timeout: 60s
```

## Health Assessment

### Custom Health Checks

```yaml
# ArgoCD
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
// ... (20 lines trimmed)
    hs.status = "Progressing"
    hs.message = "Waiting for status"
    return hs
```

## Sync Options

### Common Sync Options

- `PrunePropagationPolicy=foreground` - Wait for pruned resources to be deleted
- `CreateNamespace=true` - Auto-create namespace
- `Validate=false` - Skip kubectl validation
- `PruneLast=true` - Prune resources after sync
- `RespectIgnoreDifferences=true` - Honor ignore differences
- `ApplyOutOfSyncOnly=true` - Only apply out-of-sync resources

## Best Practices

1. Use automated sync for non-production
2. Require manual approval for production
3. Configure sync windows for maintenance
4. Implement health checks for custom resources
5. Use selective sync for large applications
6. Configure appropriate retry policies
7. Monitor sync failures with alerts
8. Use prune with caution in production
9. Test sync policies in staging
10. Document sync behavior for teams
