# Makefile Security Guide

Use these rules when Make targets touch credentials, shell input, or CI.

## Main Rules

- Never hardcode secrets in the Makefile.
- Prefer environment variables or external secret stores.
- Quote user-controlled variables in shell commands.
- Validate user-controlled identifiers before using them in recipes.
- Keep CI targets and local targets consistent so security checks are not bypassed in one path.
