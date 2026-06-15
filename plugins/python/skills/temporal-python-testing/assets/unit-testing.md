# Unit Testing Temporal Workflows and Activities

Focused examples for testing workflows and activities in isolation with the Python SDK.

## WorkflowEnvironment with Time Skipping

```python
import pytest
from datetime import timedelta
from temporalio import workflow
from temporalio.testing import WorkflowEnvironment
from temporalio.worker import Worker

@workflow.defn
class ReminderWorkflow:
    @workflow.run
    async def run(self) -> str:
        await workflow.sleep(timedelta(days=30))
        return "completed"

@pytest.fixture
async def workflow_env():
    env = await WorkflowEnvironment.start_time_skipping()
    yield env
    await env.shutdown()

@pytest.mark.asyncio
async def test_workflow_time_skipping(workflow_env):
    async with Worker(
        workflow_env.client,
        task_queue="test-queue",
        workflows=[ReminderWorkflow],
    ):
        result = await workflow_env.client.execute_workflow(
            ReminderWorkflow.run,
            id="wf-1",
            task_queue="test-queue",
        )
        assert result == "completed"
```

## Manual Time Control

```python
@pytest.mark.asyncio
async def test_workflow_manual_advance(workflow_env):
    async with Worker(
        workflow_env.client,
        task_queue="test-queue",
        workflows=[ReminderWorkflow],
    ):
        handle = await workflow_env.client.start_workflow(
            ReminderWorkflow.run,
            id="wf-2",
            task_queue="test-queue",
        )
        await workflow_env.sleep(timedelta(days=29))
        assert not handle.done()
        await workflow_env.sleep(timedelta(days=1))
        assert await handle.result() == "completed"
```

## ActivityEnvironment

```python
from temporalio import activity
from temporalio.testing import ActivityEnvironment

@activity.defn
async def uppercase(value: str) -> str:
    return value.upper()

@pytest.mark.asyncio
async def test_activity_environment():
    env = ActivityEnvironment()
    result = await env.run(uppercase, "hello")
    assert result == "HELLO"
```

## Activity Error Handling

```python
from temporalio.exceptions import ApplicationError

@activity.defn
async def validate_name(value: str) -> str:
    if not value:
        raise ApplicationError("name required", non_retryable=True)
    return value

@pytest.mark.asyncio
async def test_activity_error():
    env = ActivityEnvironment()
    with pytest.raises(ApplicationError):
        await env.run(validate_name, "")
```

## Retry-Oriented Workflow Test

```python
call_count = 0

@activity.defn
async def flaky_activity() -> str:
    global call_count
    call_count += 1
    if call_count < 3:
        raise RuntimeError("transient")
    return "success"
```

Use this pattern when validating retry behavior, but reset counters or mocks between tests so each case stays deterministic.
