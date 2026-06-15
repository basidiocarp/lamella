# Gemba Walk Examples

## Example: Authentication System Gemba Walk

```
SCOPE: User authentication flow

ASSUMPTIONS (Before):
• JWT tokens stored in localStorage
• Single sign-on via OAuth only

OBSERVED REALITY:
• Session cookie auth exists for admin users
• Mobile clients still use legacy bearer tokens
• Password reset bypasses the shared auth middleware

GAPS:
• Two session models are active at once
• OAuth path is incomplete for one tenant type
• Rate limiting is absent on privileged routes

ROOT CAUSES:
1. Legacy admin flow was never retired
2. Auth roadmap split ownership across teams
3. Security controls were added only to the public API

3. MEDIUM: Clean up or implement OAuth
4. MEDIUM: Consolidate session storage (choose one)
5. LOW: Add rate limiting for admin users
```

---

## Example: CI/CD Pipeline Gemba Walk

```
SCOPE: Build and deployment pipeline

ASSUMPTIONS:
• Automated tests run on every commit
• Deploy to staging automatic

OBSERVED REALITY:
• Unit tests run on pull requests, but integration tests are manual
• Staging deploys only from a protected branch
• Security scan is advisory and easy to ignore

GAPS:
• Hotfix branch bypass exists
• Rollback requires manual shell access
• Pipeline status does not show release readiness clearly

ROOT CAUSES:
1. CI evolved around speed, not control gates
2. Release scripts live outside the main pipeline
3. No single owner for deployment safety rules

4. HIGH: Delete or secure hotfix branch
5. MEDIUM: Add automated rollback capability
6. MEDIUM: Make security scan blocking
```

---

## Example: Payment Processing Gemba Walk

```
SCOPE: Payment authorization flow

ASSUMPTIONS:
• All payments go through Stripe
• PCI compliance handled by Stripe

OBSERVED REALITY:
• One legacy endpoint still accepts raw card details server-side
• Stripe Elements is used in the new checkout only
• Refund tooling calls a separate internal payment helper

GAPS:
• PCI scope is larger than expected
• Payment logic is duplicated across services
• Sensitive paths are not isolated clearly

ROOT CAUSES:
1. Legacy migration never finished
2. Compliance assumptions were copied forward without verification
3. Internal tooling was exempted from checkout standards

3. CRITICAL: Delete legacy endpoint
4. HIGH: Implement Stripe Elements (client-side tokenization)
5. HIGH: Review all payment-related code
```

---

## Gemba Walk Template

```
SCOPE: [What code/system area to explore]

ASSUMPTIONS (Before):
• [What you think it does]
• [Expected behavior]

OBSERVED REALITY:
• [What the code or process actually does]
• [Unexpected branch, workaround, or hidden dependency]

GAPS:
• [Mismatch between expectation and reality]
• [Missing control, guardrail, or handoff]

ROOT CAUSES:
1. [Why the gap exists]
2. [Organizational or technical cause]

1. [SEVERITY]: [Action item]
2. [SEVERITY]: [Action item]
...
```
