---
name: google-workspace-operations
description: "Operates Google Workspace with Gmail, Drive, Calendar, and Sheets."
origin: lamella
---
# Google Workspace Operations

Use this skill when the user wants to work against Google Workspace through the `gws` CLI rather than the browser UI.

## Reference Files

| File | Purpose |
|------|---------|
| [references/gws-command-reference.md](references/gws-command-reference.md) | Core `gws` commands across Gmail, Drive, Sheets, Calendar, and Admin surfaces |
| [references/troubleshooting.md](references/troubleshooting.md) | Installation, auth, scope, and rate-limit troubleshooting |

## When to Use

- install or verify the `gws` CLI
- set up OAuth or service-account authentication
- automate Gmail, Drive, Calendar, or Sheets work
- audit Workspace sharing, OAuth apps, or admin posture
- inspect JSON output from `gws` commands and turn it into tables or summaries

## Workflow

### 1. Confirm the operating mode

Figure out:

- interactive local use or service-account automation
- which Google Workspace services are in scope
- whether the user needs setup, day-to-day automation, or a security audit

### 2. Verify the local tool first

Run the doctor before assuming the CLI or auth is healthy:

```bash
python3 scripts/gws_doctor.py
python3 scripts/gws_doctor.py --json
```

### 3. Set up or repair authentication

For Bash or Zsh:

```bash
export GWS_CLIENT_ID=your-client-id
export GWS_CLIENT_SECRET=your-client-secret
gws auth setup
```

For PowerShell:

```powershell
$env:GWS_CLIENT_ID = "your-client-id"
$env:GWS_CLIENT_SECRET = "your-client-secret"
gws auth setup
```

Use the helper when the user needs guided setup or validation:

```bash
python3 scripts/auth_setup_guide.py --guide oauth
python3 scripts/auth_setup_guide.py --validate --json
```

### 4. Keep command flows small and inspectable

Prefer a direct `gws` command first, then post-process JSON if needed.

```bash
gws drive files list --json --limit 20 | python3 scripts/output_analyzer.py --select "name,mimeType,modifiedTime" --format table
```

When the user is on PowerShell, avoid shell pipes that assume Unix tooling. Prefer one command at a time or redirect JSON to a file and inspect that file with the helper script.

### 5. Run audits before proposing admin changes

For sharing, OAuth grants, or admin posture, run:

```bash
python3 scripts/workspace_audit.py
python3 scripts/workspace_audit.py --json
```

Use the findings to propose:

- the risk
- the narrowest safe remediation
- the verification step
- the rollback or follow-up review

### 6. Hand off when needed

This skill is for Google Workspace CLI operations. If the user needs:

- Jira or Confluence administration, use `atlassian-workspace-admin`
- Jira project configuration, use `jira-project-operations`
- Confluence space structure, use `confluence-knowledge-ops`

## Common Deliverables

- setup checklist for `gws`
- auth troubleshooting steps
- Google Workspace audit summary
- command snippets for Gmail, Drive, Sheets, or Calendar work
- cleaned table or CSV output from `gws` JSON

## Boundaries

Do not assume the exact `gws` installation path, package source, or enabled scopes without checking the local environment first.
