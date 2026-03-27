# Terraform Test and Terratest

This reference covers the two most common Terraform testing layers: native
Terraform tests and Go-based Terratest.

## Plan Validation

```bash
terraform init
terraform fmt -check
terraform validate
terraform plan -out=tfplan
terraform show -json tfplan | jq .
```

Useful plan variants:

```bash
terraform plan -var-file="production.tfvars"
terraform plan -var="instance_count=5"
terraform plan -refresh-only
terraform plan -destroy
```

## Terraform Test

```text
tests/
├── unit/
│   ├── vpc_test.tftest.hcl
│   └── security_group_test.tftest.hcl
└── integration/
    └── complete_test.tftest.hcl
```

```hcl
run "validate_vpc_cidr" {
  command = plan

  variables {
    name       = "test-vpc"
    cidr_block = "10.0.0.0/16"
  }

  assert {
    condition     = output.vpc_cidr_block == "10.0.0.0/16"
    error_message = "Unexpected VPC CIDR"
  }
}
```

```hcl
run "create_full_stack" {
  command = apply

  variables {
    environment = "test"
  }

  assert {
    condition     = output.vpc_id != ""
    error_message = "VPC ID should not be empty"
  }
}
```

```bash
terraform test
terraform test tests/vpc_test.tftest.hcl
terraform test -verbose
terraform test -no-cleanup
```

## Terratest

```text
tests/
├── go.mod
├── go.sum
└── vpc_test.go
```

```go
package test

import (
	"testing"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func TestVpcModule(t *testing.T) {
	t.Parallel()

	opts := &terraform.Options{
		TerraformDir: "../examples/complete",
		Vars: map[string]any{
			"name":       "test-vpc",
			"cidr_block": "10.0.0.0/16",
		},
	}

	defer terraform.Destroy(t, opts)
	terraform.InitAndApply(t, opts)

	vpcCIDR := terraform.Output(t, opts, "vpc_cidr_block")
	assert.Equal(t, "10.0.0.0/16", vpcCIDR)
}
```

```bash
cd tests
go test -v -timeout 30m
```

## Rules

- Use native `terraform test` for module assertions that do not need external
  SDK checks.
- Use Terratest when validation needs real cloud APIs, deeper orchestration, or
  richer setup/teardown control.
- Keep one fast verification path for CI and one deeper path for release gates.
