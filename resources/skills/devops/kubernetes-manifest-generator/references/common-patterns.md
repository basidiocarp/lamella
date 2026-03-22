# Common Kubernetes Patterns

## Pattern 1: Simple Stateless Web Application

**Use case:** Standard web API or microservice

**Components needed:**
- Deployment (3 replicas for HA)
- ClusterIP Service
- ConfigMap for configuration
- Secret for API keys
- HorizontalPodAutoscaler (optional)

## Pattern 2: Stateful Database Application

**Use case:** Database or persistent storage application

**Components needed:**
- StatefulSet (not Deployment)
- Headless Service
- PersistentVolumeClaim template
- ConfigMap for DB configuration
- Secret for credentials

## Pattern 3: Background Job or Cron

**Use case:** Scheduled tasks or batch processing

**Components needed:**
- CronJob or Job
- ConfigMap for job parameters
- Secret for credentials
- ServiceAccount with RBAC

## Pattern 4: Multi-Container Pod

**Use case:** Application with sidecar containers

**Components needed:**
- Deployment with multiple containers
- Shared volumes between containers
- Init containers for setup
- Service (if needed)

---

## Multi-Resource Organization

### Option 1: Single file with `---` separator

```yaml
# app-name.yaml
---
apiVersion: v1
kind: ConfigMap
...
// ... (9 lines trimmed)
apiVersion: v1
kind: Service
...
```

### Option 2: Separate files

```
manifests/
├── configmap.yaml
├── secret.yaml
├── deployment.yaml
├── service.yaml
└── pvc.yaml
```

### Option 3: Kustomize structure

```
base/
├── kustomization.yaml
├── deployment.yaml
├── service.yaml
└── configmap.yaml
overlays/
├── dev/
│   └── kustomization.yaml
└── prod/
    └── kustomization.yaml
```

---

## Validation Commands

```bash
# Dry-run validation
kubectl apply -f manifest.yaml --dry-run=client

# Server-side validation
kubectl apply -f manifest.yaml --dry-run=server

# Validate with kubeval
kubeval manifest.yaml

# Validate with kube-score
kube-score score manifest.yaml

# Check with kube-linter
kube-linter lint manifest.yaml
```

## Validation Checklist

- [ ] Manifest passes dry-run validation
- [ ] All required fields are present
- [ ] Resource limits are reasonable
- [ ] Health checks are configured
- [ ] Security context is set
- [ ] Labels follow conventions
- [ ] Namespace exists or is created

---

## Security Checklist

- [ ] Run as non-root user
- [ ] Drop all capabilities
- [ ] Use read-only root filesystem
- [ ] Disable privilege escalation
- [ ] Set seccomp profile
- [ ] Use Pod Security Standards
