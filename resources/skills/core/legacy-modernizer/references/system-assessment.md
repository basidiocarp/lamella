# System Assessment

## Codebase Analysis Checklist

```python
# Automated assessment script
from pathlib import Path
import ast
import re
from collections import defaultdict
// ... (134 lines trimmed)
analyzer = LegacyCodeAnalyzer(Path('./legacy_app'))
report = analyzer.analyze()
print(json.dumps(report, indent=2))
```

## Dependency Analysis

```python
# Identify circular dependencies and tight coupling
import subprocess
import json
from pathlib import Path
from collections import defaultdict
// ... (54 lines trimmed)

    Path(output_file).write_text('\n'.join(dot_lines))
    print(f"Generated {output_file} - render with: dot -Tpng {output_file} -o deps.png")
```

## Technical Debt Calculation

```python
from datetime import datetime, timedelta

class TechnicalDebtCalculator:
    """Calculate technical debt using SQALE method"""

// ... (40 lines trimmed)

report = debt_calc.calculate_total_debt()
# Output: ~95 days of work, ~19 weeks, ~$76,000
```

## Risk Assessment Matrix

```python
from enum import Enum

class Risk(Enum):
    LOW = 1
    MEDIUM = 2
// ... (64 lines trimmed)

for risk in risks.get_prioritized_risks():
    print(f"{risk['severity']}: {risk['area']}")
```

## Modernization Roadmap Template

```python
from dataclasses import dataclass
from datetime import date, timedelta
from typing import List

@dataclass
// ... (71 lines trimmed)
))

timeline = roadmap.generate_timeline()
```

## Stakeholder Communication Template

```python
# Weekly status report generator
from datetime import datetime

class ModernizationStatusReport:
    def __init__(self, week_number: int):
// ... (34 lines trimmed)

    def _format_metrics(self) -> str:
        return '\n'.join(f"- {k}: {v}" for k, v in self.metrics.items())
```

## Quick Reference

| Assessment Area | Tools | Output |
|----------------|-------|--------|
| Code Quality | pylint, radon, sonarqube | Complexity, issues |
| Dependencies | pipdeptree, pydeps | Graph, circular deps |
| Technical Debt | SonarQube, CodeClimate | Debt hours, cost |
| Test Coverage | coverage.py, pytest-cov | Percentage, gaps |
| Security | bandit, safety | Vulnerabilities |
| Performance | cProfile, py-spy | Bottlenecks |
