# Terraform Testing Strategies

Use this file as the routing layer for Terraform verification.

## Load Order

| Need | Reference |
| --- | --- |
| `terraform plan`, `terraform test`, and Terratest patterns | `terraform-test-and-terratest.md` |
| OPA, Conftest, and TFLint-based policy and lint checks | `policy-and-lint-checks.md` |

## Core Rules

- Validate format and syntax before any deeper test stage.
- Keep at least one fast plan-based check and one deeper infrastructure test.
- Move repeated policy checks into reusable CI steps rather than ad hoc shell.
