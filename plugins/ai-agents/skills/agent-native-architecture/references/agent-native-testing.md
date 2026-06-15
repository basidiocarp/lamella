# Agent-Native Testing

Use this page as the routing layer for testing agent-native systems.

## Load Order

| Need | Reference |
| --- | --- |
| capability checks, parity maps, and outcome-based assertions | `capability-and-parity-tests.md` |
| end-to-end flows, blocked states, and resume or recovery checks | `integration-and-recovery-tests.md` |
| developer checklists, prompt variation, and CI wiring | `manual-and-ci-testing.md` |

## Core Rules

- Test outcomes rather than exact tool-call sequences.
- Accept reasonable variability if the user-visible result is still correct.
- Verify that the agent can do what the UI can do.
- Include blocked and partial-completion scenarios in the suite.
- Keep manual prompt variation tests alongside automated checks.

## Smells

- tests that snapshot exact wording instead of validating durable outcomes
- no parity map between UI affordances and agent capabilities
- no recovery tests for checkpointed or interrupted sessions
