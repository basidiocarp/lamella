# Kubernetes Manifest Templates

## Deployment Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: <app-name>
  namespace: <namespace>
// ... (44 lines trimmed)
                name: <app-name>-config
            - secretRef:
                name: <app-name>-secret
```

## Service Templates

### ClusterIP (internal only)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: <app-name>
  namespace: <namespace>
// ... (8 lines trimmed)
      port: 80
      targetPort: 8080
      protocol: TCP
```

### LoadBalancer (external access)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: <app-name>
  namespace: <namespace>
// ... (10 lines trimmed)
      port: 80
      targetPort: 8080
      protocol: TCP
```

## ConfigMap Template

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: <app-name>-config
  namespace: <namespace>
data:
  APP_MODE: production
  LOG_LEVEL: info
  DATABASE_HOST: db.example.com
  # For config files
  app.properties: |
    server.port=8080
    server.host=0.0.0.0
    logging.level=INFO
```

## Secret Template

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: <app-name>-secret
  namespace: <namespace>
// ... (10 lines trimmed)
    -----BEGIN PRIVATE KEY-----
    ...
    -----END PRIVATE KEY-----
```

## PersistentVolumeClaim Template

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: <app-name>-data
  namespace: <namespace>
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: gp3
  resources:
    requests:
      storage: 10Gi
```

**Mount in Deployment:**

```yaml
spec:
  template:
    spec:
      containers:
        - name: app
          volumeMounts:
            - name: data
              mountPath: /var/lib/app
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: <app-name>-data
```

## Security Context Template

```yaml
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
// ... (9 lines trimmed)
            capabilities:
              drop:
                - ALL
```

## Labels and Annotations

### Standard labels (recommended)

```yaml
metadata:
  labels:
    app.kubernetes.io/name: <app-name>
    app.kubernetes.io/instance: <instance-name>
    app.kubernetes.io/version: "1.0.0"
    app.kubernetes.io/component: backend
    app.kubernetes.io/part-of: <system-name>
    app.kubernetes.io/managed-by: kubectl
```

### Useful annotations

```yaml
metadata:
  annotations:
    description: "Application description"
    contact: "team@example.com"
    prometheus.io/scrape: "true"
    prometheus.io/port: "9090"
    prometheus.io/path: "/metrics"
```
