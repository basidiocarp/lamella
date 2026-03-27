# Terraform State Backends and Workspaces

This reference covers where Terraform state lives and how environments are
separated.

## S3 Backend

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "production/vpc/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

Minimal supporting resources:

```hcl
resource "aws_s3_bucket" "terraform_state" {
  bucket = "my-terraform-state"

  tags = {
    Name        = "terraform-state"
    Environment = "global"
  }
}

resource "aws_dynamodb_table" "terraform_lock" {
  name         = "terraform-state-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

## Azure Blob Backend

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfstatestorage"
    container_name       = "tfstate"
    key                  = "production.terraform.tfstate"
    use_azuread_auth     = true
  }
}
```

## GCS Backend

```hcl
terraform {
  backend "gcs" {
    bucket = "my-terraform-state"
    prefix = "production/vpc"
  }
}
```

## Backend Config Files

Use partial backend config when environments differ only by values, not by
backend type.

```hcl
terraform {
  backend "s3" {}
}
```

```hcl
# config/backend-prod.hcl
bucket         = "terraform-state-prod"
key            = "vpc/terraform.tfstate"
region         = "us-east-1"
encrypt        = true
dynamodb_table = "terraform-lock-prod"
```

```bash
terraform init -backend-config=config/backend-prod.hcl
```

## Workspaces

```bash
terraform workspace list
terraform workspace new staging
terraform workspace select production
terraform workspace show
```

Workspace-aware configuration:

```hcl
locals {
  environment = terraform.workspace

  vpc_cidr = {
    dev     = "10.0.0.0/16"
    staging = "10.1.0.0/16"
    prod    = "10.2.0.0/16"
  }[local.environment]
}
```

## Rules

- Use workspaces only when stacks remain structurally similar across
  environments.
- Prefer separate state backends or directories when environments diverge
  heavily.
- Document the state key pattern and lock backend in the repo.
