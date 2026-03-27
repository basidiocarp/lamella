# Iterative Refinement Examples

## Good Pattern

Improve one concern at a time:

```typescript
const calculateTotal = (items: Item[]) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
```

Then add validation, caching, or formatting in separate small steps.

## Anti-Pattern

- validation, optimization, logging, and feature changes all in one rewrite
- impossible to test what broke
- no clear rollback point
