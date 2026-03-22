# Chaos Engineering Tools & Automation

## Chaos Monkey (Netflix)

```python
# Chaos Monkey configuration for Spinnaker
{
  "enabled": true,
  "schedule": {
    "enabled": true,
// ... (27 lines trimmed)
    }
  ]
}
```

```bash
#!/bin/bash
# Simpl Chaos Monkey implementation

INSTANCE_COUNT=5
KILL_PERCENTAGE=20
// ... (18 lines trimmed)
  aws ec2 terminate-instances --instance-ids "$instance"
  sleep 30  # Wait between terminations
done
```

## Gremlin Integration

```python
import requests
from typing import Literal

class GremlinClient:
    def __init__(self, api_key: str, team_id: str):
// ... (124 lines trimmed)
    delay_ms=500,
    jitter_ms=100
)
```

## CI/CD Integration

```yaml
# GitHub Actions workflow for chaos testing
name: Chaos Engineering Tests

on:
  schedule:
// ... (71 lines trimmed)
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Jenkins Pipeline

```groovy
// Jenkinsfile for chaos testing
pipeline {
    agent any

    parameters {
// ... (131 lines trimmed)
        }
    }
}
```

## Continuous Chaos Dashboard

```python
# Flask app for chaos monitoring dashboard
from flask import Flask, render_template, jsonify
import requests
from datetime import datetime, timedelta

// ... (52 lines trimmed)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

## Quick Reference

| Tool | Use Case | Integration |
|------|----------|-------------|
| Chaos Monkey | Random instance termination | Spinnaker/AWS ASG |
| Gremlin | SaaS chaos platform | API/Web UI |
| Litmus | Kubernetes chaos | Kubectl/Helm |
| Chaos Mesh | Advanced K8s chaos | CRDs/Dashboard |
| Toxiproxy | Network proxy chaos | Docker/API |
| Pumba | Container chaos | Docker CLI |
