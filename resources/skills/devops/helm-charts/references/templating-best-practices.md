# Helm Templating Best Practices

This document covers advanced Helm templating techniques, helper functions, and automation strategies.

## Template Helpers (`_helpers.tpl`)

Template helpers are reusable functions defined in `templates/_helpers.tpl`. They promote DRY principles and consistency.

### Standard Helper Patterns

1. **Chart name helper:**
```yaml
{{/*
Expand the name of the chart.
*/}}
{{- define "mychart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
```

2. **Fullname helper:**
```yaml
{{/*
Create a default fully qualified app name.
*/}}
{{- define "mychart.fullname" -}}
// ... (9 lines trimmed)
{{- end }}
{{- end }}
```

3. **Chart reference helper:**
```yaml
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "mychart.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
```

4. **Standard labels helper:**
```yaml
{{/*
Common labels
*/}}
{{- define "mychart.labels" -}}
// ... (5 lines trimmed)
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
```

5. **Selector labels helper:**
```yaml
{{/*
Selector labels
*/}}
{{- define "mychart.selectorLabels" -}}
app.kubernetes.io/name: {{ include "mychart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
```

6. **ServiceAccount name helper:**
```yaml
{{/*
Create the name of the service account to use
*/}}
{{- define "mychart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "mychart.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
```

### When to Create Helpers

- Values used in multiple templates
- Complex logic that's repeated
- Label sets that should be consistent
- Name generation patterns
- Conditional resource inclusion

## Essential Template Functions

Reference and use these Helm template functions for robust charts:

1. **`required` - Enforce required values:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ required "A valid service name is required!" .Values.service.name }}
```

2. **`default` - Provide fallback values:**
```yaml
replicas: {{ .Values.replicaCount | default 1 }}
```

3. **`quote` - Safely quote string values:**
```yaml
env:
  - name: DATABASE_HOST
    value: {{ .Values.database.host | quote }}
```

4. **`include` - Use helpers with pipeline:**
```yaml
metadata:
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
```

5. **`tpl` - Render strings as templates:**
```yaml
{{- tpl .Values.customConfig . }}
```

6. **`toYaml` - Convert objects to YAML:**
```yaml
{{- with .Values.resources }}
resources:
  {{- toYaml . | nindent 2 }}
{{- end }}
```

7. **`fromYaml` - Parse YAML strings:**
```yaml
{{- $config := .Values.configYaml | fromYaml }}
```

8. **`merge` - Merge maps:**
```yaml
{{- $merged := merge .Values.override .Values.defaults }}
```

9. **`lookup` - Query cluster resources (use carefully):**
```yaml
{{- $secret := lookup "v1" "Secret" .Release.Namespace "my-secret" }}
{{- if $secret }}
  # Secret exists, use it
{{- else }}
  # Create new secret
{{- end }}
```

## Advanced Template Patterns

1. **Conditional resource creation:**
```yaml
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
# ... ingress definition
{{- end }}
```

2. **Range over lists:**
```yaml
{{- range .Values.extraEnvVars }}
- name: {{ .name }}
  value: {{ .value | quote }}
{{- end }}
```

3. **Range over maps:**
```yaml
{{- range $key, $value := .Values.configMap }}
{{ $key }}: {{ $value | quote }}
{{- end }}
```

4. **With blocks for scoping:**
```yaml
{{- with .Values.nodeSelector }}
nodeSelector:
  {{- toYaml . | nindent 2 }}
{{- end }}
```

5. **Named templates with custom context:**
```yaml
{{- include "mychart.container" (dict "root" . "container" .Values.mainContainer) }}
```

## Values Structure Best Practices

**Prefer flat structures when possible:**

```yaml
# Good - Flat structure
serverName: nginx
serverPort: 80

# Acceptable - Nested structure for related settings
server:
  name: nginx
  port: 80
  replicas: 3
```

**Always provide defaults in values.yaml:**
```yaml
replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
// ... (10 lines trimmed)
  requests:
    cpu: 100m
    memory: 128Mi
```

**Document all values:**
```yaml
# replicaCount is the number of pod replicas for the deployment
replicaCount: 1

# image configures the container image
image:
  # image.repository is the container image registry and name
  repository: nginx
  # image.tag overrides the image tag (default is chart appVersion)
  tag: "1.21.0"
```

## Template Comments and Documentation

Use Helm template comments for documentation:

```yaml
{{- /*
mychart.fullname generates the fullname for resources.
It supports nameOverride and fullnameOverride values.
Usage: {{ include "mychart.fullname" . }}
// ... (6 lines trimmed)
{{- end }}
{{- end }}
```

Use YAML comments for user-facing notes:

```yaml
# WARNING: Changing the storage class will not migrate existing data
storageClass: "standard"
```

## Whitespace Management

Use `-` to chomp whitespace in template directives:

```yaml
{{- if .Values.enabled }}
  # Remove leading whitespace
{{- end }}

{{ .Values.name -}}
  # Remove trailing whitespace
```

Good formatting:
```yaml
{{- if .Values.enabled }}
  key: value
{{- end }}
```

Bad formatting:
```yaml
{{if .Values.enabled}}
key: value
{{end}}
```

## Helper Patterns Reference

When analyzing charts, identify opportunities for helper functions:

1. **Identify repetition:**
   - Same label sets across resources
   - Repeated name generation logic
   - Common conditional patterns

2. **Common helper patterns to recommend:**
   - Chart name helper (`.name`)
   - Fullname helper (`.fullname`)
   - Chart version label (`.chart`)
   - Common labels (`.labels`)
   - Selector labels (`.selectorLabels`)
   - ServiceAccount name (`.serviceAccountName`)

3. **When to recommend helpers:**
   - Missing `_helpers.tpl` file
   - Repeated code patterns across templates
   - Inconsistent label usage
   - Long resource names that need truncation

## Best Practices Reference

For detailed Helm and Kubernetes best practices, load the references:

```
Read references/helm_best_practices.md
Read references/k8s_best_practices.md
```

These references include:
- Chart structure and metadata
- Template conventions and patterns
- Values file organization
- Security best practices
- Resource limits and requests
- Common validation issues and fixes

**When to load:** When validation reveals issues that need context, when implementing new features, or when the user asks about best practices.

## Working with Chart Dependencies

When a chart has dependencies (in `Chart.yaml` or `charts/` directory):

1. **Update dependencies:**
```bash
helm dependency update <chart-directory>
```

2. **List dependencies:**
```bash
helm dependency list <chart-directory>
```

3. **Validate dependencies:**
   - Check that dependency versions are available
   - Verify dependency values are properly scoped
   - Test templates with dependency resources

4. **Override dependency values:**
```yaml
# values.yaml
postgresql:
  enabled: true
  postgresqlPassword: "secret"
  persistence:
    size: 10Gi
```
