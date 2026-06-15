# Terraform State Operations and Security

This reference covers the operations that are easy to misuse: imports, state
manipulation, backend migration, and state protection.

## Import and Inspection

```bash
terraform import aws_vpc.main vpc-12345678
terraform import module.network.aws_vpc.main vpc-12345678

terraform state list
terraform state show aws_vpc.main
```

Use imports to adopt existing resources deliberately. Review the generated plan
immediately after the import.

## Migration and Reconfiguration

```bash
terraform init -migrate-state
terraform init -reconfigure
terraform init -backend-config=new-backend.hcl -migrate-state
```

Run state migration in a controlled window and confirm no parallel applies are
running.

## Lock Management

```bash
terraform force-unlock LOCK_ID
```

Only force-unlock when you have confirmed the original run is dead. Treat it as
an incident step, not a normal repair pattern.

## Encryption and Access Control

```hcl
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

```hcl
resource "aws_s3_bucket_policy" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = var.state_access_role_arns
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket",
        ]
        Resource = [
          aws_s3_bucket.terraform_state.arn,
          "${aws_s3_bucket.terraform_state.arn}/*",
        ]
      }
    ]
  })
}
```

## Rules

- Limit state access to the small set of roles that actually run Terraform.
- Encrypt state at rest and prefer platform-native identity over long-lived
  credentials.
- Review state changes after every import or migration step.
