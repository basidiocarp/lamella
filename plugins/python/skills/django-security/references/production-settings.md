# Django Production Settings

Use this reference as a production-hardening checklist, not a drop-in settings
file.

## Core Rules

- `DEBUG` must be `False`
- secrets come from environment or a secret manager
- `ALLOWED_HOSTS` is explicit
- secure cookie, header, and CSRF settings are enabled
- TLS assumptions are configured correctly behind the real proxy chain

## Environment Management

Use typed environment loading for:
- secret key
- database URL
- allowed hosts
- email and cache backends

Never commit real production secrets or example `.env` values that look usable.

## Logging

Production logging should support:
- application error visibility
- security-relevant events
- enough context for incident response

Do not rely only on console defaults once the app is deployed behind real
traffic.

## Password and Auth Hardening

Keep:
- password validators
- strong session and CSRF settings
- secure cookie flags
- explicit proxy and HTTPS handling

## Design Rule

Production settings should make the insecure path hard to reach. If the app can
quietly start in a weak configuration, the settings layer is not strict enough.
