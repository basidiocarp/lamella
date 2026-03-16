# Game Day Planning & Execution

## Game Day Planning Template

```yaml
game_day:
  name: "Database Failover Drill"
  date: "2025-01-15"
  time: "10:00-12:00 PST"
  environment: "staging"  # Start in staging
// ... (67 lines trimmed)
    scheduled_for: "2025-01-16 14:00"
    template: "game-day-retro.md"
    required_attendees: "all participants"
```

## Game Day Runbook

```markdown
# Database Failover Game Day Runbook

**Date**: January 15, 2025
**Duration**: 2 hours
**Environment**: Staging
// ... (19 lines trimmed)
### 10:10 - Scenario 1: Primary DB Failure (30 min)

**T+0 (10:10)** - Inject failure
```bash
aws rds reboot-db-instance \
  --db-instance-identifier staging-primary \
  --force-failover
```

**Expected Timeline**:
- T+0: Reboot initiated
- T+30s: Primary becomes unavailable
- T+60s: DNS updated to standby
// ... (22 lines trimmed)
### 10:50 - Scenario 2: Network Partition (20 min)

**T+0 (10:50)** - Inject failure
```bash
# Block database security group ingress
aws ec2 revoke-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --cidr 10.0.0.0/16
```

**Expected Behavior**:
- Connection timeouts occur
- Circuit breaker opens
- Read-only mode activates
// ... (16 lines trimmed)
1. Database connection pool leak
2. Simultaneous cache invalidation

```python
# Connection leak simulator
import psycopg2
connections = []
for i in range(100):
    conn = psycopg2.connect(DATABASE_URL)
    connections.append(conn)
    # Intentionally don't close
```

**Observer Tasks**:
- [ ] How long to identify root cause?
- [ ] Communication effectiveness
- [ ] Cross-team coordination
// ... (18 lines trimmed)
- [ ] Send thank-you to participants
- [ ] Create action item tickets
- [ ] Update runbooks based on learnings
```

## Game Day Observation Template

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import List

@dataclass
// ... (64 lines trimmed)

print(f"MTTR: {metrics.calculate_mttr()}s")
print(f"Success Rate: {metrics.success_rate()}%")
```

## Surprise Scenarios Library

```yaml
# Keep these secret until game day!
surprise_scenarios:
  - name: "Cascading Failure"
    description: "Primary failure triggers secondary issue"
    injection:
// ... (36 lines trimmed)
    learning_goals:
      - "Do we detect performance degradation?"
      - "What are our latency SLOs?"
```

## Post-Game Report Template

```markdown
# Game Day Report: Database Failover

**Date**: January 15, 2025
**Participants**: 12
**Duration**: 2 hours
// ... (69 lines trimmed)
- Screen recordings: [link]
- Metrics dashboard export: [link]
- Raw observation notes: [link]
```

## Quick Reference

| Phase | Duration | Key Activities |
|-------|----------|----------------|
| Planning | 2 weeks | Define scenarios, invite participants |
| Pre-game | 30 min | Setup, verify environment, brief team |
| Execution | 2 hours | Run scenarios, observe, document |
| Debrief | 30 min | Immediate learnings, quick wins |
| Post-mortem | 1 week later | Detailed analysis, action items |
| Follow-up | 1 month | Verify improvements, plan next game day |
