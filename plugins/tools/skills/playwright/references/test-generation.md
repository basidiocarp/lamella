# Test Generation

Use generated Playwright code as a starting point, not the final test.

## Workflow

1. interact with the page using `playwright-cli`
2. capture the generated code from the output
3. move it into a real test file
4. add assertions and cleanup

## Example

```typescript
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/dashboard/);
});
```

## Practical Rules

- Prefer semantic locators.
- Add assertions manually.
- Clean up generated noise before checking the test in.
