# Kubernetes YAML Best Practices

Use this file as the routing layer for Kubernetes resource hygiene inside Helm
charts.

## Load Order

| Need | Reference |
| --- | --- |
| Metadata, labels, selectors, and naming hygiene | `metadata-and-selectors.md` |
| Resources, probes, and security context defaults | `workload-safety.md` |

## Core Rules

- Keep selectors stable and metadata consistent across all rendered resources.
- Treat probes, resource requests, and security context as normal workload
  defaults, not optional polish.
- Keep Kubernetes-specific YAML hygiene separate from Helm templating advice.
