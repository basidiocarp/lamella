# Local Development Setup for Temporal Python Testing

Comprehensive guide for setting up local Temporal development environment with pytest integration and coverage tracking.

## Temporal Server Setup with Docker Compose

### Basic Docker Compose Configuration

```yaml
# docker-compose.yml
version: "3.8"

services:
  temporal:
// ... (36 lines trimmed)

volumes:
  postgres_data:
```

### Starting Local Server

```bash
# Start Temporal server
docker-compose up -d

# Verify server is running
docker-compose ps
// ... (9 lines trimmed)

# Reset data (clean slate)
docker-compose down -v
```

### Health Check Script

```python
# scripts/health_check.py
import asyncio
from temporalio.client import Client

async def check_temporal_health():
// ... (31 lines trimmed)

if __name__ == "__main__":
    asyncio.run(check_temporal_health())
```

## pytest Configuration

### Project Structure

```
temporal-project/
├── docker-compose.yml
├── pyproject.toml
├── pytest.ini
├── requirements.txt
// ... (18 lines trimmed)
└── scripts/
    ├── health_check.py
    └── export_histories.py
```

### pytest Configuration

```ini
# pytest.ini
[pytest]
asyncio_mode = auto
testpaths = tests
python_files = test_*.py
// ... (18 lines trimmed)

# Async test timeout
asyncio_default_fixture_loop_scope = function
```

### Shared Test Fixtures

```python
# tests/conftest.py
import pytest
from temporalio.testing import WorkflowEnvironment
from temporalio.client import Client

// ... (38 lines trimmed)
        workflows=[OrderWorkflow, PaymentWorkflow],
        activities=[process_payment, update_inventory],
    )
```

### Dependencies

```txt
# requirements.txt
temporalio>=1.5.0
pytest>=7.4.0
pytest-asyncio>=0.21.0
pytest-cov>=4.1.0
pytest-xdist>=3.3.0  # Parallel test execution
```

```toml
# pyproject.toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_backend"

// ... (16 lines trimmed)
[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```

## Coverage Configuration

### Coverage Settings

```ini
# .coveragerc
[run]
source = src
omit =
    */tests/*
// ... (13 lines trimmed)

[html]
directory = htmlcov
```

### Running Tests with Coverage

```bash
# Run all tests with coverage
pytest --cov=src --cov-report=term-missing

# Generate HTML coverage report
pytest --cov=src --cov-report=html
// ... (9 lines trimmed)

# Fail if coverage below threshold
pytest --cov=src --cov-fail-under=80
```

### Coverage Report Example

```
---------- coverage: platform darwin, python 3.11.5 -----------
Name                                Stmts   Miss  Cover   Missing
-----------------------------------------------------------------
src/__init__.py                         0      0   100%
// ... (8 lines trimmed)

10 files skipped due to complete coverage.
```

## Development Workflow

### Daily Development Flow

```bash
# 1. Start Temporal server
docker-compose up -d

# 2. Verify server health
python scripts/health_check.py
// ... (9 lines trimmed)

# 6. Stop server
docker-compose down
```

### Pre-Commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash

echo "Running tests..."
// ... (6 lines trimmed)

echo "All tests passed!"
```

### Makefile for Common Tasks

```makefile
# Makefile
.PHONY: setup test test-unit test-integration coverage clean

setup:
	docker-compose up -d
// ... (28 lines trimmed)
	sleep 10  # Wait for Temporal to start
	pytest --cov=src --cov-fail-under=80
	docker-compose down
```

### CI/CD Example

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
// ... (35 lines trimmed)
      - name: Cleanup
        if: always()
        run: docker-compose down
```

## Debugging Tips

### Enable Temporal SDK Logging

```python
import logging

# Enable debug logging for Temporal SDK
logging.basicConfig(level=logging.DEBUG)
temporal_logger = logging.getLogger("temporalio")
temporal_logger.setLevel(logging.DEBUG)
```

### Interactive Debugging

```python
# Add breakpoint in test
@pytest.mark.asyncio
async def test_workflow_with_breakpoint(workflow_env):
    import pdb; pdb.set_trace()  # Debug here

    async with Worker(...):
        result = await workflow_env.client.execute_workflow(...)
```

### Temporal Web UI

```bash
# Access Web UI at http://localhost:8080
# - View workflow executions
# - Inspect event history
# - Replay workflows
# - Monitor workers
```

## Best Practices

1. **Isolated Environment**: Use Docker Compose for reproducible local setup
2. **Health Checks**: Always verify Temporal server before running tests
3. **Fast Feedback**: Use pytest markers to run unit tests quickly
4. **Coverage Targets**: Maintain ≥80% code coverage
5. **Parallel Testing**: Use pytest-xdist for faster test runs
6. **CI/CD Integration**: Automated testing on every commit
7. **Cleanup**: Clear Docker volumes between test runs if needed

## Troubleshooting

**Issue: Temporal server not starting**

```bash
# Check logs
docker-compose logs temporal

# Reset database
docker-compose down -v
docker-compose up -d
```

**Issue: Tests timing out**

```python
# Increase timeout in pytest.ini
asyncio_default_timeout = 30
```

**Issue: Port already in use**

```bash
# Find process using port 7233
lsof -i :7233

# Kill process or change port in docker-compose.yml
```

## Additional Resources

- Temporal Local Development: docs.temporal.io/develop/python/local-dev
- pytest Documentation: docs.pytest.org
- Docker Compose: docs.docker.com/compose
- pytest-asyncio: github.com/pytest-dev/pytest-asyncio
