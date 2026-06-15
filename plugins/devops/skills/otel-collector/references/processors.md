# Processors

Processors transform, filter, or enrich telemetry between receivers and exporters.

## Required Ordering Rule

```
memory_limiter → enrichment processors → batch
```

`memory_limiter` must be first. `batch` must be last (just before the exporter). Enrichment processors go between them.

## memory_limiter (required, always first)

Prevents OOM crashes under traffic spikes by dropping or refusing data when heap usage crosses a threshold.

```yaml
# GOOD — memory_limiter is first
processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 512
    spike_limit_mib: 128
```

```yaml
# BAD — batch before memory_limiter; a spike fills the batch buffer before the limiter can act
processors:
  batch: {}
  memory_limiter:
    check_interval: 1s
    limit_mib: 512
```

Set `limit_mib` to about 80% of the container memory limit. Set `spike_limit_mib` to 25% of `limit_mib`.

## resourcedetection Processor

Auto-detects the hosting environment and adds resource attributes (cloud provider, region, host name, k8s node).

```yaml
processors:
  resourcedetection:
    detectors: [env, system, gcp, eks, ecs]
    timeout: 5s
    override: false
```

Use `override: false` to avoid overwriting SDK-set resource attributes.

## k8sattributes Processor

Enriches telemetry with Kubernetes pod, namespace, and deployment metadata.

```yaml
processors:
  k8sattributes:
    auth_type: serviceAccount
    passthrough: false
    extract:
      metadata:
        - k8s.pod.name
        - k8s.namespace.name
        - k8s.deployment.name
        - k8s.node.name
    pod_association:
      - sources:
          - from: resource_attribute
            name: k8s.pod.ip
      - sources:
          - from: connection
```

Requires a ClusterRole with `pods/get` and `pods/list` permissions.

## batch Processor (always last before exporter)

Accumulates spans/metrics/logs and sends them in bulk. Reduces export calls and backend pressure.

```yaml
processors:
  batch:
    send_batch_size: 1000
    send_batch_max_size: 2000
    timeout: 5s
```

`timeout` is the maximum wait before flushing a partial batch. 5s is a safe default.

## transform Processor (OTTL)

Applies OTTL expressions to modify attributes, drop fields, or set values. See [ottl.md](ottl.md) for syntax.

```yaml
processors:
  transform:
    trace_statements:
      - context: span
        statements:
          - set(attributes["environment"], "production")
          - delete_key(attributes, "http.user_agent")
```

## filter Processor (OTTL)

Drops entire spans, metrics, or log records that match a condition.

```yaml
processors:
  filter:
    traces:
      span:
        - 'attributes["http.route"] == "/healthz"'
```

## Typical Pipeline Order

```yaml
service:
  pipelines:
    traces:
      processors:
        - memory_limiter
        - resourcedetection
        - k8sattributes
        - transform
        - filter
        - batch
```
