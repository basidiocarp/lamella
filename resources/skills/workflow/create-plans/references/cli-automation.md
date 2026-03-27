# CLI and API Automation

Use this page as the routing layer for automation-first planning guidance.

## Load Order

| Need | Reference |
| --- | --- |
| deployment providers and hosting automation | `deployment-platform-automation.md` |
| billing, databases, and managed service setup | `service-and-data-automation.md` |
| GitHub, builds, and auth-gate handling | `delivery-and-auth-gates.md` |

## Core Rules

- if a provider has a CLI or API, plan for Claude to use it
- human steps are for verification and unavoidable auth gates, not routine setup
- checkpoint after automation, not instead of automation
