# Providers and Identities

Use this page as the router for Atmos auth provider and identity configuration.

## Load Order

| Need | Reference |
| --- | --- |
| provider setup for SSO, SAML, OIDC, ADC, or WIF | `provider-types.md` |
| identity setup for roles, permission sets, subscriptions, or projects | `identity-types.md` |
| chaining and CI patterns | `identity-chaining-and-ci.md` |

## Core Rules

- providers issue base credentials
- identities turn those credentials into the exact account, role, or project context you need
- design the provider first, then the identity chain
