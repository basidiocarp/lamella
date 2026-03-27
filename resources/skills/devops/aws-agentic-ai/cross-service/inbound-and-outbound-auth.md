# Inbound and Outbound Auth

## Inbound Access

- **Gateway**: IAM, JWT, or no-auth edge case
- **Runtime**: IAM or JWT, not both simultaneously
- Prefer IAM when callers are already inside AWS

## Outbound Access

- **Gateway**: IAM, OAuth, or API key depending on target type
- **Runtime**: OAuth or API key through the Identity service
- **Memory**: IAM role access patterns
- **Identity**: Source of truth for secret-backed providers

## Rule of Thumb

Use IAM for AWS-native targets, OAuth for delegated access, and API keys only when the upstream leaves no better option.
