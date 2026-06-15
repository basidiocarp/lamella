# Attack Path Analysis

Analyze attack paths, identify critical nodes, and prioritize mitigations.

```python
def rank_paths(paths: list[dict]) -> list[dict]:
    scored = []
    for path in paths:
        score = path["likelihood"] * path["impact"]
        scored.append(
            {
                "path": path["name"],
                "score": score,
                "critical_nodes": path.get("critical_nodes", []),
            }
        )
    return sorted(scored, key=lambda item: item["score"], reverse=True)


def mitigation_recommendations(paths: list[dict]) -> list[dict]:
    recommendations = []
    for item in rank_paths(paths):
        recommendations.append(
            {
                "path": item["path"],
                "coverage_impact": item["score"],
                "recommendation": f"Add controls around {', '.join(item['critical_nodes']) or 'entry nodes'}",
            }
        )
    return recommendations
```
