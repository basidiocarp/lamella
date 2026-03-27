# Configuration Precedence and Environment Hazards

Multiple config sources create security risk when precedence is unclear.

## Watch For

- config file says secure, environment override disables it
- command-line flag silently beats both file and environment values
- secrets or toggles stored in environment variables without validation

## Guardrails

- document precedence order clearly
- warn or fail on contradictory settings
- keep high-risk debug or security toggles out of untrusted runtime overrides
- treat environment-controlled security settings as untrusted input
