# Authentication

Use this reference for the baseline controls expected in application authentication flows.

## Core Controls

- password hashing with an adaptive algorithm
- short-lived access tokens and explicit refresh handling
- server-side auth middleware and authorization checks
- rate limiting and account lockout on repeated failure
- MFA where the risk profile requires it

## Good Defaults

| Control | Baseline |
|---------|----------|
| Password hashing | adaptive hash, tuned cost |
| Access token lifetime | short |
| Refresh token lifetime | longer, revocable |
| Failed login handling | bounded retries + lockout |

## Rule

Authentication logic should fail closed. Keep identity proof, session issuance, and authorization checks explicit rather than hidden inside convenience helpers.
