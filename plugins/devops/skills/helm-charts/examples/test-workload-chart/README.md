# test-workload-chart

A test Helm chart with **intentional Stage 9 security violations** for use with the `helm-validator` skill.

## Purpose

This chart exists to exercise and demonstrate the **mandatory Stage 9 Security Best Practices Check** in the `helm-validator` skill workflow. It renders a valid `Deployment` that deliberately omits every security control the skill is expected to flag.

**Do NOT deploy this chart to any environment.**

## Intentional Violations

| Violation | Location | Expected Finding |
|-----------|----------|-----------------|
| `:latest` image tag | `values.yaml` → `image.tag` | Stage 9: image tag issue |
| Missing pod-level `securityContext` | `templates/deployment.yaml` → `spec.template.spec` | Stage 9: missing `runAsNonRoot`, `runAsUser`, `fsGroup` |
| Missing container-level `securityContext` | `templates/deployment.yaml` → `spec.template.spec.containers[0]` | Stage 9: missing `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`, `capabilities.drop: [ALL]` |
| Missing `resources` block | `templates/deployment.yaml` → `spec.template.spec.containers[0]` | Stage 9: no CPU/memory limits or requests |
| Missing `livenessProbe` | `templates/deployment.yaml` → `spec.template.spec.containers[0]` | Stage 9: no liveness probe |
| Missing `readinessProbe` | `templates/deployment.yaml` → `spec.template.spec.containers[0]` | Stage 9: no readiness probe |

## Running the Validation

```bash
# From the helm-validator skill directory:

# Automated regression check (recommended)
bash test/test_stage9_workload.sh

# Manual render of the default values
helm template test-release test/test-workload-chart \
  --output-dir /tmp/workload-rendered-default

# Render pinned-tag scenario
helm template test-release test/test-workload-chart \
  -f test/test-workload-chart/values-pinned-tag.yaml \
  --output-dir /tmp/workload-rendered-pinned
```

## Expected Stage 9 Report

```
| Check | Status | Detail |
|-------|--------|--------|
| Pod securityContext | ❌ Missing | runAsNonRoot, runAsUser, fsGroup absent |
| Container securityContext | ❌ Missing | allowPrivilegeEscalation, readOnlyRootFilesystem, capabilities.drop absent |
| Resource limits/requests | ❌ Missing | No cpu/memory limits or requests defined |
| Image tag | ❌ Warning | nginx:latest — pin to a specific version |
| Liveness probe | ❌ Missing | No livenessProbe defined |
| Readiness probe | ❌ Missing | No readinessProbe defined |
```
