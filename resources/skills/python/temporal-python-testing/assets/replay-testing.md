# Replay Testing for Determinism and Compatibility

Use replay testing to prove that workflow code changes remain compatible with recorded execution histories. This is the highest-signal safety check before deploying workflow logic changes.

## What Replay Testing Proves

1. Temporal replays the recorded event history against current workflow code.
2. Matching decisions mean the code is still deterministic for that history.
3. Divergence means the change is unsafe for in-flight workflows.

## Minimal Replay Pattern

```python
from temporalio.api.history.v1 import History
from temporalio.worker import Replayer

async def test_replay_from_file():
    with open("workflow_histories/order-123.pb", "rb") as f:
        history = History.FromString(f.read())

    replayer = Replayer(workflows=[OrderWorkflow])
    await replayer.replay_workflow(history)
```

## When to Run It

- Before deploying workflow code changes
- After refactors touching workflow branching or timers
- During version migrations
- In CI for representative production histories

## Common Non-Deterministic Patterns

| Unsafe | Safe Replacement |
|--------|------------------|
| `random.randint()` | `workflow.random().randint()` |
| `datetime.now()` | `workflow.now()` |
| Direct network or DB call in workflow code | Activity call |
| Changing command ordering without version guards | `workflow.get_version()` migration path |

## Suggested Workflow

1. Export representative histories from production or staging.
2. Replay them against the proposed code.
3. Fail the build on any replay mismatch.
4. Use `workflow.get_version()` when behavior must evolve safely.

## Common Failure Shape

```text
WorkflowNonDeterministicError: Workflow command mismatch
Expected: ScheduleActivityTask(activity_id='activity-1')
Got: ScheduleActivityTask(activity_id='activity-2')
```

This usually means the workflow changed command order, timing, branching, or direct side effects.

## Additional Resources

- Replay Testing: docs.temporal.io/develop/python/testing-suite#replay-testing
- Workflow Versioning: docs.temporal.io/workflows#versioning
- Determinism Guide: docs.temporal.io/workflows#deterministic-constraints
- CI/CD Integration: github.com/temporalio/samples-python/tree/main/.github/workflows
