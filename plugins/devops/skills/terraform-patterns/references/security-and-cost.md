# Terraform Security and Cost Controls

This reference covers the practices that should be visible in Terraform code
reviews even when the stack is otherwise well organized.

## Secrets and Sensitive Values

Never store secrets in defaults, inline literals, or checked-in tfvars files.

```hcl
variable "db_password_secret_arn" {
  type = string
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = var.db_password_secret_arn
}

resource "aws_db_instance" "main" {
  identifier = "${var.project}-${var.environment}"
  password   = data.aws_secretsmanager_secret_version.db_password.secret_string
}
```

## Encryption and Least Privilege

```hcl
resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
      kms_master_key_id = aws_kms_key.data.arn
    }
  }
}
```

```hcl
data "aws_iam_policy_document" "app" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
    ]
    resources = ["${aws_s3_bucket.data.arn}/*"]
  }
}
```

## Consistent Tagging

```hcl
locals {
  required_tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Owner       = var.owner
    CostCenter  = var.cost_center
    Project     = var.project
  }
}

resource "aws_security_group" "web" {
  name   = "${var.project}-${var.environment}-web"
  vpc_id = aws_vpc.main.id
  tags   = merge(local.required_tags, { Name = "${var.project}-${var.environment}-web" })
}
```

## Cost-Aware Defaults

```hcl
locals {
  instance_type_by_environment = {
    dev  = "t3.micro"
    test = "t3.small"
    prod = "m6i.large"
  }

  multi_az_by_environment = {
    dev  = false
    test = false
    prod = true
  }
}

resource "aws_db_instance" "main" {
  instance_class    = local.instance_type_by_environment[var.environment]
  multi_az          = local.multi_az_by_environment[var.environment]
  storage_encrypted = true
}
```

## Rules

- Secrets should come from managed secret stores or secure CI injection.
- Encryption, network exposure, and IAM scope should be explicit in code.
- Required tags should be enforced centrally, not left to each resource author.
- Environment-based sizing is acceptable when the tradeoff is documented and
  production defaults remain intentional.
