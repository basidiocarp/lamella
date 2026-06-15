# Helm Chart Metadata and Layout

This reference covers the files and conventions that define a chart before any
deployment lifecycle concerns appear.

## Standard Chart Layout

```text
my-app/
├── Chart.yaml
├── values.yaml
├── values.schema.json
├── charts/
├── templates/
│   ├── _helpers.tpl
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── NOTES.txt
│   └── tests/
└── files/
```

Use this layout as a default. Add files only when the chart actually needs
them.

## `Chart.yaml`

```yaml
apiVersion: v2
name: my-application
description: A Helm chart for my application
type: application
version: 1.2.3
appVersion: "2.5.0"
kubeVersion: ">=1.27.0-0"
```

Notes:

- `version` is the chart version and should follow SemVer.
- `appVersion` describes the workload version and can be any string.
- `type: library` is for helper-only charts that are not installed directly.

## Values Files

Keep defaults readable and validation explicit.

```yaml
global:
  imageRegistry: docker.io

replicaCount: 2

image:
  repository: my-app
  tag: "1.0.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
```

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "replicaCount": { "type": "integer", "minimum": 1 },
    "image": {
      "type": "object",
      "required": ["repository"]
    }
  }
}
```

## Template Placement

- Put reusable helpers in `_helpers.tpl`.
- Put install-time notes in `NOTES.txt`.
- Put chart tests in `templates/tests/`.
- Put CRDs in `crds/`, not in `templates/`.

## Rules

- Keep template filenames descriptive and lowercase.
- Prefer one clear place for defaults, one for validation, and one for helper
  logic.
- Do not bury core chart shape inside many nested subdirectories.
