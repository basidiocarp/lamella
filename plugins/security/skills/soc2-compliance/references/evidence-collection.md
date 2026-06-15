# SOC 2 Evidence Collection

Auditors care about more than existence. Evidence should also show consistency and timing.

## Evidence Quality

- Relevant: directly tied to the control
- Reliable: system-generated or independently reviewable
- Timely: inside the audit or observation period
- Sufficient: enough samples for the control frequency
- Complete: representative of the actual population

## Evidence by Control Area

| Area | Typical Type I Evidence | Typical Type II Evidence |
|------|-------------------------|--------------------------|
| Access management | IAM policies, role matrix, MFA configuration | provisioning tickets, deprovisioning samples, access review sign-offs |
| Change management | policy, deployment workflow, approval process | change tickets, reviews, test evidence, deployment logs |
| Incident response | incident plan, classification guide | incident tickets, tabletop exercises, postmortems, communication records |
| Vulnerability management | scanning schedule, remediation policy | scan reports across the period, patch records, SLA adherence |
| Backup and recovery | backup policy, recovery plan | backup logs, restore tests, DR exercise results |
| Monitoring and logging | logging policy, alert rules | alert history, uptime reports, monitoring dashboards |
| Vendor management | vendor inventory, assessment process | vendor assessments, SOC reports, review records |

## Sampling Expectations

As control frequency rises, the sample burden rises with it.

| Control Frequency | Typical Sample Size |
|-------------------|---------------------|
| Annual | 1 |
| Quarterly | 2 to 4 |
| Monthly | 2 to 5 |
| Weekly | 5 to 15 |
| Daily | 20 to 40 |

## Repository Structure

```text
evidence/
└── 2026-type2/
    ├── access-management/
    ├── change-management/
    ├── incident-response/
    ├── vulnerability-management/
    ├── policies/
    └── vendor-management/
```

## Automation Pattern

1. Define the evidence expected for each control.
2. Map each control to a system of record.
3. Collect recurring evidence on a schedule.
4. Store it with dates and clear filenames.
5. Track missing evidence before the auditor does.

## Common Failure Modes

- screenshots without dates
- policies with no version history
- reviews without sign-off
- evidence outside the observation window
- missing exception documentation
