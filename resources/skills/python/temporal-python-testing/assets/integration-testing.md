# Integration Testing with Mocked Activities

Comprehensive patterns for testing workflows with mocked external dependencies, error injection, and complex scenarios.

## Activity Mocking Strategy

**Purpose**: Test workflow orchestration logic without calling real external services

### Basic Mock Pattern

```python
import pytest
from temporalio.testing import WorkflowEnvironment
from temporalio.worker import Worker
from unittest.mock import Mock

// ... (29 lines trimmed)
        )
        assert result == "processed: mocked-result"
        mock_activity.assert_called_once()
```

### Dynamic Mock Responses

**Scenario-Based Mocking**:

```python
@pytest.mark.asyncio
async def test_workflow_multiple_mock_scenarios(workflow_env):
    """Test different workflow paths with dynamic mocks"""

    # Mock returns different values based on input
// ... (39 lines trimmed)
            task_queue="test",
        )
        assert "Validation failed" in result_error
```

## Error Injection Patterns

### Testing Transient Failures

**Retry Behavior**:

```python
@pytest.mark.asyncio
async def test_workflow_transient_errors(workflow_env):
    """Test retry logic with controlled failures"""

    attempt_count = 0
// ... (34 lines trimmed)
        )
        assert result == "success-after-retries"
        assert attempt_count == 3
```

### Testing Non-Retryable Errors

**Business Validation Failures**:

```python
@pytest.mark.asyncio
async def test_workflow_non_retryable_error(workflow_env):
    """Test handling of permanent failures"""

    @activity.defn
// ... (31 lines trimmed)
            task_queue="test",
        )
        assert "validation-failed" in result
```

## Multi-Activity Workflow Testing

### Sequential Activity Pattern

```python
@pytest.mark.asyncio
async def test_workflow_sequential_activities(workflow_env):
    """Test workflow orchestrating multiple activities"""

    activity_calls = []
// ... (48 lines trimmed)
        )
        assert result == "start-step1-step2-step3"
        assert activity_calls == ["step_1", "step_2", "step_3"]
```

### Parallel Activity Pattern

```python
@pytest.mark.asyncio
async def test_workflow_parallel_activities(workflow_env):
    """Test concurrent activity execution"""

    @activity.defn
// ... (28 lines trimmed)
            task_queue="test",
        )
        assert result == ["task-0", "task-1", "task-2"]
```

## Signal and Query Testing

### Signal Handlers

```python
@pytest.mark.asyncio
async def test_workflow_signals(workflow_env):
    """Test workflow signal handling"""

    @workflow.defn
// ... (42 lines trimmed)
        await handle.signal(SignalWorkflow.update_status, "completed")
        result = await handle.result()
        assert result == "completed"
```

## Coverage Strategies

### Workflow Logic Coverage

**Target**: ≥80% coverage of workflow decision logic

```python
# Test all branches
@pytest.mark.parametrize("condition,expected", [
    (True, "branch-a"),
    (False, "branch-b"),
])
async def test_workflow_branches(workflow_env, condition, expected):
    """Ensure all code paths are tested"""
    # Test implementation
    pass
```

### Activity Coverage

**Target**: ≥80% coverage of activity logic

```python
# Test activity edge cases
@pytest.mark.parametrize("input,expected", [
    ("valid", "success"),
    ("", "empty-input-error"),
    (None, "null-input-error"),
])
async def test_activity_edge_cases(activity_env, input, expected):
    """Test activity error handling"""
    # Test implementation
    pass
```

## Integration Test Organization

### Test Structure

```
tests/
├── integration/
│   ├── conftest.py              # Shared fixtures
│   ├── test_order_workflow.py   # Order processing tests
│   ├── test_payment_workflow.py # Payment tests
│   └── test_fulfillment_workflow.py
├── unit/
│   ├── test_order_activities.py
│   └── test_payment_activities.py
└── fixtures/
    └── test_data.py             # Test data builders
```

### Shared Fixtures

```python
# conftest.py
import pytest
from temporalio.testing import WorkflowEnvironment

@pytest.fixture(scope="session")
// ... (12 lines trimmed)
def mock_inventory_service():
    """Mock external inventory service"""
    return Mock()
```

## Best Practices

1. **Mock External Dependencies**: Never call real APIs in tests
2. **Test Error Scenarios**: Verify compensation and retry logic
3. **Parallel Testing**: Use pytest-xdist for faster test runs
4. **Isolated Tests**: Each test should be independent
5. **Clear Assertions**: Verify both results and side effects
6. **Coverage Target**: ≥80% for critical workflows
7. **Fast Execution**: Use time-skipping, avoid real delays

## Additional Resources

- Mocking Strategies: docs.temporal.io/develop/python/testing-suite
- pytest Best Practices: docs.pytest.org/en/stable/goodpractices.html
- Python SDK Samples: github.com/temporalio/samples-python
