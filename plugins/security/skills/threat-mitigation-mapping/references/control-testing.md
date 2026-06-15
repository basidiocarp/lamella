# Control Effectiveness Testing Template

Use this scaffold to test whether a security control exists, is enforced, and
actually blocks the failure mode it was meant to address.

## Test Structure

Each control test should answer four questions:

1. What control are we validating?
2. What evidence proves it is configured?
3. What negative case proves it blocks the targeted behavior?
4. What failure or gap should the report capture if it does not hold?

## Minimal Test Record

```python
from dataclasses import dataclass
from typing import Callable

@dataclass
class ControlTest:
    control_id: str
    objective: str
    evidence_check: Callable[[], bool]
    enforcement_check: Callable[[], bool]
```

Keep the model small. The important part is consistent evidence and result
capture, not a heavyweight framework.

## Recommended Assertions

For each control, test both configuration and behavior:

- configuration exists
- configuration is applied to the intended scope
- violating behavior is denied, blocked, or alerted
- logs or audit evidence are emitted when expected

Examples:
- MFA policy exists and login without MFA is denied
- branch protection exists and direct push is rejected
- secret scanning is enabled and a test secret triggers the control

## Result Shape

Capture results in a compact, reviewable form:

```python
result = {
    "control_id": "IAM-01",
    "passed": True,
    "evidence": ["mfa policy enabled", "unenrolled login denied"],
    "notes": [],
}
```

Use structured results if the output feeds another report or dashboard.

## Test Writing Guidance

- keep one control objective per test
- separate setup failure from enforcement failure
- include at least one negative or adversarial check
- avoid tests that only confirm configuration text without exercising behavior
- record enough evidence to support remediation planning

## Reporting Template

For each failed control, include:
- the control identifier
- what was expected
- what was observed
- the missing evidence or enforcement gap
- the recommended next action

## Example Use Cases

- identity controls such as MFA, SSO, and session expiry
- CI and repository controls such as required reviews or signed builds
- runtime controls such as WAF rules, rate limits, and network policy
- detective controls such as alert routing and audit logging

Use this as a testing scaffold, then adapt the evidence and checks to the
system under review.
