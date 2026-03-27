# Integration Testing with Mocked Activities

Patterns for testing workflow orchestration while keeping external dependencies mocked and deterministic.

## Mocked Activity Pattern

```python
import pytest
from unittest.mock import Mock
from temporalio import activity, workflow
from temporalio.testing import WorkflowEnvironment
from temporalio.worker import Worker

mock_activity = Mock(return_value="mocked-result")

@activity.defn
async def fetch_data(value: str) -> str:
    return mock_activity(value)

@workflow.defn
class ExampleWorkflow:
    @workflow.run
    async def run(self, value: str) -> str:
        result = await workflow.execute_activity(
            fetch_data,
            value,
            start_to_close_timeout=30,
        )
        return f"processed: {result}"

@pytest.mark.asyncio
async def test_workflow_with_mocked_activity():
    env = await WorkflowEnvironment.start_time_skipping()
    try:
        async with Worker(env.client, task_queue="test", workflows=[ExampleWorkflow], activities=[fetch_data]):
            result = await env.client.execute_workflow(
                ExampleWorkflow.run,
                "input",
                id="wf-mock",
                task_queue="test",
            )
            assert result == "processed: mocked-result"
            mock_activity.assert_called_once_with("input")
    finally:
        await env.shutdown()
```

## Error Injection

Use controlled failures to verify retry and compensation paths.

```python
attempts = 0

@activity.defn
async def flaky_fetch() -> str:
    global attempts
    attempts += 1
    if attempts < 3:
        raise RuntimeError("temporary failure")
    return "success-after-retries"
```

Keep assertions on both the final result and the retry count.

## Multi-Activity Workflows

For orchestration tests:
- record activity call order in a list
- assert the final workflow output
- assert the sequence of side effects

This is the most reliable way to check sequential workflows without inspecting internal workflow state.

## Signals and Queries

Use handles to send signals and then assert on `handle.result()` or registered queries:

```python
handle = await env.client.start_workflow(...)
await handle.signal(MyWorkflow.update_status, "completed")
assert await handle.result() == "completed"
```

## Test Organization

Recommended layout:

```text
tests/
  integration/
    conftest.py
    test_order_workflow.py
    test_payment_workflow.py
  unit/
    test_order_activities.py
    test_payment_activities.py
```

## Best Practices

- mock external systems, not Temporal primitives
- verify both outcome and orchestration path
- use time skipping by default
- keep fixtures reusable but explicit
- test success, transient failure, and non-retryable failure paths
