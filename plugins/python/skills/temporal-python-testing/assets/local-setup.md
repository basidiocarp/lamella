# Local Development Setup for Temporal Python Testing

Use this guide to get a local Temporal test environment running with Docker, pytest, and coverage reporting without carrying a full scaffold dump in the asset itself.

## Minimal Local Stack

```yaml
services:
  temporal:
    image: temporalio/auto-setup:latest
    ports:
      - "7233:7233"
      - "8080:8080"
    environment:
      DB: postgresql
      DB_PORT: 5432

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: temporal

volumes:
  postgres_data:
```

## Startup Flow

```bash
docker compose up -d
docker compose ps
python scripts/health_check.py
pytest -m "not integration"
docker compose down
```

Reset state when needed:

```bash
docker compose down -v
```

## Recommended Project Shape

```text
temporal-project/
├── docker-compose.yml
├── pyproject.toml
├── tests/
├── src/
└── scripts/
```

## pytest and Coverage Defaults

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```

```bash
pytest --cov=src --cov-report=term-missing
pytest --cov=src --cov-fail-under=80
```

## Shared Fixture Pattern

Use a session or function-scoped `WorkflowEnvironment` fixture and register only the workflows and activities needed for the current test module.

## Daily Workflow

1. Start Temporal locally.
2. Run a health check before the test suite.
3. Run fast tests first, then integration or replay suites.
4. Stop the stack when finished.

## Debugging Tips

- Enable Temporal SDK debug logging only when diagnosing failures.
- Use the Web UI on `http://localhost:8080` to inspect workflow histories.
- Clear Docker volumes if stale state is causing confusing failures.

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
