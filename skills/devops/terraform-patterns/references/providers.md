# Terraform Provider Configuration

## AWS Provider

**Basic Configuration**
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
// ... (12 lines trimmed)
    }
  }
}
```

**Multiple AWS Accounts/Regions**
```hcl
provider "aws" {
  alias  = "primary"
  region = "us-east-1"

  assume_role {
// ... (21 lines trimmed)
  provider   = aws.secondary
  cidr_block = "10.1.0.0/16"
}
```

**AWS Authentication Methods**
```hcl
# Method 1: Environment variables (recommended for CI/CD)
# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN

# Method 2: Shared credentials file
provider "aws" {
// ... (18 lines trimmed)
    external_id  = var.external_id
  }
}
```

**AWS Provider Features**
```hcl
provider "aws" {
  region = "us-east-1"

  # Default tags applied to all resources
  default_tags {
// ... (21 lines trimmed)
  # HTTP proxy
  http_proxy = "http://proxy.example.com:8080"
}
```

## Azure Provider (azurerm)

**Basic Configuration**
```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
// ... (22 lines trimmed)
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
}
```

**Multiple Azure Subscriptions**
```hcl
provider "azurerm" {
  alias           = "production"
  subscription_id = var.prod_subscription_id
  tenant_id       = var.tenant_id

// ... (13 lines trimmed)
  name     = "prod-rg"
  location = "East US"
}
```

**Azure Authentication Methods**
```hcl
# Method 1: Service Principal with Client Secret
provider "azurerm" {
  features {}

  subscription_id = var.subscription_id
// ... (28 lines trimmed)

  use_cli = true
}
```

## GCP Provider

**Basic Configuration**
```hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
// ... (11 lines trimmed)
    managed_by  = "terraform"
  }
}
```

**Multiple GCP Projects**
```hcl
provider "google" {
  alias   = "production"
  project = var.prod_project_id
  region  = "us-central1"
}
// ... (8 lines trimmed)
  provider = google.production
  name     = "prod-vpc"
}
```

**GCP Authentication Methods**
```hcl
# Method 1: Service Account Key (not recommended for production)
provider "google" {
  credentials = file("service-account-key.json")
  project     = var.project_id
  region      = var.region
// ... (24 lines trimmed)
  region  = var.region
  # Automatically uses workload identity
}
```

**GCP Beta Resources**
```hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
// ... (17 lines trimmed)

  # Beta-only features here
}
```

## Kubernetes Provider

**With AWS EKS**
```hcl
data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_name
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_name
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}
```

**With GKE**
```hcl
data "google_client_config" "default" {}

data "google_container_cluster" "cluster" {
  name     = var.cluster_name
  location = var.region
}

provider "kubernetes" {
  host  = "https://${data.google_container_cluster.cluster.endpoint}"
  token = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(
    data.google_container_cluster.cluster.master_auth[0].cluster_ca_certificate
  )
}
```

## Helm Provider

```hcl
provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.cluster.token
// ... (15 lines trimmed)
    value = "LoadBalancer"
  }
}
```

## Provider Version Constraints

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
// ... (27 lines trimmed)
    }
  }
}
```

## Best Practices

- Always pin provider versions with constraints
- Use provider aliases for multi-region/account setups
- Leverage default tags for consistent resource tagging
- Use environment variables for credentials (CI/CD)
- Use IAM roles/managed identities when possible
- Never hardcode credentials in code
- Use separate providers for different environments
- Document provider requirements in README
- Test provider upgrades in non-production first
- Use official providers from HashiCorp registry
