# YARA-X CRX Module Reference

Use this reference when writing rules for Chrome extension packages.

## Core Checks

- validate the file is actually a CRX
- inspect extension metadata
- inspect declared permissions and host permissions
- inspect signature presence and verification state

## Practical Rule

Check `crx.is_crx` first. Then focus the rule on a small combination of risky permissions, suspicious metadata, or signature anomalies instead of trying to express the whole policy in one giant condition.
