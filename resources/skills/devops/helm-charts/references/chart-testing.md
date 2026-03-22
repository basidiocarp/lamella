# Chart Testing & Automation

This document covers chart testing strategies and automation opportunities for Helm charts.

## Chart Testing

For comprehensive testing, use Helm test resources:

### Create Test Resources

```yaml
# templates/tests/test-connection.yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "mychart.fullname" . }}-test-connection"
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "mychart.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never
```

### Run Tests

```bash
helm test <release-name>
```

## Automation Opportunities Reference

**During Stage 10 (Final Report), list all detected automation opportunities in the summary.**

**Do NOT ask user questions or modify files. Simply list recommendations.**

### Automation Opportunities to Detect

| Missing Item | Recommendation |
|--------------|----------------|
| `_helpers.tpl` | Run: `bash scripts/generate_helpers.sh <chart>` |
| `.helmignore` | Copy from: `assets/.helmignore` |
| `values.schema.json` | Copy and customize from: `assets/values.schema.json` |
| `NOTES.txt` | Create post-install notes template |
| `README.md` | Create chart documentation |
| Repeated patterns | Extract to helper functions |

### Security Recommendations

| Issue | Recommendation |
|-------|----------------|
| Missing pod securityContext | Add `runAsNonRoot: true`, `runAsUser: 1000`, `fsGroup: 2000` |
| Missing container securityContext | Add `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`, `capabilities.drop: [ALL]` |
| Missing resource limits | Add CPU/memory limits and requests |
| Using `:latest` tag | Pin to specific image version |
| Missing probes | Add liveness and readiness probes |

### Template Improvement Recommendations

| Issue | Recommendation |
|-------|----------------|
| Using `template` instead of `include` | Replace with `include` for pipeline support |
| Missing `nindent` | Add `nindent` for proper YAML indentation |
| No default values | Add `default` function for optional values |
| Missing `required` function | Add `required` for critical values |
