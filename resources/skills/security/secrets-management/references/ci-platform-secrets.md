# CI Platform Secrets

CI-native secrets are useful, but they are still configuration surfaces that need controls.

## GitHub Actions

Repository and environment secrets are easy to use, but environment protection rules matter just as much as the secret itself.

```yaml
deploy:
  runs-on: ubuntu-latest
  environment: production
  steps:
    - run: ./deploy.sh
      env:
        API_KEY: ${{ secrets.PROD_API_KEY }}
        DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
```

Review for:

- environment protection before secret access
- no `echo` or accidental shell tracing of secrets
- masked logs are actually enabled

## GitLab CI Variables

Protected and masked variables are the baseline:

```yaml
deploy:
  script:
    - ./deploy.sh
```

Then verify the project settings enforce:

- protected variables only on protected branches or tags
- masking for printable secrets
- file variables where certificate material or kubeconfigs are needed

## Practical Boundary

Use CI-native secrets for:

- smaller deployments
- bootstrap credentials for secret-store access
- low-frequency operational secrets

Move to Vault or cloud secret stores when rotation, auditing, or multi-environment sprawl becomes the main problem.
