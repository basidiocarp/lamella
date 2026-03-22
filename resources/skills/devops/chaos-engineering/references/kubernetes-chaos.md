# Kubernetes Chaos Engineering

## Litmus Chaos - ChaosEngine

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
// ... (58 lines trimmed)

  # Job cleanup policy
  jobCleanUpPolicy: 'delete'
```

## Chaos Mesh Experiments

```yaml
# Network partition between services
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: partition-frontend-backend
// ... (93 lines trimmed)
    - external-api.example.com
    - *.third-party-service.com
  duration: '3m'
```

## Node Drain Simulation

```python
from kubernetes import client, config
from kubernetes.client.rest import ApiException
import time

class K8sNodeChaos:
// ... (99 lines trimmed)
        # Restore node
        self.uncordon_node(node_name)
        print("Node restored")
```

## Pod Autoscaling Chaos

```yaml
# Test HPA behavior under load
apiVersion: chaos-mesh.org/v1alpha1
kind: StressChaos
metadata:
  name: stress-hpa-trigger
// ... (35 lines trimmed)

          sleep 10
        done
```

## Custom Resource Chaos

```python
# Python script to test custom CRD resilience
from kubernetes import client, config
from kubernetes.client.rest import ApiException
import random
import time
// ... (68 lines trimmed)
    namespace='production',
    percentage=30
)
```

## Quick Reference

| Chaos Type | Tool | YAML/Command |
|------------|------|--------------|
| Pod delete | Litmus | `pod-delete` experiment |
| Network latency | Chaos Mesh | `NetworkChaos` with action: delay |
| Node drain | kubectl/API | `kubectl drain <node>` |
| CPU stress | Chaos Mesh | `StressChaos` with cpu stressor |
| DNS failure | Chaos Mesh | `DNSChaos` random/error action |
| I/O latency | Chaos Mesh | `IOChaos` with latency action |
| Network partition | Chaos Mesh | `NetworkChaos` partition |
| Pod failure | Chaos Mesh | `PodChaos` pod-failure |
