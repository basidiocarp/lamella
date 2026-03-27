# Testing with pytest

Use pytest as the default testing workflow for modern Python projects.

## Core Setup

- keep tests under `tests/`
- configure pytest in `pyproject.toml`
- add coverage and hypothesis only when they add real signal

## Baseline Workflow

- run all tests locally
- use markers for slow or integration suites
- keep fixtures in `conftest.py`
- generate coverage reports when the team actually reviews them

## Good Coverage Rule

Coverage is useful when it points to risky blind spots. Do not optimize only
for a threshold.

## Common Add-ons

- `pytest-asyncio` for async tests
- `pytest-cov` for coverage reporting
- `hypothesis` for property-based testing where invariants matter
