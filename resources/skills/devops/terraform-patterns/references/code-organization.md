# Terraform Code Organization

This reference covers the non-security side of Terraform discipline: reducing
duplication, naming things consistently, and keeping files easy to navigate.

## Prefer Reusable Building Blocks

### Use Modules for Repeated Infrastructure

```hcl
module "app_network" {
  source = "../modules/vpc"

  name            = "app-prod"
  cidr_block      = "10.0.0.0/16"
  private_subnets = local.private_subnets
  tags            = local.common_tags
}
```

### Use Locals for Shared Values

```hcl
locals {
  name_prefix = "${var.project}-${var.environment}"

  common_tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Project     = var.project
  }
}
```

### Use Data Sources Instead of Hardcoded IDs

```hcl
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = "t3.micro"
}
```

### Use `for_each` for Stable Identity

```hcl
resource "aws_subnet" "private" {
  for_each = var.private_subnets

  vpc_id            = aws_vpc.main.id
  cidr_block        = each.value.cidr_block
  availability_zone = each.value.availability_zone

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-private-${each.key}"
  })
}
```

## Naming Rules

- Resource blocks: `resource_type.descriptive_name`
- Variables and outputs: `snake_case`
- Lists and maps: plural names where possible
- Name tags: use a consistent `{project}-{environment}-{resource}` pattern

## File Layout

For small modules:

```text
main.tf
variables.tf
outputs.tf
versions.tf
```

For larger modules, split by concern without hiding the module shape:

```text
main.tf
variables.tf
outputs.tf
versions.tf
locals.tf
data.tf
network.tf
security-groups.tf
```

## Rules

- Keep one obvious place for inputs, outputs, and provider constraints.
- Break files by concern, not by arbitrary size alone.
- Keep examples complete enough for `terraform init` and `terraform plan`.
- Avoid generic names like `thing`, `main2`, or `resource`.
