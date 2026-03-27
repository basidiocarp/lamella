# Terraform Module Patterns

Use this reference when you need a reusable Terraform module shape, a safe
composition pattern, or a compact example that can be copied into a new module.

## Standard Module Layout

```text
terraform-aws-vpc/
├── main.tf
├── variables.tf
├── outputs.tf
├── versions.tf
├── README.md
├── examples/
│   └── complete/
│       └── main.tf
└── tests/
    └── vpc.tftest.hcl
```

Keep the root of the module small. Break large modules into focused files such
as `subnets.tf` or `security-groups.tf`, but keep inputs and outputs easy to
scan.

## Minimal Reusable Module

**main.tf**

```hcl
resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = var.enable_dns_hostnames
  enable_dns_support   = var.enable_dns_support

  tags = merge(var.tags, {
    Name = var.name
  })
}

resource "aws_subnet" "private" {
  for_each = var.private_subnets

  vpc_id            = aws_vpc.main.id
  cidr_block        = each.value.cidr_block
  availability_zone = each.value.availability_zone

  tags = merge(var.tags, {
    Name = "${var.name}-private-${each.key}"
    Tier = "private"
  })
}
```

**variables.tf**

```hcl
variable "name" {
  description = "Name prefix for created resources"
  type        = string

  validation {
    condition     = length(var.name) >= 3
    error_message = "name must be at least three characters."
  }
}

variable "cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "private_subnets" {
  description = "Private subnet definitions keyed by logical name"
  type = map(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "enable_dns_hostnames" {
  description = "Whether to enable private DNS hostnames"
  type        = bool
  default     = true
}

variable "enable_dns_support" {
  description = "Whether to enable DNS resolution in the VPC"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Common tags applied to all taggable resources"
  type        = map(string)
  default     = {}
}
```

**outputs.tf**

```hcl
output "vpc_id" {
  description = "ID of the created VPC"
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  description = "IDs of private subnets keyed by logical name"
  value       = { for key, subnet in aws_subnet.private : key => subnet.id }
}

output "private_subnet_cidrs" {
  description = "CIDR blocks of private subnets keyed by logical name"
  value       = { for key, subnet in aws_subnet.private : key => subnet.cidr_block }
}
```

**versions.tf**

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

## Module Composition

Use parent modules to wire focused child modules together instead of building
one oversized root module.

```hcl
module "network" {
  source = "./modules/vpc"

  name            = "${var.project}-${var.environment}"
  cidr_block      = var.vpc_cidr
  private_subnets = var.private_subnets
  tags            = local.common_tags
}

module "security" {
  source = "./modules/security-group"

  name        = "${var.project}-${var.environment}-web"
  vpc_id      = module.network.vpc_id
  ingress_tcp = [80, 443]
  tags        = local.common_tags
}
```

## Dynamic and Conditional Patterns

Use `dynamic` for repeated nested blocks and `for_each` for repeated resources.
Use conditionals for optional resources, but keep them obvious.

```hcl
resource "aws_security_group" "web" {
  name   = "${var.name}-web"
  vpc_id = var.vpc_id

  dynamic "ingress" {
    for_each = var.ingress_rules

    content {
      description = ingress.value.description
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = "tcp"
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}

resource "aws_nat_gateway" "main" {
  count = var.enable_nat_gateway ? 1 : 0

  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public["a"].id

  tags = merge(var.tags, {
    Name = "${var.name}-nat"
  })
}
```

## Versioning and Consumer Usage

Pin published modules by version. Pin local modules by relative path.

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name = "prod-network"
  cidr = "10.0.0.0/16"
}
```

Provide one complete example under `examples/complete` that consumers can run
without guessing missing inputs.

```hcl
module "vpc_under_test" {
  source = "../.."

  name       = "example-vpc"
  cidr_block = "10.10.0.0/16"
  private_subnets = {
    a = {
      cidr_block        = "10.10.1.0/24"
      availability_zone = "us-east-1a"
    }
  }
}

output "vpc_id" {
  value = module.vpc_under_test.vpc_id
}
```

## Checklist

- Keep each module focused on one resource boundary or capability.
- Validate important inputs, especially names, CIDRs, and feature flags.
- Prefer `for_each` over `count` when resources have stable identities.
- Publish one complete example and one test path for every reusable module.
- Keep provider configuration in the caller, not inside a reusable child module.
