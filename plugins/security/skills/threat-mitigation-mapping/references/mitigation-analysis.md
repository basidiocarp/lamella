# Mitigation Analysis Template

Analyzer for prioritizing controls and summarizing gaps.

```python
def rank_actions(plan) -> list[dict]:
    actions = []
    for mitigation in plan.open_actions():
        priority = "high" if plan.threat.severity in {"critical", "high"} else "medium"
        actions.append(
            {
                "priority": priority,
                "control_id": mitigation.control_id,
                "owner": mitigation.owner,
                "status": mitigation.status,
            }
        )
    return actions


def summarize_plan(plan) -> str:
    lines = [
        f"Threat: {plan.threat.id} ({plan.threat.category})",
        f"Severity: {plan.threat.severity}",
        "Open actions:",
    ]
    for action in rank_actions(plan):
        lines.append(
            f"- [{action['priority']}] {action['control_id']} "
            f"owned by {action['owner']} ({action['status']})"
        )
    return "\n".join(lines)
```
