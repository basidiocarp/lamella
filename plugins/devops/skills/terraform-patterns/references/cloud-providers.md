# Terraform Cloud Providers

This reference covers the standard provider shapes for AWS, Azure, and GCP,
plus the common authentication patterns that should replace hardcoded
credentials.

## AWS

### Basic Provider

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      ManagedBy   = "terraform"
      Project     = var.project
    }
  }
}
```

### Multiple Regions or Accounts

```hcl
provider "aws" {
  alias  = "primary"
  region = "us-east-1"
}

provider "aws" {
  alias  = "secondary"
  region = "us-west-2"

  assume_role {
    role_arn    = var.secondary_role_arn
    external_id = var.external_id
  }
}
```

Prefer environment credentials, SSO, or assumed roles. Do not hardcode
`access_key` or `secret_key` in Terraform code.

## Azure

### Basic Provider

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}

  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
}
```

### Multiple Subscriptions

```hcl
provider "azurerm" {
  alias           = "platform"
  features        = {}
  subscription_id = var.platform_subscription_id
  tenant_id       = var.tenant_id
}

provider "azurerm" {
  alias           = "product"
  features        = {}
  subscription_id = var.product_subscription_id
  tenant_id       = var.tenant_id
}
```

Use workload identity, managed identity, or CLI-based auth where possible.

## GCP

### Basic Provider

```hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
```

### Multiple Projects

```hcl
provider "google" {
  alias   = "shared"
  project = var.shared_project_id
  region  = var.region
}

provider "google" {
  alias   = "product"
  project = var.product_project_id
  region  = var.region
}
```

Prefer workload identity or ADC-backed authentication over shipping service
account keys with the repo.

## Authentication Checklist

- CI: use workload identity, OIDC, or platform-native federation.
- Local development: use SSO, CLI login, or shared credential helpers.
- Multi-account stacks: document which alias is bound to which account.
- Regulated environments: review default tags and audit fields at provider
  level, not only per resource.
