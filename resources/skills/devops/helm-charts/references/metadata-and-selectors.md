# Kubernetes Metadata and Selectors

This reference covers the metadata and label rules that keep rendered manifests
predictable and compatible with Kubernetes controllers and tooling.

## Metadata Shape

```yaml
metadata:
  name: my-app
  namespace: production
  labels:
    app.kubernetes.io/name: my-app
    app.kubernetes.io/instance: my-app-prod
    app.kubernetes.io/version: "1.0.0"
    app.kubernetes.io/component: frontend
    app.kubernetes.io/part-of: my-platform
    app.kubernetes.io/managed-by: Helm
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
```

## Recommended Labels

Prefer the Kubernetes application label set:

- `app.kubernetes.io/name`
- `app.kubernetes.io/instance`
- `app.kubernetes.io/version`
- `app.kubernetes.io/component`
- `app.kubernetes.io/part-of`
- `app.kubernetes.io/managed-by`

For Helm-specific metadata:

```yaml
labels:
  helm.sh/chart: {{ include "mychart.chart" . }}
  app.kubernetes.io/managed-by: {{ .Release.Service }}
```

## Selector Rules

Selectors must match pod template labels exactly, but they should stay small and
stable.

Good:

```yaml
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: my-app
      app.kubernetes.io/instance: my-app-prod
  template:
    metadata:
      labels:
        app.kubernetes.io/name: my-app
        app.kubernetes.io/instance: my-app-prod
        app.kubernetes.io/version: "1.0.0"
```

Bad:

```yaml
spec:
  selector:
    matchLabels:
      app: my-app
      version: "1.0.0"
```

Do not put rolling values like version tags in selectors unless the controller
semantics genuinely require it.

## File and Resource Organization

- Prefer one resource per file unless a grouped file is clearly easier to read.
- Use descriptive names like `deployment.yaml`, `service.yaml`, or
  `networkpolicy.yaml`.
- Separate multiple resources in one file with `---`.

## Rules

- Use lowercase and hyphenated names for Kubernetes object names.
- Keep selector labels immutable once a controller is live.
- Use prefixed label keys for shared or tool-facing metadata.
