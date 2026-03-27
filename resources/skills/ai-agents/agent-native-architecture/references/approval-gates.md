# Approval Gates

Use this pattern whenever the agent can touch code, dependencies, secrets, or
other risky surfaces.

## Core Separation

- `propose`: create a pending change and explain it
- `apply`: commit the pending change only after approval

## Approval Candidates

- source code under active development
- dependency manifests
- system prompts or tool schemas
- destructive operations on durable user data

## No-Gate Surfaces

Generated artifacts, low-risk notes, or draft content usually do not need the
same gate unless the product has a stricter policy.
