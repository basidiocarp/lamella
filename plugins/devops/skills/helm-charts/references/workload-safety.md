# Kubernetes Workload Safety Defaults

This reference covers the defaults that make rendered workloads safer and more
operable: resources, probes, and security context.

## Resources

```yaml
resources:
  requests:
    memory: "64Mi"
    cpu: "100m"
  limits:
    memory: "128Mi"
    cpu: "500m"
```

Guidance:

- Set memory requests and limits for every production workload.
- Set CPU requests by default. CPU limits are situational for bursty services.
- Review actual usage before locking production values too tightly.

## Probes

### Liveness

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3
```

### Readiness

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Startup

```yaml
startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 30
```

Rules:

- Liveness should check whether the process is stuck, not whether a downstream
  dependency is healthy.
- Readiness should gate traffic until the workload is actually usable.
- Startup probes are better than huge `initialDelaySeconds` values for slow
  boots.

## Security Context

### Pod-Level

```yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault
```

### Container-Level

```yaml
containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
          - ALL
```

## Rules

- Default to non-root containers and `RuntimeDefault` seccomp.
- Treat `readOnlyRootFilesystem` and dropped capabilities as the baseline, not
  an optional hardening pass.
- If a workload needs an exception, document the specific reason in values or
  chart docs.
