# Replay Testing for Determinism and Compatibility

Comprehensive guide for validating workflow determinism and ensuring safe code changes using replay testing.

## What is Replay Testing?

**Purpose**: Verify that workflow code changes are backward-compatible with existing workflow executions

**How it works**:

1. Temporal records every workflow decision as Event History
2. Replay testing re-executes workflow code against recorded history
3. If new code makes same decisions → deterministic (safe to deploy)
4. If decisions differ → non-deterministic (breaking change)

**Critical Use Cases**:

- Deploying workflow code changes to production
- Validating refactoring doesn't break running workflows
- CI/CD automated compatibility checks
- Version migration validation

## Basic Replay Testing

### Replayer Setup

```python
from temporalio.worker import Replayer
from temporalio.client import Client

async def test_workflow_replay():
    """Test workflow against production history"""
// ... (13 lines trimmed)
    # Replay history with current code
    await replayer.replay_workflow(history)
    # Success = deterministic, Exception = breaking change
```

### Testing Against Multiple Histories

```python
import pytest
from temporalio.worker import Replayer

@pytest.mark.asyncio
async def test_replay_multiple_workflows():
// ... (14 lines trimmed)

        # Replay should succeed for all variants
        await replayer.replay_workflow(history)
```

## Determinism Validation

### Common Non-Deterministic Patterns

**Problem: Random Number Generation**

```python
# ❌ Non-deterministic (breaks replay)
@workflow.defn
class BadWorkflow:
    @workflow.run
    async def run(self) -> int:
        return random.randint(1, 100)  # Different on replay!

# ✅ Deterministic (safe for replay)
@workflow.defn
class GoodWorkflow:
    @workflow.run
    async def run(self) -> int:
        return workflow.random().randint(1, 100)  # Deterministic random
```

**Problem: Current Time**

```python
# ❌ Non-deterministic
@workflow.defn
class BadWorkflow:
    @workflow.run
    async def run(self) -> str:
        now = datetime.now()  # Different on replay!
        return now.isoformat()

# ✅ Deterministic
@workflow.defn
class GoodWorkflow:
    @workflow.run
    async def run(self) -> str:
        now = workflow.now()  # Deterministic time
        return now.isoformat()
```

**Problem: Direct External Calls**

```python
# ❌ Non-deterministic
@workflow.defn
class BadWorkflow:
    @workflow.run
    async def run(self) -> dict:
// ... (10 lines trimmed)
            fetch_external_data,
            start_to_close_timeout=timedelta(seconds=30),
        )
```

### Testing Determinism

```python
@pytest.mark.asyncio
async def test_workflow_determinism():
    """Verify workflow produces same output on multiple runs"""

    @workflow.defn
// ... (27 lines trimmed)

    # Verify identical outputs
    assert results[0] == results[1]
```

## Production History Replay

### Exporting Workflow History

```python
from temporalio.client import Client

async def export_workflow_history(workflow_id: str, output_file: str):
    """Export workflow history for replay testing"""

// ... (8 lines trimmed)
        f.write(history.SerializeToString())

    print(f"Exported history to {output_file}")
```

### Replaying from File

```python
from temporalio.worker import Replayer
from temporalio.api.history.v1 import History

async def test_replay_from_file():
    """Replay workflow from exported history file"""

    # Load history from file
    with open("workflow_histories/order-123.pb", "rb") as f:
        history = History.FromString(f.read())

    # Replay with current workflow code
    replayer = Replayer(workflows=[OrderWorkflow])
    await replayer.replay_workflow(history)
    # Success = safe to deploy
```

## CI/CD Integration Patterns

### GitHub Actions Example

```yaml
# .github/workflows/replay-tests.yml
name: Replay Tests

on:
  pull_request:
// ... (31 lines trimmed)
        with:
          name: replay-failures
          path: replay-failures/
```

### Automated History Export

```python
# scripts/export_histories.py
import asyncio
from temporalio.client import Client
from datetime import datetime, timedelta

// ... (25 lines trimmed)

if __name__ == "__main__":
    asyncio.run(export_recent_histories())
```

### Replay Test Suite

```python
# tests/replay/test_workflow_replay.py
import pytest
import glob
from temporalio.worker import Replayer
from temporalio.api.history.v1 import History
// ... (29 lines trimmed)
            f"Replay failed for {len(failures)} workflows:\n"
            + "\n".join(f"  {file}: {error}" for file, error in failures)
        )
```

## Version Compatibility Testing

### Testing Code Evolution

```python
@pytest.mark.asyncio
async def test_workflow_version_compatibility():
    """Test workflow with version changes"""

    @workflow.defn
// ... (35 lines trimmed)
        assert result_v2 == "version-2"

    await env.shutdown()
```

### Migration Strategy

```python
# Phase 1: Add version check
@workflow.defn
class MigratingWorkflow:
    @workflow.run
    async def run(self) -> dict:
// ... (13 lines trimmed)
    async def run(self) -> dict:
        # Only new logic remains
        return await self._new_implementation()
```

## Best Practices

1. **Replay Before Deploy**: Always run replay tests before deploying workflow changes
2. **Export Regularly**: Continuously export production histories for testing
3. **CI/CD Integration**: Automated replay testing in pull request checks
4. **Version Tracking**: Use workflow.get_version() for safe code evolution
5. **History Retention**: Keep representative workflow histories for regression testing
6. **Determinism**: Never use random(), datetime.now(), or direct external calls
7. **Comprehensive Testing**: Test against various workflow execution paths

## Common Replay Errors

**Non-Deterministic Error**:

```
WorkflowNonDeterministicError: Workflow command mismatch at position 5
Expected: ScheduleActivityTask(activity_id='activity-1')
Got: ScheduleActivityTask(activity_id='activity-2')
```

**Solution**: Code change altered workflow decision sequence

**Version Mismatch Error**:

```
WorkflowVersionError: Workflow version changed from 1 to 2 without using get_version()
```

**Solution**: Use workflow.get_version() for backward-compatible changes

## Additional Resources

- Replay Testing: docs.temporal.io/develop/python/testing-suite#replay-testing
- Workflow Versioning: docs.temporal.io/workflows#versioning
- Determinism Guide: docs.temporal.io/workflows#deterministic-constraints
- CI/CD Integration: github.com/temporalio/samples-python/tree/main/.github/workflows
