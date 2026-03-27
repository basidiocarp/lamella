# Helm Template Functions Reference

This reference covers the Helm and Sprig functions that most often shape chart
behavior. It is intentionally scoped to practical chart authoring, not the full
function catalog.

## Core Helm Functions

### `include`

Use `include` when you want a named template and need to pipe its output.

```yaml
metadata:
  labels:
    {{- include "mychart.labels" . | nindent 4 }}

value: {{ include "mychart.value" . | quote }}

{{- include "mychart.container" (dict "root" . "container" .Values.mainContainer) }}
```

Prefer `include` over `template` when you need indentation, quoting, or custom
composition.

### `tpl`

Use `tpl` to render a value string as a template.

```yaml
{{ tpl .Values.customConfig . }}

{{ tpl (.Files.Get "config/app.conf") . }}

server:
  host: {{ .Values.server.host }}
  port: {{ .Values.server.port }}
```

Use it sparingly. `tpl` is powerful, but it also makes values harder to reason
about.

### `required`

```yaml
metadata:
  name: {{ required "service.name is required" .Values.service.name }}

env:
  - name: API_KEY
    value: {{ required "apiKey must be provided" .Values.apiKey | quote }}
```

Use `required` only for values with no sensible default.

### `lookup`

```yaml
{{- $secret := lookup "v1" "Secret" .Release.Namespace "my-secret" }}
{{- if $secret }}
existingPassword: {{ index $secret.data "password" | quote }}
{{- end }}
```

Cautions:

- `lookup` works during install and upgrade, not plain `helm template`
- it requires cluster access
- it couples rendering to live cluster state

## String Helpers

### Quoting and Defaults

```yaml
value: {{ .Values.host | quote }}
replicas: {{ .Values.replicaCount | default 1 }}
image: {{ .Values.image.tag | default .Chart.AppVersion | quote }}
```

### Normalization

```yaml
name: {{ .Values.name | trim }}
name: {{ include "mychart.fullname" . | trunc 63 | trimSuffix "-" }}
label: {{ .Values.label | replace " " "-" | lower }}
```

Useful helpers in this category:

- `trim`, `trimPrefix`, `trimSuffix`
- `upper`, `lower`, `title`
- `trunc`
- `replace`
- `nospace`

### Predicates

```yaml
{{- if contains "prod" .Values.environment }}
  # production-only config
{{- end }}

{{- if hasPrefix "web-" .Values.name }}
  # web tier settings
{{- end }}
```

## YAML and Collection Helpers

### `toYaml` and `fromYaml`

```yaml
{{- with .Values.resources }}
resources:
  {{- toYaml . | nindent 2 }}
{{- end }}
```

```yaml
{{- $cfg := (.Files.Get "defaults.yaml" | fromYaml) }}
{{- $port := $cfg.server.port }}
```

### `dict`, `list`, `merge`

```yaml
{{- $ctx := dict "root" . "service" .Values.service }}
{{- $ports := list 80 443 }}
{{- $labels := merge .Values.commonLabels .Values.extraLabels }}
```

Use these helpers when a template needs structured local state, but stop before
the template turns into an unreadable mini-program.

## Rules

- Prefer simple helpers over nested one-liners.
- Use `include` plus `nindent` for repeated YAML blocks.
- Use `required` for critical inputs and `default` for reasonable fallbacks.
- Treat `lookup` and `tpl` as advanced tools, not the baseline chart style.
