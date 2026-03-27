# Terraform Policy and Lint Checks

This reference covers the policy and hygiene checks that should sit beside plan
and apply tests.

## OPA and Conftest

```rego
package terraform.analysis

deny[msg] {
  some resource
  resource := input.resource_changes[_]
  resource.type == "aws_s3_bucket"
  not resource.change.after.tags.Environment
  msg := "missing Environment tag on aws_s3_bucket"
}
```

```bash
terraform plan -out=tfplan
terraform show -json tfplan > tfplan.json

opa eval -i tfplan.json -d policy.rego "data.terraform.analysis.deny"
conftest test tfplan.json --namespace terraform.analysis
```

Use policy checks for cross-cutting controls like tagging, encryption, and
public exposure limits.

## TFLint

```bash
tflint --init
tflint
tflint --config=.tflint.hcl
tflint --recursive
```

```hcl
plugin "terraform" {
  enabled = true
  preset  = "recommended"
}

rule "terraform_unused_declarations" {
  enabled = true
}

rule "aws_s3_bucket_encryption" {
  enabled = true
}
```

## Rules

- Run policy checks against plan JSON, not only raw `.tf` files.
- Keep lint and policy rules deterministic enough for CI.
- Document any intentionally disabled rules in the repo, not only in pipeline
  config.
