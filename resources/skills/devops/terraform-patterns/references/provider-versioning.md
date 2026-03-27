# Terraform Provider Versioning

This reference covers the part of provider management that usually causes the
most drift: version constraints, aliases, and upgrades.

## Recommended Baseline

```hcl
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
  }
}
```

## Alias Strategy

Use aliases only when you need real isolation by region, account, subscription,
or cluster.

```hcl
provider "aws" {
  alias  = "primary"
  region = "us-east-1"
}

provider "aws" {
  alias  = "secondary"
  region = "us-west-2"
}

module "replica_bucket" {
  source = "./modules/bucket"

  providers = {
    aws = aws.secondary
  }

  name = "replica-logs"
}
```

## Upgrade Workflow

```bash
terraform init -upgrade
terraform validate
terraform plan
```

When provider upgrades are material, also:

- review provider changelog and breaking changes
- run plan against at least one non-production workspace
- check whether generated plans or defaults changed
- update module examples that depend on old provider behavior

## Rules

- Pin every provider the stack relies on.
- Keep constraints in `required_providers`, not scattered through comments.
- Upgrade intentionally; do not absorb provider bumps accidentally in unrelated
  change sets.
