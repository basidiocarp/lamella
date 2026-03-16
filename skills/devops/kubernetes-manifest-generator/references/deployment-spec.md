# Kubernetes Deployment Specification Reference

Comprehensive reference for Kubernetes Deployment resources, covering all key fields, best practices, and common patterns.

## Overview

A Deployment provides declarative updates for Pods and ReplicaSets. It manages the desired state of your application, handling rollouts, rollbacks, and scaling operations.

## Complete Deployment Specification

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: production
// ... (220 lines trimmed)
      # Image pull secrets
      imagePullSecrets:
        - name: regcred
```

## Field Reference

### Metadata Fields

#### Required Fields

- `apiVersion`: `apps/v1` (current stable version)
- `kind`: `Deployment`
- `metadata.name`: Unique name within namespace

#### Recommended Metadata

- `metadata.namespace`: Target namespace (defaults to `default`)
- `metadata.labels`: Key-value pairs for organization
- `metadata.annotations`: Non-identifying metadata

### Spec Fields

#### Replica Management

**`replicas`** (integer, default: 1)

- Number of desired pod instances
- Best practice: Use 3+ for production high availability
- Can be scaled manually or via HorizontalPodAutoscaler

**`revisionHistoryLimit`** (integer, default: 10)

- Number of old ReplicaSets to retain for rollback
- Set to 0 to disable rollback capability
- Reduces storage overhead for long-running deployments

#### Update Strategy

**`strategy.type`** (string)

- `RollingUpdate` (default): Gradual pod replacement
- `Recreate`: Delete all pods before creating new ones

**`strategy.rollingUpdate.maxSurge`** (int or percent, default: 25%)

- Maximum pods above desired replicas during update
- Example: With 3 replicas and maxSurge=1, up to 4 pods during update

**`strategy.rollingUpdate.maxUnavailable`** (int or percent, default: 25%)

- Maximum pods below desired replicas during update
- Set to 0 for zero-downtime deployments
- Cannot be 0 if maxSurge is 0

**Best practices:**

```yaml
# Zero-downtime deployment
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
// ... (9 lines trimmed)
# Complete replacement
strategy:
  type: Recreate
```

#### Pod Template

**`template.metadata.labels`**

- Must include labels matching `spec.selector.matchLabels`
- Add version labels for blue/green deployments
- Include standard Kubernetes labels

**`template.spec.containers`** (required)

- Array of container specifications
- At least one container required
- Each container needs unique name

#### Container Configuration

**Image Management:**

```yaml
containers:
  - name: app
    image: registry.example.com/myapp:1.0.0
    imagePullPolicy: IfNotPresent # or Always, Never
```

Image pull policies:

- `IfNotPresent`: Pull if not cached (default for tagged images)
- `Always`: Always pull (default for :latest)
- `Never`: Never pull, fail if not cached

**Port Declarations:**

```yaml
ports:
  - name: http # Named for referencing in Service
    containerPort: 8080
    protocol: TCP # TCP (default), UDP, or SCTP
    hostPort: 8080 # Optional: Bind to host port (rarely used)
```

#### Resource Management

**Requests vs Limits:**

```yaml
resources:
  requests:
    memory: "256Mi" # Guaranteed resources
    cpu: "250m" # 0.25 CPU cores
  limits:
    memory: "512Mi" # Maximum allowed
    cpu: "500m" # 0.5 CPU cores
```

**QoS Classes (determined automatically):**

1. **Guaranteed**: requests = limits for all containers
   - Highest priority
   - Last to be evicted

2. **Burstable**: requests < limits or only requests set
   - Medium priority
   - Evicted before Guaranteed

3. **BestEffort**: No requests or limits set
   - Lowest priority
   - First to be evicted

**Best practices:**

- Always set requests in production
- Set limits to prevent resource monopolization
- Memory limits should be 1.5-2x requests
- CPU limits can be higher for bursty workloads

#### Health Checks

**Probe Types:**

1. **startupProbe** - For slow-starting applications

   ```yaml
   startupProbe:
     httpGet:
       path: /health/startup
       port: 8080
     initialDelaySeconds: 0
     periodSeconds: 10
     failureThreshold: 30 # 5 minutes to start (10s * 30)
   ```

2. **livenessProbe** - Restarts unhealthy containers

   ```yaml
   livenessProbe:
     httpGet:
       path: /health/live
       port: 8080
     initialDelaySeconds: 30
     periodSeconds: 10
     timeoutSeconds: 5
     failureThreshold: 3 # Restart after 3 failures
   ```

3. **readinessProbe** - Controls traffic routing
   ```yaml
   readinessProbe:
     httpGet:
       path: /health/ready
       port: 8080
     initialDelaySeconds: 5
     periodSeconds: 5
     failureThreshold: 3 # Remove from service after 3 failures
   ```

**Probe Mechanisms:**

```yaml
# HTTP GET
httpGet:
  path: /health
  port: 8080
  httpHeaders:
