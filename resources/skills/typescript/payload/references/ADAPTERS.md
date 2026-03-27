# Payload CMS Adapters Reference

Use this page to choose the adapter layer you need.

## Reference Map

| Need | Load |
|------|------|
| Database adapter selection and transaction rules | [database-adapters.md](database-adapters.md) |
| Storage and email adapter choices | [storage-and-email-adapters.md](storage-and-email-adapters.md) |

## Rule

Keep adapter-specific behavior close to the environment that owns it. Avoid mixing database transaction concerns with storage or email configuration unless the integration truly spans both.
