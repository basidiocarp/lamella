# Resource Attributes

Resource attributes describe the entity producing telemetry. They are attached once at SDK initialization and appear on every span, metric, and log record. Getting them right has the largest impact on filterability.

## Required Attribute

| Attribute | Description | Example |
|-----------|-------------|---------|
| `service.name` | Logical service name | `"checkout-api"` |

Without `service.name`, traces and metrics cannot be scoped to a service in any backend.

## High-Priority Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `service.version` | Deployed artifact version | `"2.4.1"` |
| `deployment.environment.name` | Runtime environment | `"production"`, `"staging"` |
| `service.namespace` | Groups related services | `"payments"` |

## Environment Variable Setup

Set resource attributes via environment variables — no code changes required:

```bash
export OTEL_SERVICE_NAME="checkout-api"
export OTEL_SERVICE_VERSION="2.4.1"
export OTEL_RESOURCE_ATTRIBUTES="deployment.environment.name=production,service.namespace=payments"
export OTEL_EXPORTER_OTLP_ENDPOINT="http://collector:4317"
```

`OTEL_SERVICE_NAME` takes precedence over a `service.name` entry in `OTEL_RESOURCE_ATTRIBUTES`.

## Kubernetes: Downward API

Use the downward API to inject pod and node metadata without hardcoding:

```yaml
env:
  - name: OTEL_SERVICE_NAME
    value: "checkout-api"
  - name: OTEL_RESOURCE_ATTRIBUTES
    value: "deployment.environment.name=production,service.namespace=payments,k8s.pod.name=$(POD_NAME),k8s.namespace.name=$(POD_NAMESPACE),k8s.node.name=$(NODE_NAME)"
  - name: POD_NAME
    valueFrom:
      fieldRef:
        fieldPath: metadata.name
  - name: POD_NAMESPACE
    valueFrom:
      fieldRef:
        fieldPath: metadata.namespace
  - name: NODE_NAME
    valueFrom:
      fieldRef:
        fieldPath: spec.nodeName
```

Common k8s resource attributes:

| Attribute | Downward API field |
|-----------|-------------------|
| `k8s.pod.name` | `metadata.name` |
| `k8s.namespace.name` | `metadata.namespace` |
| `k8s.node.name` | `spec.nodeName` |
| `k8s.deployment.name` | Not available via downward API — set statically |

## Validation

After deploy, confirm resource attributes appear on spans and metrics:

```bash
# Check a recent span for resource attributes
# (query syntax varies by backend)
# Look for: service.name, service.version, deployment.environment.name
```

See [validation.md](validation.md) for the full checklist.
