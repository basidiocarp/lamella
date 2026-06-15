# Kubernetes Manifest Templates

Use these as starting points. Rename resources, namespaces, images, and secrets to fit the workload.

## Deployment Template

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
  selector:
    matchLabels:
      app.kubernetes.io/name: web-api
  template:
    metadata:
      labels:
        app.kubernetes.io/name: web-api
        app.kubernetes.io/component: api
    spec:
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
          readinessProbe:
            httpGet:
              path: /health/ready
              port: http
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /health/live
              port: http
            periodSeconds: 10
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL
```

## Service Templates

### ClusterIP

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-api
  namespace: production
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: web-api
  ports:
    - name: http
      port: 80
      targetPort: http
```

### LoadBalancer

```yaml
apiVersion: v1
kind: Service
metadata:
  name: public-web-api
  namespace: production
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
spec:
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: web-api
  ports:
    - name: https
      port: 443
      targetPort: https
```

## ConfigMap Template

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: web-api-config
  namespace: production
data:
  APP_MODE: production
  LOG_LEVEL: info
  FEATURE_FLAGS: "search,metrics"
  app.yaml: |
    http:
      port: 8080
    logging:
      format: json
```

## Secret Template

Use `stringData` when authoring manifests by hand. Kubernetes will encode the values on write.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: web-api-secret
  namespace: production
type: Opaque
stringData:
  DATABASE_URL: postgres://app:change-me@postgres.production.svc.cluster.local:5432/app
  API_TOKEN: change-me
```

## PersistentVolumeClaim Template

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: web-api-data
  namespace: production
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: gp3
  resources:
    requests:
      storage: 10Gi
```

Mount it in the Deployment:

```yaml
volumeMounts:
  - name: data
    mountPath: /var/lib/web-api
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: web-api-data
```

## Security Context Snippet

```yaml
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: app
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL
```

## Standard Labels

```yaml
metadata:
  labels:
    app.kubernetes.io/name: web-api
    app.kubernetes.io/instance: production
    app.kubernetes.io/version: "1.2.3"
    app.kubernetes.io/component: api
    app.kubernetes.io/part-of: checkout
    app.kubernetes.io/managed-by: kubectl
```

## Useful Annotations

```yaml
metadata:
  annotations:
    description: "Public API for checkout requests"
    contact: "platform@example.com"
    prometheus.io/scrape: "true"
    prometheus.io/port: "9090"
    prometheus.io/path: "/metrics"
```
