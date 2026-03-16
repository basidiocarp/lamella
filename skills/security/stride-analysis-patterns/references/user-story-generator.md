# Security User Story Generator

Generate security-focused user stories and epics from requirements.

```python
class SecurityUserStoryGenerator:
    """Generate security-focused user stories."""

    STORY_TEMPLATES = {
        SecurityDomain.AUTHENTICATION: {
// ... (99 lines trimmed)
{chr(10).join(f'- {d}' for r in reqs for d in r.dependencies) or '- None identified'}
"""
        return epic
```
