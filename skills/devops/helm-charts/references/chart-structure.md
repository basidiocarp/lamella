# Helm Chart Structure Reference

Complete guide to Helm chart organization, file conventions, and best practices.

## Standard Chart Directory Structure

```
my-app/
├── Chart.yaml              # Chart metadata (required)
├── Chart.lock              # Dependency lock file (generated)
├── values.yaml             # Default configuration values (required)
├── values.schema.json      # JSON schema for values validation
// ... (21 lines trimmed)
└── files/                  # Additional files to include
    └── config/
        └── app.conf
```

## Chart.yaml Specification

### API Version v2 (Helm 3+)

```yaml
apiVersion: v2 # Required: API version
name: my-application # Required: Chart name
version: 1.2.3 # Required: Chart version (SemVer)
appVersion: "2.5.0" # Application version
description: A Helm chart for my application # Required
// ... (25 lines trimmed)
      - child: database
        parent: database
    alias: db
```

## Chart Types

### Application Chart

```yaml
type: application
```

- Standard Kubernetes applications
- Can be installed and managed
- Contains templates for K8s resources

### Library Chart

```yaml
type: library
```

- Shared template helpers
- Cannot be installed directly
- Used as dependency by other charts
- No templates/ directory

## Values Files Organization

### values.yaml (defaults)

```yaml
# Global values (shared with subcharts)
global:
  imageRegistry: docker.io
  imagePullSecrets: []

// ... (55 lines trimmed)
serviceMonitor:
  enabled: false
  interval: 30s
```

### values.schema.json (validation)

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "replicaCount": {
// ... (19 lines trimmed)
  },
  "required": ["image"]
}
```

## Template Files

### Template Naming Conventions

- **Lowercase with hyphens**: `deployment.yaml`, `service-account.yaml`
- **Partial templates**: Prefix with underscore `_helpers.tpl`
- **Tests**: Place in `templates/tests/`
- **CRDs**: Place in `crds/` (not templated)

### Common Templates

#### \_helpers.tpl

```yaml
{{/*
Standard naming helpers
*/}}
{{- define "my-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
// ... (42 lines trimmed)
{{- $tag := .Values.image.tag | default .Chart.AppVersion -}}
{{- printf "%s/%s:%s" $registry $repository $tag -}}
{{- end -}}
```

#### NOTES.txt

```
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:
// ... (14 lines trimmed)
  kubectl port-forward $POD_NAME 8080:80
  echo "Visit http://127.0.0.1:8080"
{{- end }}
```

## Dependencies Management

### Declaring Dependencies

```yaml
# Chart.yaml
dependencies:
  - name: postgresql
    version: "12.0.0"
// ... (6 lines trimmed)
        parent: database
    alias: db # Reference as .Values.db
```

### Managing Dependencies

```bash
# Update dependencies
helm dependency update

# List dependencies
helm dependency list

# Build dependencies
helm dependency build
```

### Chart.lock

Generated automatically by `helm dependency update`:

```yaml
dependencies:
  - name: postgresql
    repository: https://charts.bitnami.com/bitnami
    version: 12.0.0
digest: sha256:abcd1234...
generated: "2024-01-01T00:00:00Z"
```

## .helmignore

Exclude files from chart package:

```
# Development files
.git/
.gitignore
*.md
docs/
// ... (17 lines trimmed)
.vscode/
.idea/
*.iml
```

## Custom Resource Definitions (CRDs)

Place CRDs in `crds/` directory:

```
crds/
├── my-app-crd.yaml
└── another-crd.yaml
```

**Important CRD notes:**

- CRDs are installed before any templates
- CRDs are NOT templated (no `{{ }}` syntax)
- CRDs are NOT upgraded or deleted with chart
- Use `helm install --skip-crds` to skip installation

## Chart Versioning

### Semantic Versioning

- **Chart Version**: Increment when chart changes
  - MAJOR: Breaking changes
  - MINOR: New features, backward compatible
  - PATCH: Bug fixes

- **App Version**: Application version being deployed
  - Can be any string
  - Not required to follow SemVer

```yaml
version: 2.3.1 # Chart version
appVersion: "1.5.0" # Application version
```

## Chart Testing

### Test Files

```yaml
# templates/tests/test-connection.yaml
apiVersion: v1
kind: Pod
metadata:
// ... (9 lines trimmed)
    args: ['{{ include "my-app.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never
```

### Running Tests

```bash
helm test my-release
helm test my-release --logs
```

## Hooks

Helm hooks allow intervention at specific points:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "my-app.fullname" . }}-migration
  annotations:
    "helm.sh/hook": pre-upgrade,pre-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

### Hook Types

- `pre-install`: Before templates rendered
- `post-install`: After all resources loaded
- `pre-delete`: Before any resources deleted
- `post-delete`: After all resources deleted
- `pre-upgrade`: Before upgrade
- `post-upgrade`: After upgrade
- `pre-rollback`: Before rollback
- `post-rollback`: After rollback
- `test`: Run with `helm test`

### Hook Weight

Controls hook execution order (-5 to 5, lower runs first)

### Hook Deletion Policies

- `before-hook-creation`: Delete previous hook before new one
- `hook-succeeded`: Delete after successful execution
- `hook-failed`: Delete if hook fails

## Best Practices

1. **Use helpers** for repeated template logic
2. **Quote strings** in templates: `{{ .Values.name | quote }}`
3. **Validate values** with values.schema.json
4. **Document all values** in values.yaml
5. **Use semantic versioning** for chart versions
6. **Pin dependency versions** exactly
7. **Include NOTES.txt** with usage instructions
8. **Add tests** for critical functionality
9. **Use hooks** for database migrations
10. **Keep charts focused** - one application per chart

## Chart Repository Structure

```
helm-charts/
├── index.yaml
├── my-app-1.0.0.tgz
├── my-app-1.1.0.tgz
├── my-app-1.2.0.tgz
└── another-chart-2.0.0.tgz
```

### Creating Repository Index

```bash
helm repo index . --url https://charts.example.com
```

## Related Resources

- [Helm Documentation](https://helm.sh/docs/)
- [Chart Template Guide](https://helm.sh/docs/chart_template_guide/)
- [Best Practices](https://helm.sh/docs/chart_best_practices/)
