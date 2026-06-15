# Cloud and Infrastructure Security

Use this page as the route into the cloud security checklist. Split references keep the operational guidance short enough to use during a review or deployment read-through.

## When to Load It

- cloud deployment reviews
- IAM and secrets design
- CI or CD hardening
- network exposure checks
- logging, monitoring, and recovery readiness

## Reference Map

- [IAM and secrets](iam-and-secrets.md)
- [Network and observability](network-and-observability.md)
- [Pipeline and edge security](pipeline-and-edge-security.md)
- [Backup and recovery](backup-and-recovery.md)

## Fast Review Questions

- Are privileged identities using roles and MFA instead of long-lived credentials?
- Are secrets stored in a managed secrets system with rotation and auditability?
- Are public entry points intentionally exposed, or merely left open by default?
- Are logs, alerts, and backups configured before production traffic starts?
