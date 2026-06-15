# Poka-Yoke Examples

## Type-Level Guardrails

- prefer discriminated unions over free-form status strings
- use branded or validated values for money, ids, and config

## Preconditions

- validate once at boundaries
- use early returns or parsing functions to prevent invalid downstream state

```typescript
const amount = validatePositive(req.body.amount)
processPayment(amount)
```
