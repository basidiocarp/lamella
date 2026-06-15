# AgentCore Gateway Deployment Strategies

Use this guide to choose how Gateway targets and credential providers are arranged across environments.

## Common Patterns

### Shared Provider

Use one credential provider across multiple gateways when the same upstream API and rotation policy apply everywhere.

### Isolated Provider

Use a provider per gateway or environment when you need hard separation and independent rotation.

### Tiered Provider

Use shared credentials in dev and test, with isolated providers in production, when you want simpler non-prod operations without sacrificing prod boundaries.

## Deployment Workflow

1. Pick the provider pattern.
2. Map each environment to its gateway identifier and provider.
3. Validate health and error-rate alarms after deployment.
4. Document rollback for both stack and credential changes.

## Guardrails

- Keep prod credentials separate.
- Record which provider each gateway depends on.
- Treat rollback of credentials as seriously as rollback of infrastructure.
