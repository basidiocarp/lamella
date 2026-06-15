# Runbook Templates

## Deployment Runbook

- Preconditions and access requirements
- Deploy steps with expected output
- Smoke tests after rollout
- Rollback triggers and rollback steps
- Escalation and communication notes

## Incident Response Runbook

- First 5 minutes triage
- Severity decision and who owns the call
- When to invoke `incident-commander`
- Diagnosis flow: logs, metrics, recent changes
- Mitigation and restoration steps
- Stakeholder and status-page update cadence
- Post-incident follow-up

## Database Maintenance Runbook

- Backup verification
- Migration sequencing
- Lock-risk notes
- Verification queries
- Rollback or restore path

## Staleness Checks

Re-check the runbook when any of these change:

- deployment config
- CI pipelines
- schema or migration definitions
- service runtime or environment configuration

## Validation Checklist

1. Execute the commands in staging.
2. Verify expected outputs.
3. Test the rollback path.
4. Confirm ownership and escalation contacts.
5. Update the `Last verified` date.
