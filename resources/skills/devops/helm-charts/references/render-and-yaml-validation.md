# Render and YAML Validation

## Helm Render Flow

- run `helm lint --strict`
- render templates with representative values
- inspect the rendered manifests before deeper validation

## YAML Checks

- validate syntax on rendered files
- fix indentation or template bugs in the chart source, not in the rendered
  output
- use targeted re-renders when debugging one template
