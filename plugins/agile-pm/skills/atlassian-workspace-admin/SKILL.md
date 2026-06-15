---
name: atlassian-workspace-admin
description: "Administers Atlassian workspaces, permissions, security controls, and lifecycle operations."
origin: lamella
---
# Atlassian Workspace Admin

Use this skill for Atlassian administration work that sits outside normal product-planning workflows: access changes, permission reviews, security hardening, workspace governance, and lifecycle operations.

## Reference Files

| File | Purpose |
|------|---------|
| [references/admin-checklists.md](references/admin-checklists.md) | User lifecycle, group review, app review, and change-management checklists |
| [references/access-governance.md](references/access-governance.md) | Security and governance baseline for Atlassian Cloud |
| [assets/permission_scheme_template.json](assets/permission_scheme_template.json) | Sample permission scheme layout for audits and reviews |

## When to Use

- Provision or deprovision Atlassian users
- Review Jira or Confluence group-based access
- Audit permission schemes for direct-user grants or broad admin access
- Plan SSO, MFA, API token, or audit-log controls
- Review marketplace app risk before enabling it
- Document an Atlassian admin change with verification and rollback notes

## Workflow

### 1. Bound the request

Confirm the exact Atlassian surface:

- product: Jira, Confluence, Bitbucket, or organization-level admin
- environment: production, sandbox, or test
- change type: access, permissions, authentication, app install, or audit
- urgency: routine admin task, compliance review, or incident response

If the request is actually about team process or product scope, hand off to the relevant Agile PM skill instead of treating it as an admin task.

If the request is about Jira project workflows, JQL, dashboards, or Confluence space design rather than admin controls, use `jira-project-operations` or `confluence-knowledge-ops`.

### 2. Prefer group-based changes

Avoid direct user grants unless there is a short-lived exception with an owner and expiry. Prefer:

- organization groups
- team or project groups
- documented role mappings
- explicit review cadence

Use `references/admin-checklists.md` for lifecycle steps and review standards.

### 3. Audit before changing

Inspect the current state before proposing changes:

- current group membership
- current permission scheme or space permission state
- owned content or admin responsibilities
- downstream impact on automations, dashboards, and integrations

If the task is a permission review, run the bundled audit script first:

```bash
python scripts/permission_audit.py permissions.json
python scripts/permission_audit.py permissions.json --format json
```

### 4. Plan the change

Write the proposed change in terms of:

- who is affected
- what access or configuration changes
- what verification proves success
- what rollback path exists
- what must be documented after completion

Keep the plan short enough to execute and verify in one pass.

### 5. Apply and verify

After the change:

- verify access or restriction with the affected account or a test account
- confirm group or permission state matches the plan
- review audit logs where available
- note any follow-up review date for temporary access or sensitive changes

### 6. Record the outcome

Capture:

- request source or ticket
- scope of change
- verification evidence
- rollback or recovery notes
- follow-up owners for temporary access, quarterly review, or compliance evidence

## Common Tasks

### User lifecycle

- onboarding
- role or group changes
- contractor expiry
- offboarding and ownership transfer

Use `references/admin-checklists.md` for the step-by-step checklist.

### Security baseline

- SSO and MFA enforcement
- API token hygiene
- admin group minimization
- audit log review
- app-install review

Use `references/access-governance.md` for the baseline.

### Permission scheme review

Use the script plus `assets/permission_scheme_template.json` when you need to:

- spot direct user grants
- find over-privileged groups
- review delete or admin permissions
- compare schemes for drift

## Boundaries

This skill is for administration and governance. Do not use it as a substitute for:

- writing PRDs
- backlog refinement notes
- stakeholder mapping
- Jira issue triage inside a delivery workflow
- Confluence information architecture work

If the user needs planning artifacts rather than admin operations, route to the relevant Agile PM skill.
