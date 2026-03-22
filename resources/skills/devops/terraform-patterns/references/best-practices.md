# Terraform Best Practices

## DRY Principles

**Use Modules for Reusability**
```hcl
# Bad - Repeated code
resource "aws_vpc" "app1" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "app1-vpc", Environment = "prod" }
// ... (21 lines trimmed)
  cidr_block = "10.1.0.0/16"
  environment = "prod"
}
```

**Use Locals for Repeated Values**
```hcl
locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Project     = var.project_name
// ... (13 lines trimmed)
  cidr_block = local.vpc_cidr
  tags       = merge(local.common_tags, { Name = "${local.name_prefix}-vpc" })
}
```

**Use Data Sources Instead of Hardcoding**
```hcl
# Bad - Hardcoded AMI
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}
// ... (18 lines trimmed)
  ami           = data.aws_ami.amazon_linux_2.id
  instance_type = "t3.micro"
}
```

**Use for_each for Multiple Similar Resources**
```hcl
# Bad - Duplicated resources
resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
// ... (28 lines trimmed)
    Name = "${var.name}-private-${each.key}"
  }
}
```

## Naming Conventions

**Resource Naming**
```hcl
# Pattern: {resource_type}_{descriptive_name}

# Good examples
resource "aws_vpc" "main" {}
resource "aws_subnet" "private" {}
resource "aws_security_group" "web" {}
resource "aws_instance" "app" {}

# Avoid generic names
resource "aws_vpc" "vpc" {}          # Bad
resource "aws_subnet" "subnet" {}    # Bad
resource "aws_vpc" "this" {}         # Use in modules only
```

**AWS Resource Name Tags**
```hcl
locals {
  # Pattern: {project}-{environment}-{resource}-{identifier}
  name_prefix = "${var.project_name}-${var.environment}"
}

// ... (25 lines trimmed)
    Name = "${local.name_prefix}-web-sg"
  })
}
```

**Variable Naming**
```hcl
# Use snake_case for all names
variable "instance_type" {}      # Good
variable "instanceType" {}       # Bad
variable "InstanceType" {}       # Bad

// ... (8 lines trimmed)
# Plural for lists/maps
variable "availability_zones" {} # Good
variable "private_subnets" {}    # Good
```

**File Naming**
```
# Standard structure
main.tf           # Primary resource definitions
variables.tf      # Input variables
outputs.tf        # Output values
versions.tf       # Terraform and provider versions
backend.tf        # Backend configuration (optional)
locals.tf         # Local values (optional)
data.tf           # Data sources (optional)

# Resource-specific files for complex modules
vpc.tf
subnets.tf
security_groups.tf
route_tables.tf
```

## Security Best Practices

**Secret Management**
```hcl
# Bad - Secrets in plain text
variable "db_password" {
  default = "SuperSecret123!"  # NEVER DO THIS
}

// ... (13 lines trimmed)
resource "aws_db_instance" "main" {
  password = data.aws_secretsmanager_secret_version.db_password.secret_string
}
```

**Encryption at Rest**
```hcl
# S3 bucket with encryption
resource "aws_s3_bucket" "data" {
  bucket = "my-data-bucket"
}

// ... (22 lines trimmed)
  storage_encrypted   = true
  kms_key_id          = aws_kms_key.rds.arn
}
```

**Least Privilege IAM**
```hcl
# Bad - Overly permissive
data "aws_iam_policy_document" "bad" {
  statement {
    effect    = "Allow"
    actions   = ["*"]
// ... (24 lines trimmed)
    ]
  }
}
```

**Network Security**
```hcl
# Security group with restricted access
resource "aws_security_group" "web" {
  name        = "${var.name}-web-sg"
  description = "Security group for web servers"
  vpc_id      = aws_vpc.main.id
// ... (31 lines trimmed)
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## Resource Tagging

**Consistent Tagging Strategy**
```hcl
locals {
  # Required tags for all resources
  required_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
// ... (32 lines trimmed)
    Backup = "daily"
  })
}
```

## Cost Optimization

**Cost-Aware Resource Sizing**
```hcl
variable "environment" {
  type = string
}

locals {
// ... (21 lines trimmed)
  instance_class = local.rds_instance_class[var.environment]
  multi_az       = local.enable_multi_az
}
```

**Lifecycle Management**
```hcl
resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux_2.id
  instance_type = var.instance_type

  lifecycle {
// ... (26 lines trimmed)
    }
  }
}
```

**Resource Scheduling**
```hcl
# Auto-scaling schedule for cost savings
resource "aws_autoscaling_schedule" "scale_down_evening" {
  scheduled_action_name  = "scale-down-evening"
  min_size               = 1
  max_size               = 1
// ... (10 lines trimmed)
  recurrence             = "0 7 * * MON-FRI"
  autoscaling_group_name = aws_autoscaling_group.app.name
}
```

## Code Organization

**Directory Structure**
```
terraform/
├── environments/
│   ├── production/
│   │   ├── main.tf
│   │   ├── variables.tf
// ... (9 lines trimmed)
│   ├── iam/
│   └── route53/
└── README.md
```

**Module Best Practices**
```hcl
# Keep modules small and focused
# modules/vpc/main.tf - Does ONE thing well

# Clear input/output contracts
# modules/vpc/variables.tf
// ... (20 lines trimmed)
    }
  }
}
```

## Best Practices Checklist

- [ ] Use remote state with locking
- [ ] Pin Terraform and provider versions
- [ ] Validate all input variables
- [ ] Use consistent naming conventions
- [ ] Tag all resources for cost tracking
- [ ] Encrypt sensitive data at rest and in transit
- [ ] Implement least privilege IAM policies
- [ ] Use modules for reusable components
- [ ] Document module interfaces
- [ ] Run terraform fmt before commit
- [ ] Run terraform validate in CI/CD
- [ ] Review plan output before apply
- [ ] Use data sources instead of hardcoding
- [ ] Implement automated testing
- [ ] Use for_each instead of count
- [ ] Avoid hardcoded secrets
- [ ] Enable logging and monitoring
- [ ] Implement cost optimization strategies
- [ ] Use lifecycle rules appropriately
- [ ] Keep modules focused and single-purpose
