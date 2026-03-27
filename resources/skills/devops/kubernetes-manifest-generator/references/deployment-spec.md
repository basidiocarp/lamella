# Kubernetes Deployment Specification Reference

Use this page to shape a Deployment that rolls out safely, survives restarts, and exposes the right pod settings to the rest of the cluster.

## Minimal Deployment Shape

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-api
  namespace: production
  labels:
    app.kubernetes.io/name: web-api
    app.kubernetes.io/component: api
spec:
  replicas: 3
  revisionHistoryLimit: 5
  selector:
    matchLabels:
      app.kubernetes.io/name: web-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app.kubernetes.io/name: web-api
        app.kubernetes.io/component: api
    spec:
      serviceAccountName: web-api
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: app
          image: ghcr.io/acme/web-api:v1.2.3
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 8080
          envFrom:
            - configMapRef:
                name: web-api-config
            - secretRef:
                name: web-api-secret
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
          startupProbe:
            httpGet:
              path: /health/startup
              port: http
            periodSeconds: 10
            failureThreshold: 30
          livenessProbe:
            httpGet:
              path: /health/live
              port: http
            initialDelaySeconds: 20
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health/ready
              port: http
            periodSeconds: 5
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL
      terminationGracePeriodSeconds: 30
```

## Required Fields

- `apiVersion: apps/v1`
- `kind: Deployment`
- `metadata.name`
- `spec.selector.matchLabels`
- `spec.template.metadata.labels`
- `spec.template.spec.containers`

The selector and pod-template labels must match exactly. Changing the selector later is disruptive and should be avoided.

## Rollout Controls

### Replicas

- Use `replicas: 1` for development and non-critical jobs.
- Use `replicas: 3` or more for production services that need availability across node failures.
- Prefer a HorizontalPodAutoscaler for dynamic scaling rather than manual edits in many environments.

### Revision History

- `revisionHistoryLimit` controls how many old ReplicaSets remain for rollback.
- A value between `3` and `10` is common.
- `0` removes rollback history and is rarely a good default.

### Update Strategy

`RollingUpdate` is the normal default:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

Use `Recreate` only when the application cannot run two versions at once:

```yaml
strategy:
  type: Recreate
```

## Pod Template Fields

### Metadata and Labels

- Put stable routing labels under `template.metadata.labels`.
- Keep rollout metadata such as checksums or version annotations under `template.metadata.annotations`.
- Include standard labels such as `app.kubernetes.io/name`, `app.kubernetes.io/component`, and `app.kubernetes.io/version`.

### Container Image

```yaml
containers:
  - name: app
    image: ghcr.io/acme/web-api:v1.2.3
    imagePullPolicy: IfNotPresent
```

Notes:

- Do not use `:latest` in production manifests.
- Use `Always` only when tags are intentionally mutable.
- Add `imagePullSecrets` only when the registry actually requires them.

### Ports

Use named ports so Services and probes can reference them cleanly.

```yaml
ports:
  - name: http
    containerPort: 8080
```

### Config and Secrets

Use `envFrom` when most keys belong in the environment. Use explicit `env` when you want a small, stable interface.

```yaml
env:
  - name: LOG_LEVEL
    valueFrom:
      configMapKeyRef:
        name: web-api-config
        key: LOG_LEVEL
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: web-api-secret
        key: DATABASE_URL
```

### Resources

```yaml
resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

Guidance:

- Always set requests in production.
- Set memory limits carefully because the kernel enforces them strictly.
- CPU limits can be omitted for latency-sensitive services if the cluster policy allows it.

### Health Probes

Use all three probes when the application has meaningful startup and readiness phases.

```yaml
startupProbe:
  httpGet:
    path: /health/startup
    port: http
  periodSeconds: 10
  failureThreshold: 30
livenessProbe:
  httpGet:
    path: /health/live
    port: http
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /health/ready
    port: http
  periodSeconds: 5
```

Probe mechanisms:

- `httpGet` for HTTP services
- `tcpSocket` for simple port checks
- `exec` for custom in-container checks
- `grpc` for gRPC health endpoints

### Security Context

Pod-level defaults:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  runAsGroup: 10001
  fsGroup: 10001
  seccompProfile:
    type: RuntimeDefault
```

Container-level restrictions:

```yaml
securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop:
      - ALL
```

## Volumes

### ConfigMap Volume

```yaml
volumes:
  - name: app-config
    configMap:
      name: web-api-config
volumeMounts:
  - name: app-config
    mountPath: /etc/web-api
    readOnly: true
```

### Secret Volume

```yaml
volumes:
  - name: tls
    secret:
      secretName: web-api-tls
volumeMounts:
  - name: tls
    mountPath: /var/run/tls
    readOnly: true
```

### PersistentVolumeClaim

Use a PVC only when the workload actually needs writable persistent storage. Stateless services usually do not.

```yaml
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: web-api-data
volumeMounts:
  - name: data
    mountPath: /var/lib/web-api
```

## Scheduling Controls

### Node Selection

```yaml
nodeSelector:
  kubernetes.io/os: linux
```

Use `nodeSelector` for simple hard requirements and `nodeAffinity` for more expressive matching:

```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/arch
              operator: In
              values: ["amd64", "arm64"]
```

### Pod Anti-Affinity

Spread replicas across nodes for higher availability.

```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: web-api
          topologyKey: kubernetes.io/hostname
```

### Tolerations

```yaml
tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "batch"
    effect: "NoSchedule"
```

Use tolerations only when the workload is meant to run on tainted nodes.

## Common Patterns

### High Availability Service

```yaml
spec:
  replicas: 3
  minReadySeconds: 10
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

Pair this with anti-affinity and a PodDisruptionBudget.

### Sidecar Pattern

```yaml
containers:
  - name: app
    image: ghcr.io/acme/web-api:v1.2.3
  - name: log-shipper
    image: docker.io/fluent/fluent-bit:3.0
    volumeMounts:
      - name: shared-logs
        mountPath: /var/log/app
volumes:
  - name: shared-logs
    emptyDir: {}
```

### Init Container Pattern

```yaml
initContainers:
  - name: wait-for-db
    image: busybox:1.36
    command:
      - /bin/sh
      - -c
      - until nc -z postgres 5432; do sleep 2; done
containers:
  - name: app
    image: ghcr.io/acme/web-api:v1.2.3
```

## Production Checklist

- Requests and limits are set.
- Probes reflect real startup, liveness, and readiness behavior.
- Image tags are immutable.
- Pod and container security contexts remove unnecessary privileges.
- Replica count, anti-affinity, and disruption settings match the availability target.
- Config and secret sources exist in the same namespace.
- ServiceAccount and RBAC are least-privilege.
- Shutdown timing matches real application drain time.

## Troubleshooting

### Pods Never Become Ready

```bash
kubectl describe deployment web-api -n production
kubectl get pods -n production -l app.kubernetes.io/name=web-api
kubectl describe pod -n production <pod-name>
kubectl logs -n production <pod-name>
```

### Rollout Stuck

```bash
kubectl rollout status deployment/web-api -n production
kubectl describe rs -n production -l app.kubernetes.io/name=web-api
```

### Image Pull Failures

Check the image name, tag, registry credentials, and `imagePullSecrets`.

### CrashLoopBackOff

Check probe timing, startup behavior, resource limits, and missing dependencies.

## Related Resources

- `manifest-templates.md` for copy-pasteable manifests
- `service-spec.md` for Service wiring and exposure choices
- https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
