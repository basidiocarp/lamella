# Gemba Walk Examples

## Example: Authentication System Gemba Walk

```
SCOPE: User authentication flow

ASSUMPTIONS (Before):
• JWT tokens stored in localStorage
• Single sign-on via OAuth only
// ... (38 lines trimmed)
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
// ... (34 lines trimmed)
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
// ... (33 lines trimmed)
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
// ... (24 lines trimmed)
1. [SEVERITY]: [Action item]
2. [SEVERITY]: [Action item]
...
```
