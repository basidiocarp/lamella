# Integration and Recovery Tests

These tests verify the full path from user request to durable outcome.

## Must-Cover Flows

- happy-path creation or update flows
- missing-resource flows
- permission-denied or blocked flows
- partial completion with resumable checkpoints
- retry or resume after network or dependency failure

## Good Assertions

- checkpoint was written after interruption
- resumed session continues from the next pending task
- duplicate writes are not produced on resume
- the agent surfaces a blocked reason instead of looping forever
