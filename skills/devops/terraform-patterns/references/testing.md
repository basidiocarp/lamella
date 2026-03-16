# Terraform Testing Strategies

## Terraform Plan Validation

**Basic Plan Workflow**
```bash
# Initialize and validate syntax
terraform init
terraform fmt -check
terraform validate

# Plan with output
terraform plan -out=tfplan

# Show plan in JSON for automated review
terraform show -json tfplan | jq .

# Apply specific plan
terraform apply tfplan
```

**Plan with Variable Files**
```bash
# Plan with specific tfvars
terraform plan -var-file="production.tfvars"

# Plan with inline variables
terraform plan -var="instance_count=5"

# Plan with multiple var files
terraform plan \
  -var-file="common.tfvars" \
  -var-file="production.tfvars"
```

**Plan Analysis**
```bash
# Resource targeting for specific resources
terraform plan -target=aws_vpc.main

# Refresh only (check drift)
terraform plan -refresh-only

# Destroy plan
terraform plan -destroy

# Save plan output
terraform plan -out=tfplan 2>&1 | tee plan-output.txt
```

## Terraform Test (1.6+)

**Test File Structure**
```
tests/
├── unit/
│   ├── vpc_test.tftest.hcl
│   └── security_group_test.tftest.hcl
└── integration/
    └── complete_test.tftest.hcl
```

**Basic Test**
```hcl
# tests/vpc_test.tftest.hcl
run "validate_vpc_cidr" {
  command = plan

  variables {
// ... (28 lines trimmed)
    error_message = "Environment tag not set correctly"
  }
}
```

**Integration Test**
```hcl
# tests/integration/complete_test.tftest.hcl
run "create_full_stack" {
  command = apply

  variables {
// ... (15 lines trimmed)
    error_message = "VPC ID should not be empty"
  }
}
```

**Run Tests**
```bash
# Run all tests
terraform test

# Run specific test file
terraform test tests/vpc_test.tftest.hcl

# Verbose output
terraform test -verbose

# Keep test resources (for debugging)
terraform test -no-cleanup
```

## Terratest (Go-based Testing)

**Test Structure**
```
tests/
├── go.mod
├── go.sum
└── vpc_test.go
```

**go.mod**
```go
module github.com/example/terraform-modules/tests

go 1.21

require (
    github.com/gruntwork-io/terratest v0.45.0
    github.com/stretchr/testify v1.8.4
)
```

**Basic Terratest**
```go
// tests/vpc_test.go
package test

import (
    "testing"
// ... (28 lines trimmed)
    vpcCIDR := terraform.Output(t, terraformOptions, "vpc_cidr_block")
    assert.Equal(t, "10.0.0.0/16", vpcCIDR)
}
```

**Advanced Terratest with AWS SDK**
```go
package test

import (
    "testing"

// ... (40 lines trimmed)
    }
    return result
}
```

**Run Terratest**
```bash
cd tests
go mod download
go test -v -timeout 30m
```

## Policy as Code - OPA/Sentinel

**Open Policy Agent (OPA)**

**policy.rego**
```rego
package terraform.analysis

import input as tfplan

# Deny if resources are not tagged
// ... (28 lines trimmed)
    r.type == "aws_flow_log"
    r.change.after.vpc_id == vpc_id
}
```

**Run OPA Policy**
```bash
# Generate plan in JSON
terraform plan -out=tfplan
terraform show -json tfplan > tfplan.json

# Run OPA policy check
opa eval -i tfplan.json -d policy.rego "data.terraform.analysis.deny"
```

**Conftest (OPA wrapper for testing)**
```bash
# Install conftest
brew install conftest

# Test plan against policies
conftest test tfplan.json

# With specific namespace
conftest test tfplan.json --namespace terraform.analysis
```

## TFLint

**Installation and Configuration**
```bash
# Install tflint
brew install tflint

# Initialize tflint plugins
tflint --init
```

**.tflint.hcl**
```hcl
plugin "terraform" {
  enabled = true
  preset  = "recommended"
}

// ... (24 lines trimmed)
rule "aws_s3_bucket_encryption" {
  enabled = true
}
```

**Run TFLint**
```bash
# Run linter
tflint

# With specific config
tflint --config=.tflint.hcl

# Recursive (all subdirectories)
tflint --recursive

# Output format
tflint --format=json
```

## Pre-commit Hooks

**.pre-commit-config.yaml**
```yaml
repos:
  - repo: https://github.com/antonbabenko/pre-commit-terraform
    rev: v1.83.6
    hooks:
      - id: terraform_fmt
// ... (9 lines trimmed)
        args:
          - --args=--quiet
          - --args=--skip-check CKV_AWS_*
```

**Setup**
```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run manually
pre-commit run -a
```

## CI/CD Pipeline Testing

**GitHub Actions Example**
```yaml
name: Terraform Test

on: [pull_request]

jobs:
// ... (32 lines trimmed)
        with:
          directory: .
          framework: terraform
```

## Best Practices

- Run `terraform validate` before every commit
- Use `terraform test` for unit and integration tests
- Implement policy as code for security compliance
- Run TFLint in CI/CD pipelines
- Use pre-commit hooks for automated checks
- Test modules with Terratest for critical infrastructure
- Always review plan output before apply
- Test provider upgrades in isolated environments
- Document test scenarios and expected outcomes
- Automate testing in pull request workflows
