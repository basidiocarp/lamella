# Terraform Provider Configuration

Use this file as the routing layer for provider setup. Load the focused
reference that matches the stack you are configuring.

## Load Order

| Need | Reference |
| --- | --- |
| AWS, Azure, or GCP provider setup and authentication | `cloud-providers.md` |
| Kubernetes and Helm provider wiring from managed clusters | `kubernetes-and-helm-providers.md` |
| Provider pinning, alias strategy, and upgrade workflow | `provider-versioning.md` |

## Core Rules

- Pin provider versions in `required_providers`.
- Keep credentials out of Terraform code and out of `*.tfvars`.
- Use aliases only when a stack genuinely needs multiple accounts, regions, or
  subscriptions.
- Keep reusable modules provider-agnostic when possible. Configure providers in
  the caller.
- Re-test plans after provider upgrades before merging them into shared stacks.

## Minimal Baseline

```hcl
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

If the stack only needs one cloud provider and one region, this file plus
`cloud-providers.md` is usually enough. Load the other references only when the
stack needs cross-provider or Kubernetes-specific wiring.
