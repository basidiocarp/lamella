# Common Kubernetes Patterns

## Standard Shapes

- stateless web app: Deployment + Service + ConfigMap + Secret
- stateful service: StatefulSet + Headless Service + PVC
- scheduled work: Job or CronJob
- sidecar pod: multi-container Deployment with shared volumes

## Resource Organization Options

1. single file with `---` separators
2. separate files per resource
3. Kustomize base and overlays

## Validation Commands

```bash
kubectl apply -f manifest.yaml --dry-run=client
kubectl apply -f manifest.yaml --dry-run=server
kubeval manifest.yaml
kube-score score manifest.yaml
kube-linter lint manifest.yaml
```
