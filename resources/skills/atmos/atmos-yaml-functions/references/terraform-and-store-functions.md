# Terraform and Store Functions

This slice covers:

- `!terraform.state`
- `!terraform.output`
- `!store`
- `!store.get`

## Rule

Use the direct state-reading path when supported, and reserve slower output
commands for backends or situations where that is genuinely required.
