---
name: helm-charts
description: "Creates, validates, lints, and tests Helm charts for Kubernetes applications."
origin: lamella
---

# Helm Charts

## Contents

- [When to Use](#when-to-use)
- [Chart Structure](#chart-structure)
- [Scaffolding Workflow](#scaffolding-workflow)
- [Common Patterns](#common-patterns)
- [Validation Workflow](#validation-workflow)
- [Security Check](#security-check)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Reference Files](#reference-files)

## When to Use

**Scaffolding:** Create new Helm charts, package K8s apps, manage multi-environment deployments, set up chart repositories.

**Validation:** Validate charts before release, debug `helm template` failures, check security, pre-deployment quality gates, CRD verification.

## Chart Structure

```
my-app/
├── Chart.yaml           # Metadata
├── values.yaml          # Default config
├── charts/              # Dependencies
├── templates/
│   ├── NOTES.txt       # Post-install notes
│   ├── _helpers.tpl    # Template helpers
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   └── tests/
│       └── test-connection.yaml
└── .helmignore
```

## Scaffolding Workflow

```bash
helm create my-app
# Edit Chart.yaml, values.yaml, templates/
helm lint my-app/
helm template my-app ./my-app --dry-run
helm install my-app ./my-app -f values-prod.yaml
helm package my-app/
```

See [references/workflow-guide.md](references/workflow-guide.md) for the full 10-step workflow.

## Common Patterns

**Conditional resources:**
```yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
...
{{- end }}
```

**Iterating over lists:**
```yaml
env:
{{- range .Values.env }}
- name: {{ .name }}
  value: {{ .value | quote }}
{{- end }}
```

**Global values:**
```yaml
global:
  imageRegistry: docker.io
# Use: {{ .Values.global.imageRegistry }}/{{ .Values.image.repository }}
```

## Validation Workflow

**Read-only by default** — analyzes and proposes improvements. Modifies files only when explicitly requested.

### Preflight

```bash
bash scripts/setup_tools.sh
```

Required: helm, yamllint, kubeconform, kubectl

### Validation Stages

| Stage | Description |
|-------|-------------|
| 1. Tool Check | Verify helm, yamllint, kubeconform, kubectl |
| 2. Structure | Validate Chart.yaml, values.yaml, templates/ |
| 3. Helm Lint | `helm lint --strict` |
| 4. Template Render | `helm template --debug` |
| 5. YAML Syntax | yamllint validation |
| 6. CRD Detection | Detect CRDs, lookup docs |
| 7. Schema Validation | kubeconform against K8s schemas |
| 8. Dry-Run | `helm install --dry-run=server` (cluster required) |
| 9. Security | **MANDATORY** — securityContext, resources, probes |
| 10. Final Report | Summary table with issue categories |

### Quick Local Validation

```bash
bash scripts/validate_chart_structure.sh <chart>
helm lint <chart> --strict
helm template release <chart> --debug --output-dir ./rendered
find ./rendered -name "*.yaml" -exec yamllint -c assets/.yamllint {} +
find ./rendered -name "*.yaml" -exec kubeconform -summary -verbose {} +
```

### Issue Categories

- **❌ Errors (must fix):** Template syntax, missing required fields, schema failures
- **⚠️ Warnings (should fix):** Deprecated APIs, missing securityContext, `:latest` tag
- **ℹ️ Info:** Missing values.schema.json, optimization opportunities

## Security Check

Verify these for every workload:
- `securityContext` set (runAsNonRoot, readOnlyRootFilesystem)
- Resource limits defined (CPU, memory)
- Liveness and readiness probes present
- No `:latest` image tags
- Secrets not hardcoded in templates

## Best Practices

1. Semantic versioning for chart and app versions
2. Document all values in values.yaml with comments
3. Use template helpers for repeated logic
4. Pin dependency versions explicitly
5. Use conditions for optional resources
6. Follow naming conventions (lowercase, hyphens)
7. Include NOTES.txt with usage instructions
8. Add consistent labels using helpers
9. Test installations in all environments

## Troubleshooting

```bash
helm template my-app ./my-app --debug
helm dependency update && helm dependency list
helm install my-app ./my-app --dry-run --debug
kubectl get events --sort-by='.lastTimestamp'
```

## Reference Files

### Scaffolding References

| Reference | Purpose |
|-----------|---------|
| [references/workflow-guide.md](references/workflow-guide.md) | Complete 10-step workflow |
| [references/chart-templates.md](references/chart-templates.md) | Full template examples |
| [references/chart-structure.md](references/chart-structure.md) | Chart structure guide |
| [references/chart-metadata-and-layout.md](references/chart-metadata-and-layout.md) | Chart files, values, and template placement |
| [references/chart-lifecycle-and-distribution.md](references/chart-lifecycle-and-distribution.md) | Dependencies, CRDs, hooks, tests, and packaging |
| [references/metadata-and-selectors.md](references/metadata-and-selectors.md) | Labels, selectors, and metadata hygiene |
| [references/workload-safety.md](references/workload-safety.md) | Resources, probes, and security context defaults |

### Validation References

| Reference | Purpose |
|-----------|---------|
| [references/validation-stages.md](references/validation-stages.md) | Detailed Stage 1-10 workflow |
| [references/templating-best-practices.md](references/templating-best-practices.md) | Helm templating patterns |
| [references/error-handling.md](references/error-handling.md) | Error handling and debugging |
| [references/chart-testing.md](references/chart-testing.md) | Chart testing and automation |
| [references/helm_best_practices.md](references/helm_best_practices.md) | Helm best practices |
| [references/k8s_best_practices.md](references/k8s_best_practices.md) | K8s YAML best practices |
| [references/template_functions.md](references/template_functions.md) | Template function reference |
### Additional Resources

- [Chart.Yaml](assets/Chart.yaml.template)
- [Values.Yaml](assets/values.yaml.template)

| File | Path |
|------|------|
| [Detect Crd](scripts/detect_crd.py) | `scripts/detect_crd.py` |
| [Detect Crd Wrapper](scripts/detect_crd_wrapper.sh) | `scripts/detect_crd_wrapper.sh` |
| [Generate Helpers](scripts/generate_helpers.sh) | `scripts/generate_helpers.sh` |
| [Validate Chart](scripts/validate-chart.sh) | `scripts/validate-chart.sh` |
