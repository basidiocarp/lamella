# Chaos Engineering Tools & Automation

## Chaos Monkey

```bash
#!/usr/bin/env bash
set -euo pipefail

INSTANCE_COUNT=5
KILL_PERCENTAGE=20

instances=$(aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId' --output text)
kill_count=$(( INSTANCE_COUNT * KILL_PERCENTAGE / 100 ))

for instance in $(echo "$instances" | tr '\t' '\n' | shuf | head -n "$kill_count"); do
  aws ec2 terminate-instances --instance-ids "$instance"
  sleep 30
done
```

Use for simple scheduled instance termination in non-production or tightly
scoped game-day environments.

## Gremlin API Client

```python
import requests


class GremlinClient:
    def __init__(self, api_key: str, team_id: str):
        self.session = requests.Session()
        self.session.headers.update(
            {"Authorization": f"Key {api_key}", "Content-Type": "application/json"}
        )
        self.team_id = team_id

    def run_shutdown_attack(self, target_id: str):
        response = self.session.post(
            "https://api.gremlin.com/v1/attacks/new",
            json={
                "target": {"type": "Random", "identifiers": [target_id]},
                "command": {"type": "shutdown", "length": 60},
            },
        )
        response.raise_for_status()
        return response.json()
```

## CI / CD Integration

```yaml
name: Chaos Engineering Tests

on:
  schedule:
    - cron: '0 3 * * 2'

jobs:
  chaos-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run controlled chaos scenario
        run: ./scripts/run-chaos-test.sh
```

## Tool Quick Reference

| Tool | Good For | Notes |
| ---- | -------- | ----- |
| Chaos Monkey | Random instance failure | Best for simple kill scenarios |
| Gremlin | Managed attack catalog | Good for team-run experiments |
| Litmus | Kubernetes chaos | Native CRD-based workflows |
| Chaos Mesh | Advanced K8s experiments | Strong network and kernel faults |
| Toxiproxy | Network fault injection | Great for app-level testing |
