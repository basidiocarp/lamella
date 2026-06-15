# Debt and Risk Assessment

## Technical Debt

- estimate debt by class: testing gaps, obsolete frameworks, duplicated logic,
  operational fragility
- express debt as engineering effort and delivery risk, not just issue counts

```python
debt = {
    "framework_upgrade": "6 weeks",
    "test_safety_net": "3 weeks",
    "module_extraction": "4 weeks",
}
```

## Risk Matrix

Assess each area on business impact and migration complexity:

| Area | Impact | Complexity | Notes |
| --- | --- | --- | --- |
| billing | high | high | revenue-critical, weak test coverage |
| reporting | medium | low | isolated read path |
| auth | high | medium | shared across all clients |
