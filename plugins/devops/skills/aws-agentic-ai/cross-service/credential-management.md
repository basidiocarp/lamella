# Cross-Service Credential Management

Use this guide when AgentCore services need shared patterns for inbound auth, outbound credentials, rotation, and audit. Keep the high-level choices here and push implementation detail into the focused companion docs.

## Core Decision Points

| Question | Default Direction |
|----------|-------------------|
| How do services accept inbound requests? | Prefer IAM unless JWT is required |
| How do services reach external APIs? | Use Identity-managed providers, not hardcoded secrets |
| Should providers be shared? | Shared for simple estates, isolated for strict boundaries |
| How is rotation handled? | Scheduled provider updates plus audit logging |

## Core Rules

1. Never hardcode credentials in code or config files.
2. Separate credentials by environment at minimum.
3. Use least-privilege IAM roles and provider scopes.
4. Monitor failures, spikes, and access anomalies.
5. Treat rotation and rollback as first-class operational paths.

## Focused References

- [inbound-and-outbound-auth.md](inbound-and-outbound-auth.md)
- [provider-patterns.md](provider-patterns.md)
- [rotation-and-audit.md](rotation-and-audit.md)
