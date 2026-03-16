# Role-Based Testing Patterns

Role-based access control testing using Playwright MCP.

## Role-Resource Matrix

```
| Resource   | Guest | User | Admin |
|------------|-------|------|-------|
| /home      | Yes   | Yes  | Yes   |
| /dashboard | No    | Yes  | Yes   |
| /admin     | No    | No   | Yes   |
```

## Workflow

### 1. Prepare Role Testing
- Identify all roles and hierarchy
- Map permissions per role
- Prepare test credentials

### 2. Guest Role Testing
- Verify public pages load correctly
- Verify protected pages redirect to login or show 403
- Verify registration/login forms accessible

### 3. Authenticated Role Testing (per role)
1. Login as role
2. Test accessible pages (verify content loads)
3. Test blocked pages (verify 403/redirect)
4. Test role-specific actions
5. Logout and verify session cleared

### 4. Cross-Role Security Tests
- **Session isolation**: Login as User A, try accessing User B's data
- **Privilege escalation**: Login as regular user, attempt admin API calls
- **IDOR testing**: Access resources by ID that belong to other users

## Role Login Pattern
```
browser_navigate({ url: "/login" })
browser_fill_form({ fields: [email, password] })
browser_click({ element: "Login" })
browser_wait_for({ text: "Dashboard" })
browser_snapshot()  # Verify logged in
```

## Access Verification Pattern
```
browser_navigate({ url })
snapshot = browser_snapshot()
if shouldHaveAccess:
    verify(snapshot.contains(expectedContent))
else:
    verify(snapshot.contains("Access Denied") or redirected to /login)
```

## Best Practices
1. Test every role — never skip
2. Test both access AND denial
3. Clean session between roles (logout)
4. Check console errors on each page
