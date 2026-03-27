# Vault Workflows

Use Vault when you need centralized policy, dynamic credentials, or short-lived access tokens across multiple platforms.

## Local Setup

```bash
vault server -dev
export VAULT_ADDR=http://127.0.0.1:8200
export VAULT_TOKEN=root
vault kv put secret/database/config username=admin password=secret
```

Development mode is only for local testing. Production Vault needs real storage, auth backends, and audit configuration.

## GitHub Actions Pattern

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/vault-action@v3
        with:
          method: jwt
          url: https://vault.example.com
          role: github-actions
          secrets: |
            secret/data/prod/api key | API_KEY
            secret/data/prod/db password | DB_PASSWORD
```

## GitLab CI Pattern

```yaml
deploy:
  image: vault:latest
  script:
    - export VAULT_ADDR=https://vault.example.com:8200
    - export VAULT_TOKEN="$(vault write -field=token auth/jwt/login role=gitlab jwt=$CI_JOB_JWT)"
    - export DB_PASSWORD="$(vault kv get -field=password secret/database/config)"
    - ./deploy.sh
```

## Review Checklist

- machine auth uses OIDC, JWT, or AppRole instead of static root-like tokens
- policies are scoped per environment and per service
- audit devices are enabled
- lease duration matches the workload lifetime
