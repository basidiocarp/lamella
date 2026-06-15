# Environments and Job Summaries

## Environments

Check:

- environment names exist
- protection rules match deployment risk
- environment secrets are scoped correctly

```yaml
jobs:
  deploy:
    environment:
      name: production
      url: https://example.com
```

## Job Summaries

`$GITHUB_STEP_SUMMARY` is useful for reports, but the summary content is runtime output, not a schema-validated workflow feature.

Review for:

- safe Markdown generation
- escaped dynamic content
- stable step output references
