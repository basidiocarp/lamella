# SLO Implementation Guide

## Context

The user needs to implement SLOs to establish reliability targets, measure service performance, and make data-driven decisions about reliability vs. feature development. Focus on practical SLO implementation that aligns with business objectives.

## Requirements

$ARGUMENTS

## Instructions

### 1. SLO Foundation

Establish SLO fundamentals and framework:

**SLO Framework Designer**

```python
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class SLOFramework:
    def __init__(self, service_name: str):
        self.service = service_name
# ... (104 lines trimmed for brevity)

        return journeys
```

### 2. SLI Selection and Measurement

Choose and implement appropriate SLIs:

**SLI Implementation**

```python
class SLIImplementation:
    def __init__(self):
        self.sli_types = {
            'availability': AvailabilitySLI,
            'latency': LatencySLI,
            'error_rate': ErrorRateSLI,
            'throughput': ThroughputSLI,
# ... (126 lines trimmed for brevity)
            }
        }
```

### 3. Error Budget Calculation

Implement error budget tracking:

**Error Budget Manager**

```python
class ErrorBudgetManager:
    def __init__(self, slo_target: float, window_days: int):
        self.slo_target = slo_target
        self.window_days = window_days
        self.error_budget_minutes = self._calculate_total_budget()

    def _calculate_total_budget(self):
# ... (62 lines trimmed for brevity)
            }
        }
```

### 4. SLO Monitoring Setup

Implement comprehensive SLO monitoring:

**SLO Monitoring Implementation**

```yaml
# Prometheus recording rules for SLO
groups:
  - name: slo_rules
    interval: 30s
    rules:
      # Request rate
      - record: service:request_rate
# ... (56 lines trimmed for brevity)
            )
          ) / (1 - 0.999) # 99.9% SLO
```

**Alert Configuration**

```yaml
# Multi-window multi-burn-rate alerts
groups:
  - name: slo_alerts
    rules:
      # Fast burn alert (2% budget in 1 hour)
      - alert: ErrorBudgetFastBurn
        expr: |
# ... (32 lines trimmed for brevity)
            Current burn rate: {{ $value }}x
            This will exhaust 10% of monthly budget in 6 hours.
```

### 5. SLO Dashboard

Create comprehensive SLO dashboards:

**Grafana Dashboard Configuration**

```python
def create_slo_dashboard():
    """Generate Grafana dashboard for SLO monitoring"""
    return {
        "dashboard": {
            "title": "Service SLO Dashboard",
            "panels": [
                {
# ... (86 lines trimmed for brevity)
        }
    }
```

### 6. SLO Reporting

Generate SLO reports and reviews:

**SLO Report Generator**

```python
class SLOReporter:
    def __init__(self, metrics_client):
        self.metrics = metrics_client

    def generate_monthly_report(self, service, month):
        """Generate comprehensive monthly SLO report"""
        report_data = {
# ... (93 lines trimmed for brevity)
</html>
"""
```

### 7. SLO-Based Decision Making

Implement SLO-driven engineering decisions:

**SLO Decision Framework**

```python
class SLODecisionFramework:
    def __init__(self, error_budget_policy):
        self.policy = error_budget_policy

    def make_release_decision(self, service, release_risk):
        """Make release decisions based on error budget"""
        budget_status = self.get_error_budget_status(service)
# ... (76 lines trimmed for brevity)
            'automation_hours_per_week': ((100 - toil_budget) / 100) * 40 * team_size
        }
```

### 8. SLO Templates

Provide SLO templates for common services:

**SLO Template Library**

```python
class SLOTemplates:
    @staticmethod
    def get_api_service_template():
        """SLO template for API services"""
        return {
            'name': 'API Service SLO Template',
            'slos': [
# ... (57 lines trimmed for brevity)
            ]
        }
```

### 9. SLO Automation

Automate SLO management:

**SLO Automation Tools**

```python
class SLOAutomation:
    def __init__(self):
        self.config = self.load_slo_config()

    def auto_generate_slos(self, service_discovery):
        """Automatically generate SLOs for discovered services"""
        services = service_discovery.get_all_services()
# ... (81 lines trimmed for brevity)
    dashboard: https://grafana.example.com/d/api-slo
'''
```

### 10. SLO Culture and Governance

Establish SLO culture:

**SLO Governance Framework**

```python
class SLOGovernance:
    def establish_slo_culture(self):
        """Establish SLO-driven culture"""
        return {
            'principles': [
                'SLOs are a shared responsibility',
                'Error budgets drive prioritization',
# ... (74 lines trimmed for brevity)
- **Decisions**: [List]
'''
```

## Output Format

1. **SLO Framework**: Comprehensive SLO design and objectives
2. **SLI Implementation**: Code and queries for measuring SLIs
3. **Error Budget Tracking**: Calculations and burn rate monitoring
4. **Monitoring Setup**: Prometheus rules and Grafana dashboards
5. **Alert Configuration**: Multi-window multi-burn-rate alerts
6. **Reporting Templates**: Monthly reports and reviews
7. **Decision Framework**: SLO-based engineering decisions
8. **Automation Tools**: SLO-as-code and auto-generation
9. **Governance Process**: Culture and review processes

Focus on creating meaningful SLOs that balance reliability with feature velocity, providing clear signals for engineering decisions and fostering a culture of reliability.
