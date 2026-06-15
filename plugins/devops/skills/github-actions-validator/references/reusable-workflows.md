# Reusable Workflows

Check:

- `workflow_call` exists
- inputs have correct types
- required secrets are declared
- outputs point to real step outputs

```yaml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
```

Common failures:

- wrong input types
- missing secret declarations
- broken output references
