# Containers, Matrix, and Concurrency

## Container Jobs

Check:

- valid image tags
- service container health assumptions
- networking assumptions between job and services

## Matrix

Matrix values must be arrays, and include or exclude rules should be deliberate rather than emergent.

## Concurrency

Use concurrency groups when duplicate runs waste compute or produce deploy contention.

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true
```

Review for:

- concurrency groups that are too broad
- container jobs missing required tools
- matrix expansion that overwhelms runners
