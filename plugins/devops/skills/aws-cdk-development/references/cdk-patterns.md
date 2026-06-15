# AWS CDK Patterns and Best Practices

Use this page as the routing layer for detailed CDK guidance.

## Load Order

| Need | Reference |
| --- | --- |
| Construct naming, stack shape, and reusable construct patterns | `construct-and-naming.md` |
| IAM, secrets, and VPC guardrails | `security-and-networking.md` |
| Lambda packaging and stack testing | `lambda-and-testing.md` |
| Cost, cleanup, and common anti-patterns | `cost-and-anti-patterns.md` |

## Core Rules

- Let CDK generate names when explicit names are optional.
- Prefer reusable constructs over copy-pasted stack fragments.
- Use grant helpers and high-level constructs before dropping to raw policies.
- Treat synth output and tests as required review artifacts.
