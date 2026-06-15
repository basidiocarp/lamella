# Delivery Automation and Auth Gates

## Delivery Automation

Plan Claude to automate:

- repository setup with `gh`
- build and test commands
- CI/CD workflow triggers and status checks

## Authentication Gates

When a CLI fails because the user is not authenticated, treat that as a
checkpoint trigger, not as a manual fallback.

For the full checkpoint taxonomy and resume rules, pair this with
`checkpoints.md`.

```xml
<task type="checkpoint:human-action" gate="blocking">
  <action>Authenticate the Vercel CLI in this shell.</action>
  <verification>`vercel whoami` succeeds afterward.</verification>
  <resume-signal>Type "done" when login is complete.</resume-signal>
</task>
```
