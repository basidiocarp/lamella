# Page Testing Patterns

Systematic page-level testing using Playwright MCP.

## Workflow

### Step 0: Build & Verify URL (CRITICAL)
```bash
npm install && npm run build
```
Verify URL: Try base_url, then common ports (8000, 8080, 3000, 5173, 5000, 4200).

### Steps 1-6: Testing Cycle

| Step | Action |
|------|--------|
| 1. Page Inventory | List pages, categorize (public/auth/admin) |
| 2. Page Load | Navigate, wait, snapshot, check console/network |
| 3. Element Verify | Navigation, main content, forms, footer |
| 4. Interaction | Links, buttons, forms, dropdowns |
| 5. Error Detection | Console errors, network errors, visual errors |
| 6. Responsive | Desktop (1920x1080), Tablet (768x1024), Mobile (375x812) |

### Basic Page Test Pattern
```
1. browser_navigate({ url: "/page" })
2. browser_wait_for({ time: 2 })
3. snapshot = browser_snapshot()
4. errors = browser_console_messages({ level: "error" })
5. Assert: snapshot contains expected elements, errors is empty
```

## Best Practices
- Wait for page load before checking elements
- Use snapshots to capture state
- Check console/network for hidden errors
- Test all viewports for responsive issues
