# RBAC Patterns and Best Practices

Use RBAC to express the least permissions a user, workload, or delivery system
needs. Start with a narrow namespace-scoped role and expand only when the
resource scope demands it.

## Common Patterns

### Read-Only Cluster Access

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: read-only
rules:
  - apiGroups: ["", "apps", "batch"]
    resources: ["*"]
    verbs: ["get", "list", "watch"]
```

### Namespace Admin

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: namespace-admin
  namespace: production
rules:
  - apiGroups: ["", "apps", "batch"]
    resources: ["*"]
    verbs: ["*"]
```

Use sparingly. Namespace admin is still broad and should not be the default app
role.

### Deployment Manager

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployment-manager
  namespace: production
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
```

### Dedicated ServiceAccount Reader

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: secret-reader
  namespace: production
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    resourceNames: ["app-config"]
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: secret-reader
  namespace: production
subjects:
  - kind: ServiceAccount
    name: my-app
    namespace: production
roleRef:
  kind: Role
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

### CI/CD Deployer

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cicd-deployer
rules:
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "create", "update", "patch"]
  - apiGroups: [""]
    resources: ["services", "configmaps"]
    verbs: ["get", "list", "create", "update", "patch"]
```

## ServiceAccount Rules

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-app
  namespace: production
```

- Give each workload a dedicated ServiceAccount.
- Disable token auto-mounting when the workload does not call the Kubernetes
  API.
- Prefer `Role` over `ClusterRole` unless the scope is truly cluster-wide.

## Troubleshooting

```bash
kubectl auth can-i list pods --as john@example.com
kubectl auth can-i '*' '*' --as system:serviceaccount:default:my-app
kubectl describe rolebinding -n production
kubectl get rolebindings,clusterrolebindings --all-namespaces -o wide | grep my-user
```

## Rules

- Avoid wildcard permissions in production roles where possible.
- Use `resourceNames` when one object is enough.
- Audit old bindings and unused service accounts regularly.
