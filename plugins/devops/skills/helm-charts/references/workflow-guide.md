# Helm Chart Workflow Guide

## Standard Workflow

1. create or inspect chart structure
2. manage dependencies
3. lint and render templates
4. package or publish
5. apply environment-specific values
6. run `helm test` where available

## Core Commands

```bash
helm create my-app
helm dependency update
helm lint my-app/
helm template my-app ./my-app
helm install my-app ./my-app --dry-run --debug
helm test my-app
```

## Environment Pattern

Use:
- `values.yaml` for defaults
- `values-dev.yaml`
- `values-staging.yaml`
- `values-prod.yaml`
