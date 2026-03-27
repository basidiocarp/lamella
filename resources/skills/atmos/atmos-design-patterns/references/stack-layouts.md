# Stack Layouts

## Basic Layout

Good for single-region, single-account-per-stage setups:

```text
stacks/
  catalog/
    vpc/
      defaults.yaml
  deploy/
    dev.yaml
    staging.yaml
    prod.yaml
```

## Multi-Region Layout

Good when each stage spans multiple AWS regions:

```text
stacks/deploy/dev/
  us-east-2.yaml
  us-west-2.yaml
```

Use region abbreviations and a `name_template` that keeps stack names short and predictable.
