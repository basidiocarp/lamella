---
name: runbook-generator
description: "Generates operational runbooks for services, deployments, maintenance, and rollback flows."
origin: lamella
---

# Runbook Generator

Use this skill to create a usable runbook fast, then tighten it with real
commands and verification steps.

## Workflow

1. Generate a baseline runbook with `scripts/runbook_generator.py`.
2. Replace placeholders with service-specific commands, URLs, and owners.
3. Add health checks after every critical step.
4. Add explicit rollback triggers, not just rollback commands.
5. Add the incident-response branch: severity trigger, first 15 minutes, and escalation path.
6. Verify the runbook in staging before treating it as production-ready.

## Commands

Print a runbook to stdout:

```bash
python3 scripts/runbook_generator.py payments-api
```

Write a runbook file:

```bash
python3 scripts/runbook_generator.py payments-api --owner platform --output docs/runbooks/payments-api.md
```

## Rules

- Keep every command copy-pasteable.
- Include expected outputs or health checks after risky steps.
- Treat contact and escalation info as data that goes stale.
- Add the trigger for when responders should switch from local triage to `incident-commander`.
- Update the runbook after incidents and major deploy changes.

## References

- `references/runbook-templates.md`
