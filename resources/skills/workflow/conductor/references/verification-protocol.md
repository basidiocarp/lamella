# Phase Completion and Verification Protocol

Use this protocol when a Conductor phase is ready to close.

## Sequence

1. List changed files since the last checkpoint.
2. Verify tests exist for changed behavior.
3. Run the relevant automated suite.
4. Produce a short manual verification checklist.
5. Wait for explicit approval when the workflow requires it.
6. Create the checkpoint commit only after verification is complete.

## Example Checklist

```markdown
## Phase Verification
- [ ] Automated tests pass
- [ ] Coverage target is met
- [ ] Manual path is verified
```
