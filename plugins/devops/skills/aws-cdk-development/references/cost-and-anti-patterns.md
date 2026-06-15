# Cost and Anti-Patterns

## Cost Guardrails

- size Lambda CPU and memory intentionally
- do not default every dev stack to multi-AZ or high-NAT setups
- use alarms and budgets for expensive services

## Anti-Patterns

- explicit names everywhere
- hand-written IAM with broad wildcards
- unchecked secrets in environment variables
- no synth or assertion testing before deploy

If a stack is hard to test, it is usually too entangled to maintain safely.