// ... (14 lines trimmed)
grpc:
  port: 9090
  service: my.service.health.v1.Health
```

**Probe Timing Parameters:**

- `initialDelaySeconds`: Wait before first probe
- `periodSeconds`: How often to probe
- `timeoutSeconds`: Probe timeout
- `successThreshold`: Successes needed to mark healthy (1 for liveness/startup)
- `failureThreshold`: Failures before taking action

#### Security Context

**Pod-level security context:**

```yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
    fsGroupChangePolicy: OnRootMismatch
    seccompProfile:
      type: RuntimeDefault
```

**Container-level security context:**

```yaml
containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
// ... (6 lines trimmed)
        add:
          - NET_BIND_SERVICE # Only if needed
```

**Security best practices:**

- Always run as non-root (`runAsNonRoot: true`)
- Drop all capabilities and add only needed ones
- Use read-only root filesystem when possible
- Enable seccomp profile
- Disable privilege escalation

#### Volumes

**Volume Types:**

```yaml
volumes:
  # PersistentVolumeClaim
  - name: data
    persistentVolumeClaim:
      claimName: app-data
// ... (22 lines trimmed)
    hostPath:
      path: /data
      type: DirectoryOrCreate
```

#### Scheduling

**Node Selection:**

```yaml
# Simple node selector
nodeSelector:
  disktype: ssd
  zone: us-west-1a

// ... (8 lines trimmed)
              values:
                - amd64
                - arm64
```

**Pod Affinity/Anti-Affinity:**

```yaml
# Spread pods across nodes
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
    - labelSelector:
// ... (11 lines trimmed)
          matchLabels:
            app: database
        topologyKey: kubernetes.io/hostname
```

**Tolerations:**

```yaml
tolerations:
  - key: "node.kubernetes.io/unreachable"
    operator: "Exists"
    effect: "NoExecute"
    tolerationSeconds: 30
  - key: "dedicated"
    operator: "Equal"
    value: "database"
    effect: "NoSchedule"
```

## Common Patterns

### High Availability Deployment

```yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
// ... (15 lines trimmed)
          labelSelector:
            matchLabels:
              app: my-app
```

### Sidecar Container Pattern

```yaml
spec:
  template:
    spec:
      containers:
        - name: app
// ... (10 lines trimmed)
      volumes:
        - name: shared-logs
          emptyDir: {}
```

### Init Container for Dependencies

```yaml
spec:
  template:
    spec:
      initContainers:
        - name: wait-for-db
// ... (18 lines trimmed)
      containers:
        - name: app
          image: myapp:1.0.0
```

## Best Practices

### Production Checklist

- [ ] Set resource requests and limits
- [ ] Implement all three probe types (startup, liveness, readiness)
- [ ] Use specific image tags (not :latest)
- [ ] Configure security context (non-root, read-only filesystem)
- [ ] Set replica count >= 3 for HA
- [ ] Configure pod anti-affinity for spread
- [ ] Set appropriate update strategy (maxUnavailable: 0 for zero-downtime)
- [ ] Use ConfigMaps and Secrets for configuration
- [ ] Add standard labels and annotations
- [ ] Configure graceful shutdown (preStop hook, terminationGracePeriodSeconds)
- [ ] Set revisionHistoryLimit for rollback capability
- [ ] Use ServiceAccount with minimal RBAC permissions

### Performance Tuning

**Fast startup:**

```yaml
spec:
  minReadySeconds: 5
  strategy:
    rollingUpdate:
      maxSurge: 2
      maxUnavailable: 1
```

**Zero-downtime updates:**

```yaml
spec:
  minReadySeconds: 10
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

**Graceful shutdown:**

```yaml
spec:
  template:
    spec:
      terminationGracePeriodSeconds: 60
      containers:
        - name: app
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "sleep 15 && kill -SIGTERM 1"]
```

## Troubleshooting

### Common Issues

**Pods not starting:**

```bash
kubectl describe deployment <name>
kubectl get pods -l app=<app-name>
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

**ImagePullBackOff:**

- Check image name and tag
- Verify imagePullSecrets
- Check registry credentials

**CrashLoopBackOff:**

- Check container logs
- Verify liveness probe is not too aggressive
- Check resource limits
- Verify application dependencies

**Deployment stuck in progress:**

- Check progressDeadlineSeconds
- Verify readiness probes
- Check resource availability

## Related Resources

- [Kubernetes Deployment API Reference](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#deployment-v1-apps)
- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
