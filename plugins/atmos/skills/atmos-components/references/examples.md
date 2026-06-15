# Component Configuration Examples

Use these examples as concrete starting points for catalog defaults, stack overrides, and inheritance-driven composition.

## VPC Component

Catalog default:

```yaml
components:
  terraform:
    vpc/defaults:
      metadata:
        type: abstract
        component: vpc
      vars:
        enabled: true
        vpc_flow_logs_log_destination_type: s3
        ipv4_primary_cidr_block: 10.0.0.0/18
```

Dev override:

```yaml
components:
  terraform:
    vpc:
      metadata:
        inherits: [vpc/defaults]
      vars:
        nat_gateway_enabled: false
        max_subnet_count: 2
```

## EKS Component

Use catalog defaults plus region or environment overrides for node groups and networking. Blue-green cluster creation works well with template-generated component names when both clusters need to coexist temporarily.

## S3 and IAM Components

Typical patterns:

- abstract bucket defaults, then instance-specific overrides for assets or state
- abstract IAM role defaults, then real roles for EKS, CI, or application workloads

## Composition Rule

Treat catalog defaults as the abstract baseline and stack files as the place for environment-specific deltas, not full redefinitions.
