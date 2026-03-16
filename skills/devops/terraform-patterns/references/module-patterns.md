# Terraform Module Patterns

## Module Structure

```
terraform-aws-vpc/
├── main.tf           # Primary resource definitions
├── variables.tf      # Input variable declarations
├── outputs.tf        # Output value definitions
├── versions.tf       # Provider version constraints
├── README.md         # Module documentation
├── examples/
│   └── complete/
│       ├── main.tf
│       └── variables.tf
└── tests/
    └── vpc_test.go
```

## Basic Module Pattern

**main.tf**
```hcl
resource "aws_vpc" "this" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = var.enable_dns_hostnames
  enable_dns_support   = var.enable_dns_support

// ... (20 lines trimmed)
    }
  )
}
```

**variables.tf**
```hcl
variable "name" {
  description = "Name prefix for all resources"
  type        = string

  validation {
// ... (38 lines trimmed)
  type        = bool
  default     = true
}
```

**outputs.tf**
```hcl
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.this.id
}

// ... (11 lines trimmed)
  description = "CIDR blocks of private subnets"
  value       = { for k, v in aws_subnet.private : k => v.cidr_block }
}
```

**versions.tf**
```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

## Module Composition

```hcl
# Composite module using child modules
module "networking" {
  source = "./modules/vpc"

  name       = "production"
// ... (20 lines trimmed)
    }
  }
}
```

## Dynamic Blocks

```hcl
resource "aws_security_group" "this" {
  name   = var.name
  vpc_id = var.vpc_id

  dynamic "ingress" {
// ... (18 lines trimmed)
    }
  }
}
```

## Conditional Resources

```hcl
# Create NAT gateway only if enabled
resource "aws_nat_gateway" "this" {
  count = var.enable_nat_gateway ? 1 : 0

  allocation_id = aws_eip.nat[0].id
// ... (16 lines trimmed)
    vpc_id = aws_vpc.this.id
  }
}
```

## Module Versioning

```hcl
# Pin to specific version
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

// ... (14 lines trimmed)

  # ... configuration
}
```

## Module Testing Example

```hcl
# examples/complete/main.tf
module "vpc_test" {
  source = "../.."

  name       = "test-vpc"
// ... (12 lines trimmed)
output "vpc_id" {
  value = module.vpc_test.vpc_id
}
```

## Best Practices

- Keep modules focused and single-purpose
- Use `for_each` over `count` for resources
- Validate all inputs with validation blocks
- Document all variables and outputs
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Provide complete examples
- Test modules before publishing
- Use consistent naming conventions
- Tag all taggable resources
- Avoid hardcoded values
