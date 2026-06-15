# Kubernetes Service Specification Reference

Use this page to choose a Service type, wire ports correctly, and debug how traffic reaches pods.

## Choose a Service Type

| Type | Use for | Avoid when |
|------|---------|------------|
| `ClusterIP` | Internal traffic inside the cluster | Clients must connect from outside the cluster |
| `NodePort` | Simple external access in development or bare-metal clusters | You need managed load balancing or fine-grained ingress control |
| `LoadBalancer` | Public or private cloud load balancers | Your cluster does not support a cloud load balancer |
| `ExternalName` | DNS alias to an external dependency | You need kube-proxy routing or endpoint health checks |
| Headless (`clusterIP: None`) | Stateful workloads that need direct pod addresses | You want a single virtual IP with built-in load balancing |

## Minimal Service Shape

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-api
  namespace: production
  labels:
    app.kubernetes.io/name: web-api
    app.kubernetes.io/component: api
spec:
  selector:
    app.kubernetes.io/name: web-api
  ports:
    - name: http
      port: 80
      targetPort: http
      protocol: TCP
  type: ClusterIP
  sessionAffinity: None
```

## Key Fields

### Metadata

- `metadata.name` becomes part of the DNS name.
- `metadata.namespace` scopes the Service and its DNS entry.
- `metadata.labels` should follow the same label vocabulary as the workload.

### Selector

- `spec.selector` must match pod labels exactly or the Service will have no endpoints.
- Use stable labels such as `app.kubernetes.io/name` rather than rollout-specific labels.

### Ports

- `port` is the port clients connect to on the Service.
- `targetPort` is the destination port on the container and can be a number or a named port.
- `nodePort` is only valid for `NodePort` and `LoadBalancer`.
- Give ports names when a pod exposes more than one protocol or endpoint.

```yaml
ports:
  - name: http
    port: 80
    targetPort: http
  - name: metrics
    port: 9090
    targetPort: metrics
```

### Traffic Policies

- `externalTrafficPolicy: Local` preserves client IP for external traffic but only sends traffic to nodes with ready endpoints.
- `internalTrafficPolicy: Local` keeps cluster-internal traffic on the same node when possible.
- Leave both at `Cluster` unless you have a clear latency or source-IP requirement.

```yaml
spec:
  externalTrafficPolicy: Local
  internalTrafficPolicy: Cluster
```

### Session Affinity

- `sessionAffinity: None` is the default.
- `sessionAffinity: ClientIP` is useful for sticky sessions, WebSockets, and some stateful protocols.

```yaml
spec:
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
```

## Service Types

### ClusterIP

Use `ClusterIP` for internal APIs, databases, queues, and most service-to-service traffic.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: production
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: backend
  ports:
    - name: http
      port: 8080
      targetPort: http
```

### NodePort

Use `NodePort` for development clusters, simple demos, or when an external load balancer is managed outside Kubernetes.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: staging
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: frontend
  ports:
    - name: http
      port: 80
      targetPort: http
      nodePort: 30080
```

Notes:

- The valid `nodePort` range is usually `30000-32767`.
- Clients must reach a node IP directly.
- Health checks and failover are your responsibility.

### LoadBalancer

Use `LoadBalancer` when the cluster should provision a public or private load balancer for you.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: public-api
  namespace: production
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internet-facing"
spec:
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: public-api
  loadBalancerSourceRanges:
    - 203.0.113.0/24
  ports:
    - name: https
      port: 443
      targetPort: https
```

Provider-specific annotations vary by platform:

- AWS: NLB type, scheme, SSL certificate ARN, backend protocol.
- Azure: internal/public setting and public IP selection.
- GCP: internal/external load balancer behavior and backend config integration.

### ExternalName

Use `ExternalName` when the cluster only needs a DNS alias to an external dependency.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: billing-api
  namespace: production
spec:
  type: ExternalName
  externalName: billing.internal.example.com
```

Notes:

- `ExternalName` does not create endpoints.
- DNS resolution happens on the client side.
- This is useful during service migrations or hybrid deployments.

### Headless Service

Use a headless Service for StatefulSets and direct pod addressing.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: production
spec:
  clusterIP: None
  selector:
    app.kubernetes.io/name: postgres
  ports:
    - name: postgres
      port: 5432
      targetPort: postgres
```

Notes:

- DNS returns pod IPs rather than a virtual IP.
- This is the normal companion Service for StatefulSets.
- Clients can resolve pod-specific names such as `postgres-0.postgres.production.svc.cluster.local`.

## Service Discovery

Use these DNS forms:

- Same namespace: `http://backend`
- Cross-namespace: `http://backend.production.svc.cluster.local`
- Headless pod: `postgres-0.postgres.production.svc.cluster.local`

Kubernetes can also inject environment variables such as `BACKEND_SERVICE_HOST`, but DNS is the preferred mechanism because it does not depend on resource creation order.

## Common Patterns

### Internal Microservice

```yaml
apiVersion: v1
kind: Service
metadata:
  name: users
  namespace: backend
spec:
  selector:
    app.kubernetes.io/name: users
  ports:
    - name: http
      port: 8080
      targetPort: http
```

### Public API with Metrics Port

```yaml
apiVersion: v1
kind: Service
metadata:
  name: gateway
  namespace: production
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "9090"
spec:
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: gateway
  ports:
    - name: https
      port: 443
      targetPort: https
    - name: metrics
      port: 9090
      targetPort: metrics
```

### External Service Mapping with Endpoints

If you need a stable in-cluster name for a fixed external IP, pair a selector-less Service with `Endpoints` or `EndpointSlice`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: legacy-db
  namespace: production
spec:
  ports:
    - name: postgres
      port: 5432
      targetPort: 5432
---
apiVersion: v1
kind: Endpoints
metadata:
  name: legacy-db
  namespace: production
subsets:
  - addresses:
      - ip: 203.0.113.100
    ports:
      - name: postgres
        port: 5432
```

## Network Policy Reminder

Services do not enforce access control by themselves. If traffic should be restricted, define a matching `NetworkPolicy`.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: backend
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app.kubernetes.io/name: frontend
      ports:
        - protocol: TCP
          port: 8080
```

## Validation Checklist

- Service type matches the intended exposure model.
- Selector matches the pod labels on the workload.
- `targetPort` matches an actual container port or named port.
- Sticky sessions and traffic policies are set only when needed.
- Public Services restrict source ranges where possible.
- Network policies are defined for sensitive backends.

## Troubleshooting

### Service Has No Endpoints

```bash
kubectl get service web-api -n production
kubectl get endpoints web-api -n production
kubectl get pods -n production -l app.kubernetes.io/name=web-api --show-labels
```

### DNS Lookup Fails

```bash
kubectl run dns-debug --rm -it --restart=Never --image=busybox:1.36 -- nslookup web-api.production.svc.cluster.local
kubectl get pods -n kube-system -l k8s-app=kube-dns
```

### Load Balancer Never Provisions

```bash
kubectl describe service public-api -n production
kubectl get events -n production --sort-by='.lastTimestamp'
```

## Related Resources

- `manifest-templates.md` for copy-pasteable manifests
- `troubleshooting.md` for broader kubectl checks
- https://kubernetes.io/docs/concepts/services-networking/service/
