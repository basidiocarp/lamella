---
name: secrets-management
description: "Implements secure secrets management for CI/CD and cloud platforms."
origin: lamella
---

# Secrets Management

Protect credentials without turning the deployment pipeline into a long-lived secret distribution channel.

## When to Use

- storing API keys, DB credentials, or certificates
- moving CI or CD away from hardcoded secrets
- rotating secrets and reducing blast radius
- choosing between Vault, cloud secret stores, or CI-native secret features

## Core Rules

1. Never commit secrets to Git.
2. Prefer short-lived credentials over static credentials.
3. Give workloads the minimum secret scope they need.
4. Log secret access events, not secret values.
5. Plan rotation before the first production deploy.

## Workflow

1. Choose the secret system that matches the platform.
2. Decide how workloads authenticate to that system.
3. Inject secrets only at runtime or deploy time.
4. Validate logging, masking, and rotation behavior.
5. Add scanning so committed secrets fail fast.

## Reference Map

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Vault workflows | [references/vault-workflows.md](references/vault-workflows.md) | Vault auth, CI integration, policy design |
| Cloud secret stores | [references/cloud-secret-stores.md](references/cloud-secret-stores.md) | AWS, Azure, GCP, or cloud-native retrieval |
| CI platform secrets | [references/ci-platform-secrets.md](references/ci-platform-secrets.md) | GitHub Actions, GitLab CI, environment secrets |
| Rotation and scanning | [references/rotation-and-scanning.md](references/rotation-and-scanning.md) | Rotation plans, ESO, secret scanning, auditability |

## Quick Decision Guide

- Multi-cloud or on-prem with dynamic credentials: use Vault.
- AWS-native workloads with managed rotation: use Secrets Manager.
- Azure-native workloads: use Key Vault.
- GCP-native workloads: use Secret Manager.
- CI-native secrets are acceptable for small deployments, but not as the final answer for complex rotation or cross-environment sharing.

## Success Criteria

- No secrets in source, docs, logs, or example payloads.
- Workloads authenticate with roles, identities, or short-lived tokens.
- Rotation is documented and testable.
- Secret scanning exists in pre-commit or CI.
