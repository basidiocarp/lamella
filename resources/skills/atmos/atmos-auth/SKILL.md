---
name: atmos-auth
description: "Configures Atmos authentication, identities, keyrings, and chained sessions."
origin: lamella
---

# Atmos Authentication and Identity Management

Use this skill when configuring Atmos providers, identities, keyring storage, or chained auth flows across AWS, GCP, and Azure.

## When to Use

- Setting up provider auth in `atmos.yaml`
- Choosing between SSO, SAML, OIDC, ADC, or WIF
- Designing identity chaining for roles or projects
- Debugging login, session, or profile behavior

## Core Model

| Layer | Purpose |
|-------|---------|
| Providers | upstream auth systems |
| Identities | roles, permission sets, or projects derived from providers |
| Keyring | local secure credential storage |
| Integrations | client-side credential materialization such as ECR login |

## Core Workflow

1. Define the provider.
2. Define identities or chains that sit on top of it.
3. Choose the keyring backend.
4. Add profiles or integrations only after the auth path works.
5. Validate login, exec, and session inspection paths.

## References

- [references/provider-types.md](references/provider-types.md)
- [references/provider-auth-flows.md](references/provider-auth-flows.md)
- [references/providers-and-identities.md](references/providers-and-identities.md)
- [references/identity-types.md](references/identity-types.md)
- [references/identity-chaining-and-ci.md](references/identity-chaining-and-ci.md)
- [references/login-and-identity-flags.md](references/login-and-identity-flags.md)
- [references/session-inspection.md](references/session-inspection.md)
- [references/commands-reference.md](references/commands-reference.md)
