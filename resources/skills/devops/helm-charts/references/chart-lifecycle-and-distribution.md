# Helm Chart Lifecycle and Distribution

This reference covers the parts of chart structure that affect release
management rather than day-one layout.

## Dependencies

Declare chart dependencies in `Chart.yaml`:

```yaml
dependencies:
  - name: postgresql
    version: "12.0.0"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled
    alias: db
```

Useful commands:

```bash
helm dependency update
helm dependency list
helm dependency build
```

`Chart.lock` is generated and should reflect the exact dependency resolution for
the chart.

## `.helmignore`

Exclude development-only files from packaged charts.

```text
.git/
.github/
docs/
tests/
.vscode/
*.md
```

Do not exclude files the chart actually needs at install time.

## CRDs

```text
crds/
├── my-app-crd.yaml
└── another-crd.yaml
```

Rules:

- CRDs install before templates.
- CRDs are not templated.
- CRDs are not automatically upgraded or deleted with the chart.

## Chart Tests

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "my-app.fullname" . }}-test-connection"
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ["wget"]
      args: ["{{ include "my-app.fullname" . }}:{{ .Values.service.port }}"]
  restartPolicy: Never
```

```bash
helm test my-release
helm test my-release --logs
```

## Hooks and Packaging

```yaml
metadata:
  annotations:
    "helm.sh/hook": pre-upgrade,pre-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

Use hooks for narrow lifecycle tasks such as migrations. Do not turn the chart
into an ad hoc workflow engine.

Packaging and distribution:

```bash
helm package my-app/
helm repo index .
```

## Rules

- Keep dependency and packaging behavior deterministic.
- Treat hooks as exceptions, not the main deployment path.
- Test chart install, upgrade, and packaged output before release.
