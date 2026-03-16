# Terraform State Management

## Remote Backend - S3 (AWS)

**Backend Configuration**
```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "production/vpc/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"

    # Optional: Enable versioning for state file history
    versioning = true
  }
}
```

**S3 Bucket Setup**
```hcl
# State bucket with versioning and encryption
resource "aws_s3_bucket" "terraform_state" {
  bucket = "my-terraform-state"

  lifecycle {
// ... (49 lines trimmed)
    Environment = "global"
  }
}
```

## Remote Backend - Azure Blob

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfstatestorage"
    container_name       = "tfstate"
    key                  = "production.terraform.tfstate"

    # State locking is automatic with Azure Blob
    use_azuread_auth = true
  }
}
```

**Azure Storage Setup**
```hcl
resource "azurerm_resource_group" "terraform_state" {
  name     = "terraform-state-rg"
  location = "East US"
}

// ... (22 lines trimmed)
  storage_account_name  = azurerm_storage_account.terraform_state.name
  container_access_type = "private"
}
```

## Remote Backend - GCS (GCP)

```hcl
terraform {
  backend "gcs" {
    bucket = "my-terraform-state"
    prefix = "production/vpc"

    # State locking is automatic with GCS
  }
}
```

## Workspaces

**Using Workspaces**
```bash
# List workspaces
terraform workspace list

# Create new workspace
terraform workspace new staging

# Switch workspace
terraform workspace select production

# Show current workspace
terraform workspace show

# Delete workspace
terraform workspace delete dev
```

**Workspace-Aware Configuration**
```hcl
locals {
  environment = terraform.workspace

  # Environment-specific configuration
  vpc_cidr = {
// ... (29 lines trimmed)
    Environment = local.environment
  }
}
```

## Partial Backend Configuration

**Backend template**
```hcl
# backend.tf
terraform {
  backend "s3" {
    # Configuration provided via backend config file or CLI
  }
}
```

**Environment-specific backend configs**
```hcl
# config/backend-prod.hcl
bucket         = "terraform-state-prod"
key            = "vpc/terraform.tfstate"
region         = "us-east-1"
encrypt        = true
dynamodb_table = "terraform-lock-prod"
```

```bash
# Initialize with backend config
terraform init -backend-config=config/backend-prod.hcl
```

## State Operations

**Import Existing Resources**
```bash
# Import AWS VPC
terraform import aws_vpc.main vpc-12345678

# Import with module
terraform import module.network.aws_vpc.main vpc-12345678
```

**State Manipulation**
```bash
# List resources in state
terraform state list

# Show resource details
terraform state show aws_vpc.main
// ... (9 lines trimmed)

# Push local state to remote
terraform state push terraform.tfstate
```

**State Migration**
```bash
# Migrate from local to remote backend
terraform init -migrate-state

# Change backend configuration
terraform init -reconfigure

# Copy state to new backend
terraform init -backend-config=new-backend.hcl -migrate-state
```

## State Locking

**Manual Lock Management**
```bash
# Force unlock if lock is stuck (use carefully!)
terraform force-unlock LOCK_ID

# Example: terraform force-unlock a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Prevent Concurrent Modifications**
```hcl
# State locking happens automatically with supported backends
# DynamoDB for S3, automatic for Azure Blob and GCS

# Disable locking for specific operations (not recommended)
terraform apply -lock=false  # DON'T DO THIS IN PRODUCTION
```

## State File Security

**Encryption at Rest**
```hcl
# S3 bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.terraform.arn
    }
    bucket_key_enabled = true
  }
}
```

**Access Control**
```hcl
# S3 bucket policy - restrict access
resource "aws_s3_bucket_policy" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  policy = jsonencode({
// ... (17 lines trimmed)
    ]
  })
}
```

## State File Organization

```
# Recommended structure for multiple environments
terraform-state-bucket/
├── production/
│   ├── vpc/terraform.tfstate
│   ├── eks/terraform.tfstate
│   └── rds/terraform.tfstate
├── staging/
│   ├── vpc/terraform.tfstate
│   └── eks/terraform.tfstate
└── dev/
    └── vpc/terraform.tfstate
```

## Best Practices

- Always use remote state for teams
- Enable state locking to prevent conflicts
- Encrypt state files at rest and in transit
- Enable versioning for state file history
- Use separate state files per environment
- Restrict access to state buckets
- Back up state files regularly
- Never commit state files to git
- Use workspaces for similar environments only
- Document state migration procedures
