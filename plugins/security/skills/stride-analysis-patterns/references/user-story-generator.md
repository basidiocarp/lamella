# Security User Story Generator

Generate security-focused user stories and epics from requirements.

```python
def generate_user_story(requirement: dict) -> str:
    return (
        f"As a security-conscious team, we need {requirement['requirement']} "
        f"so that {requirement['outcome']}."
    )


def generate_epic(title: str, requirements: list[dict]) -> str:
    lines = [f"# Epic: {title}", "", "## Stories"]
    for req in requirements:
        lines.append(f"- {generate_user_story(req)}")
    return "\n".join(lines)
```
