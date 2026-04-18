# Deployment Patterns

## Agent vs Gateway

| Factor | Agent (sidecar/DaemonSet) | Gateway (central Deployment) |
|--------|--------------------------|------------------------------|
| Topology | One collector per node or pod | Shared fleet behind load balancer |
| Latency | Minimal (local) | Network hop |
| Enrichment | Host, pod, node metadata | Cross-service aggregation, tail sampling |
| Failure blast radius | Single node | All traffic |
| Best for | Log/metric collection, per-node enrichment | Tail sampling, fan-out to multiple backends, auth centralization |

Use both tiers together when you need local enrichment and centralized sampling: agents forward to the gateway, gateway applies tail sampling and exports.

## Kubernetes: DaemonSet (Agent)

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: otel-agent
spec:
  selector:
    matchLabels:
      app: otel-agent
  template:
    metadata:
      labels:
        app: otel-agent
    spec:
      serviceAccountName: otel-agent   # needs pod read permissions for k8sattributes
      containers:
        - name: otel-collector
          image: otel/opentelemetry-collector-contrib:latest
          args: ["--config=/conf/config.yaml"]
          ports:
            - containerPort: 4317   # OTLP gRPC
            - containerPort: 4318   # OTLP HTTP
            - containerPort: 13133  # health check
          resources:
            requests:
              memory: 256Mi
              cpu: 100m
            limits:
              memory: 512Mi
              cpu: 500m
          volumeMounts:
            - name: config
              mountPath: /conf
            - name: varlog
              mountPath: /var/log
              readOnly: true
      volumes:
        - name: config
          configMap:
            name: otel-agent-config
        - name: varlog
          hostPath:
            path: /var/log
```

## Kubernetes: Deployment (Gateway)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: otel-gateway
spec:
  replicas: 2
  selector:
    matchLabels:
      app: otel-gateway
  template:
    metadata:
      labels:
        app: otel-gateway
    spec:
      containers:
        - name: otel-collector
          image: otel/opentelemetry-collector-contrib:latest
          args: ["--config=/conf/config.yaml"]
          ports:
            - containerPort: 4317  # OTLP gRPC
            - containerPort: 4318  # OTLP HTTP
            - containerPort: 13133 # health check
          resources:
            requests: {memory: 1Gi, cpu: 500m}
            limits: {memory: 2Gi, cpu: 2000m}
          env:
            - name: AUTH_TOKEN
              valueFrom:
                secretKeyRef:
                  name: otel-secrets
                  key: auth-token
          volumeMounts:
            - name: config
              mountPath: /conf
      volumes:
        - name: config
          configMap:
            name: otel-gateway-config
```

Expose with a `ClusterIP` Service on ports 4317 and 4318 so agents can reach the gateway by DNS.

## Helm Chart

The OpenTelemetry community provides an official Helm chart.

```bash
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm repo update

# Install as a DaemonSet agent
helm install otel-agent open-telemetry/opentelemetry-collector \
  --set mode=daemonset \
  --values my-agent-values.yaml

# Install as a Deployment gateway
helm install otel-gateway open-telemetry/opentelemetry-collector \
  --set mode=deployment \
  --values my-gateway-values.yaml
```

Minimal `values.yaml` to override config:

```yaml
mode: deployment
replicaCount: 2

config:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:4317
  processors:
    memory_limiter:
      check_interval: 1s
      limit_mib: 1024
      spike_limit_mib: 256
    batch:
      send_batch_size: 1000
      timeout: 5s
  exporters:
    otlp:
      endpoint: <OTLP_ENDPOINT>
      headers:
        Authorization: "Bearer ${env:AUTH_TOKEN}"
  service:
    pipelines:
      traces:
        receivers: [otlp]
        processors: [memory_limiter, batch]
        exporters: [otlp]
```

## Docker Compose

```yaml
services:
  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    command: ["--config=/etc/otel/config.yaml"]
    volumes:
      - ./otel-config.yaml:/etc/otel/config.yaml:ro
    ports:
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
      - "13133:13133" # health check
      - "8888:8888"   # internal metrics
    environment:
      - AUTH_TOKEN=${AUTH_TOKEN}
    restart: unless-stopped
```

## Liveness and Readiness (Kubernetes)

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 13133
  initialDelaySeconds: 5
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /
    port: 13133
  initialDelaySeconds: 5
  periodSeconds: 10
```

Requires the `health_check` extension to be enabled and listed in `service.extensions`.
