# Cloud Cost Optimization

## Context

The user needs to optimize cloud infrastructure costs without compromising performance or reliability. Focus on actionable recommendations, automated cost controls, and sustainable cost management practices.

## Requirements

$ARGUMENTS

## Instructions

### 1. Cost Analysis and Visibility

Implement comprehensive cost analysis:

**Cost Analysis Framework**

```python
import boto3
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any
import json

class CloudCostAnalyzer:
# ... (116 lines trimmed for brevity)

        return unused
```

### 2. Resource Rightsizing

Implement intelligent rightsizing:

**Rightsizing Engine**

```python
class ResourceRightsizer:
    def __init__(self):
        self.utilization_thresholds = {
            'cpu_low': 20,
            'cpu_high': 80,
            'memory_low': 30,
            'memory_high': 85,
# ... (150 lines trimmed for brevity)
            raise
'''
```

### 3. Reserved Instances and Savings Plans

Optimize commitment-based discounts:

**Reservation Optimizer**

```python
class ReservationOptimizer:
    def __init__(self):
        self.usage_history = None
        self.existing_reservations = None

    def analyze_reservation_opportunities(self):
        """Analyze opportunities for reservations"""
# ... (156 lines trimmed for brevity)
</html>
'''
```

### 4. Spot Instance Optimization

Leverage spot instances effectively:

**Spot Instance Manager**

```python
class SpotInstanceOptimizer:
    def __init__(self):
        self.spot_advisor = self._init_spot_advisor()
        self.interruption_handler = None

    def identify_spot_opportunities(self):
        """Identify workloads suitable for spot"""
# ... (105 lines trimmed for brevity)
}
'''
```

### 5. Storage Optimization

Optimize storage costs:

**Storage Optimizer**

```python
class StorageOptimizer:
    def analyze_storage_costs(self):
        """Comprehensive storage analysis"""
        analysis = {
            'ebs_volumes': self._analyze_ebs_volumes(),
            's3_buckets': self._analyze_s3_buckets(),
            'snapshots': self._analyze_snapshots(),
# ... (148 lines trimmed for brevity)
        return optimizations
'''
```

### 6. Network Cost Optimization

Reduce network transfer costs:

**Network Cost Optimizer**

```python
class NetworkCostOptimizer:
    def analyze_network_costs(self):
        """Analyze network transfer costs"""
        analysis = {
            'data_transfer_costs': self._analyze_data_transfer(),
            'nat_gateway_costs': self._analyze_nat_gateways(),
            'load_balancer_costs': self._analyze_load_balancers(),
# ... (139 lines trimmed for brevity)
        return optimizations
'''
```

### 7. Container Cost Optimization

Optimize container workloads:

**Container Cost Optimizer**

```python
class ContainerCostOptimizer:
    def optimize_ecs_costs(self):
        """Optimize ECS/Fargate costs"""
        return {
            'cluster_optimization': self._optimize_clusters(),
            'task_rightsizing': self._rightsize_tasks(),
            'scheduling_optimization': self._optimize_scheduling(),
# ... (119 lines trimmed for brevity)
              value: "true"
'''
```

### 8. Serverless Cost Optimization

Optimize serverless workloads:

**Serverless Optimizer**

```python
class ServerlessOptimizer:
    def optimize_lambda_costs(self):
        """Optimize Lambda function costs"""
        lambda_client = boto3.client('lambda')
        cloudwatch = boto3.client('cloudwatch')

        functions = lambda_client.list_functions()['Functions']
# ... (94 lines trimmed for brevity)
                remove_provisioned_concurrency(func['FunctionName'])
'''
```

### 9. Cost Allocation and Tagging

Implement cost allocation strategies:

**Cost Allocation Manager**

```python
class CostAllocationManager:
    def implement_tagging_strategy(self):
        """Implement comprehensive tagging strategy"""
        return {
            'required_tags': [
                {'key': 'Environment', 'values': ['prod', 'staging', 'dev', 'test']},
                {'key': 'CostCenter', 'values': 'dynamic'},
# ... (94 lines trimmed for brevity)
        """
'''
```

### 10. Cost Monitoring and Alerts

Implement proactive cost monitoring:

**Cost Monitoring System**

```python
class CostMonitoringSystem:
    def setup_cost_alerts(self):
        """Setup comprehensive cost alerting"""
        alerts = []

        # Budget alerts
        alerts.extend(self._create_budget_alerts())
# ... (132 lines trimmed for brevity)
</html>
'''
```

## Output Format

1. **Cost Analysis Report**: Comprehensive breakdown of current cloud costs
2. **Optimization Recommendations**: Prioritized list of cost-saving opportunities
3. **Implementation Scripts**: Automated scripts for implementing optimizations
4. **Monitoring Dashboards**: Real-time cost tracking and alerting
5. **ROI Calculations**: Detailed savings projections and payback periods
6. **Risk Assessment**: Analysis of risks associated with each optimization
7. **Implementation Roadmap**: Phased approach to cost optimization
8. **Best Practices Guide**: Long-term cost management strategies

Focus on delivering immediate cost savings while establishing sustainable cost optimization practices that maintain performance and reliability standards.
