# AgentCore Browser Service

Use Browser Service when an agent needs a managed browser runtime for navigation, form interaction, extraction, or screenshots without you operating the browser infrastructure yourself.

## When to Use

- Browser automation at scale
- Dynamic page extraction
- Form and workflow automation
- Screenshot capture and verification

## Core Rules

1. Keep sessions isolated and short-lived.
2. Validate destinations before navigation.
3. Reuse sessions only when it materially reduces cost or latency.
4. Treat credentials and cookies as Identity-managed data, not inline config.

## Focused References

- [session-configuration.md](session-configuration.md)
- [browser-actions.md](browser-actions.md)
- [operations-and-guardrails.md](operations-and-guardrails.md)
