# Serverless Deployment Best Practices

Use this reference for shipping AWS serverless systems safely through CI/CD.

## Deployment Lifecycle

Keep the pipeline stages explicit:

```text
source -> build -> test -> deploy -> verify
```

Minimum expectations:
- code review before merge
- reproducible infrastructure definition
- automated tests before production
- post-deploy verification and rollback path

## Infrastructure as Code

Choose one IaC path per project:

```text
SAM:
- simpler serverless-only stacks
- built-in deployment preferences

CDK:
- richer abstractions
- better fit for multi-service and reusable infrastructure
```

Use separate environments for:
- dev
- staging
- production

## CI/CD Defaults

Your deployment pipeline should at minimum:
- build functions and dependencies
- validate IaC templates
- run unit and integration tests
- deploy to non-prod before prod
- gate prod with alarms and rollback hooks

## Deployment Strategies

### All-at-Once

Use only for:
- dev environments
- low-risk internal systems
- small emergency fixes with eyes-on monitoring

### Canary or Linear

Prefer these for production:

```yaml
DeploymentPreference:
  Type: Canary10Percent10Minutes
  Alarms:
    - !Ref ErrorAlarm
    - !Ref LatencyAlarm
```

Use gradual rollout when:
- traffic is real
- blast radius matters
- rollback needs a clear decision window

## Deployment Hooks

Use pre-traffic hooks to:
- sanity-check dependencies
- run smoke calls
- verify migrations or contracts

Use post-traffic hooks to:
- confirm health under live traffic
- validate business-critical actions

## Rollback and Safety

Always wire:
- CloudWatch alarms
- automatic rollback
- versioned Lambda aliases
- deployment logs you can inspect quickly

Rollback triggers should include:
- elevated error rate
- unacceptable latency
- failed pre/post-traffic checks

## Testing Layers

Before production, cover:
- unit tests for business logic
- integration tests against real AWS services where needed
- local or ephemeral environment smoke tests
- load testing for latency-sensitive paths

## Practical Checklist

```text
Use IaC, not console drift
Separate environments cleanly
Prefer canary or linear rollout in prod
Gate deploys with alarms
Use hooks for validation
Keep rollback automatic and observable
```
