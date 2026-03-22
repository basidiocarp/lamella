# Chaos Experiment Design

## Experiment Template

```yaml
name: "Database Connection Pool Exhaustion"
hypothesis: "When the database connection pool is exhausted, the application will gracefully degrade and return 503 errors without cascading failures"

steady_state:
  metrics:
// ... (38 lines trimmed)
  - "503 errors returned (not 500)"
  - "No cascading failures to other services"
  - "System recovers within 60s of rollback"
```

## Hypothesis Formulation

```python
def create_hypothesis(component: str, failure: str, expected_behavior: str) -> dict:
    """
    Create well-formed chaos hypothesis.

    Format: "Given [normal state], when [failure occurs],
// ... (18 lines trimmed)
    expected_behavior="Requests timeout gracefully, retry queue activates, "
                     "users see clear error messages"
)
```

## Blast Radius Control

```python
from dataclasses import dataclass
from enum import Enum

class BlastRadiusLevel(Enum):
    MINIMAL = "single_instance_dev"
// ... (55 lines trimmed)
            max_duration_seconds=300
        )
    ]
```

## Safety Mechanisms

```python
import asyncio
from typing import Callable

class ChaosExperimentSafety:
    def __init__(self, config: dict):
// ... (54 lines trimmed)
                return "error_rate_exceeded"

            await asyncio.sleep(5)  # Check every 5 seconds
```

## Quick Reference

| Phase | Key Actions | Time Limit |
|-------|-------------|------------|
| Design | Hypothesis, metrics, blast radius | 1 hour |
| Review | Team review, safety check | 30 min |
| Prepare | Setup monitoring, rollback | 1 hour |
| Execute | Run experiment, monitor | 5-10 min |
| Rollback | Restore steady state | < 30 sec |
| Learn | Document findings, plan fixes | 2 hours |
