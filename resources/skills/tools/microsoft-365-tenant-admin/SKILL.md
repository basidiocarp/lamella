---
name: microsoft-365-tenant-admin
description: "Administers Microsoft 365 tenants, identities, licensing, and security baselines."
origin: lamella
---
# Microsoft 365 Tenant Admin

Use this skill for Microsoft 365 administration work that affects tenant setup, identity, access policy, and user lifecycle operations. The goal is to keep tenant changes bounded, reversible, and grounded in the current admin state rather than generic checklists.

## Reference Files

| File | Purpose |
|------|---------|
| [references/powershell-recipes.md](references/powershell-recipes.md) | Reusable PowerShell patterns for audit, provisioning, Conditional Access, and offboarding |
| [references/security-baseline.md](references/security-baseline.md) | Compact Microsoft 365 and Entra ID admin baseline |
| [references/troubleshooting.md](references/troubleshooting.md) | Common auth, module, permission, and tenant troubleshooting paths |

## When to Use

- reviewing a Microsoft 365 or Entra ID security baseline
- provisioning or offboarding users in bulk
- planning Conditional Access or MFA changes
- auditing licenses, guest access, or admin-role exposure
- troubleshooting Microsoft Graph or Exchange Online admin flows

## Workflow

### 1. Bound the request

Confirm:

- tenant scope and environment
- whether the work is setup, audit, lifecycle change, or troubleshooting
- the admin surface in scope: Entra ID, Exchange Online, Teams, licensing, or domain setup
- whether the change is exploratory, report-only, or ready for enforcement

### 2. Audit before changing

Check the current state first:

- current roles and privileged accounts
- MFA and Conditional Access posture
- license availability and usage-location constraints
- guest-user and inactive-user exposure

Use the recipes in `references/powershell-recipes.md` rather than writing one-off commands from memory.

### 3. Prefer safe rollout order

For identity or policy changes:

- start in report-only mode when possible
- protect break-glass accounts
- separate pilot changes from broad rollout
- keep rollback steps explicit

Use `references/security-baseline.md` for the minimum control set.

### 4. Execute the narrowest viable change

Prefer:

- group-based or role-based changes over account exceptions
- explicit verification commands
- scripts with dry-run or preview output for destructive steps

### 5. Verify and record

Capture:

- what changed
- who was affected
- how success was verified
- what to roll back if needed
- any follow-up review date

## Boundaries

- Use `tools/google-workspace-operations` for Google Workspace administration.
- Use `agile-pm/atlassian-workspace-admin` for Jira or Confluence administration.
- Do not use this skill for general office document handling; route those tasks to the document and spreadsheet tools.
