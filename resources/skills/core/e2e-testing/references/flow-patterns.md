# Flow Testing Patterns

Common end-to-end flow patterns for Playwright MCP testing.

## Standard Test Plan Location

Plan file: `tests/e2e-test-plan.md`. If missing, generate plan first.

## Common Flow Patterns

### Registration Flow
```
1. Navigate to /register
2. Fill form (name, email, password, confirm)
3. Submit → wait for success/redirect
4. Verify account (email verification if needed)
5. Verify can login with new credentials
```

### Login Flow
```
1. Navigate to /login
2. Enter credentials
3. Submit → wait for dashboard/welcome
4. Verify session (access protected pages)
```

### Password Reset Flow
```
1. Navigate to /forgot-password
2. Enter email → submit
3. Navigate to reset link
4. Set new password → submit
5. Verify can login with new password
```

### CRUD Flow
```
1. Navigate to list → note initial count
2. Create: fill form → save → verify appears in list
3. Read: click item → verify details displayed
4. Update: edit → save → verify changes
5. Delete: confirm → verify removed from list
```

### Checkout Flow (E-commerce)
```
1. Add item to cart → verify cart updated
2. View cart → verify items and price
3. Proceed to checkout → fill shipping
4. Enter payment → submit
5. Verify order confirmation
6. Verify order in history
```

## Error Case Patterns

- **Invalid input**: Fill form with bad data → verify error messages → verify form not submitted
- **Network errors**: Introduce network issue → verify graceful handling + user notification
- **Session timeout**: Clear session → attempt action → verify redirect to login

## Best Practices

1. Test happy path first
2. Verify state persists between steps
3. Test error cases for each flow
4. Capture snapshots at each step
5. Clean up state between flow tests
