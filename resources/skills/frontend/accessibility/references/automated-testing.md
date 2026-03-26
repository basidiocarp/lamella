# Automated Testing

## axe-core Integration

```javascript
// axe-core integration
const axe = require('axe-core');

async function runAccessibilityAudit(page) {
  await page.addScriptTag({ path: require.resolve('axe-core') });

  const results = await page.evaluate(async () => {
    return await axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']
      }
    });
  });

  return {
    violations: results.violations,
    passes: results.passes,
    incomplete: results.incomplete
  };
}

// Playwright test example
test('should have no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await runAccessibilityAudit(page);

  expect(results.violations).toHaveLength(0);
});
```

---

## CLI Tools

```bash
# axe-core CLI
npx @axe-core/cli https://example.com

# pa11y
npx pa11y https://example.com

# Lighthouse
npx lighthouse https://example.com --only-categories=accessibility
```

These `npx` commands work the same in Bash, zsh, and PowerShell.

---

## Testing Coverage

| Tool | Detects | Misses |
|------|---------|--------|
| axe-core | ~30-40% of issues | Complex ARIA, visual focus, cognitive issues |
| Lighthouse | Basic issues | Keyboard traps, custom widgets |
| Manual testing | Everything | N/A |

**Remember**: Automated testing catches only ~30-50% of accessibility issues. Manual testing is always required.
