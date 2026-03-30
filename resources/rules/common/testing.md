# Testing

Test behavior changes with the cheapest evidence that proves the claim.

## Rules

- prefer failing-test-first or regression-test-first when changing behavior
- choose the narrowest test level that proves the change
- add integration or end-to-end coverage only when unit tests cannot prove the requirement
- fix broken expectations only when the test is actually wrong
- use the `tdd-guide` skill or equivalent when the workflow matters
