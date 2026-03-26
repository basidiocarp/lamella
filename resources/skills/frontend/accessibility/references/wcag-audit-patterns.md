---
name: wcag-audit-patterns
description: Conduct WCAG 2.2 accessibility audits with automated testing, manual verification, and remediation guidance. Use when auditing websites for accessibility, fixing WCAG violations, or implementing accessible design patterns.
---

# WCAG Audit Patterns


## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Concepts](#core-concepts)
- [Common Violations by Impact](#common-violations-by-impact)
- [Quick Audit Checklist](#quick-audit-checklist)
- [Automated Testing](#automated-testing)
- [Best Practices](#best-practices)
- [Resources](#resources)
- [Reference Files](#reference-files)


Comprehensive guide to auditing web content against WCAG 2.2 guidelines with actionable remediation strategies.

## When to Use This Skill

- Conducting accessibility audits
- Fixing WCAG violations
- Implementing accessible components
- Preparing for accessibility lawsuits
- Meeting ADA/Section 508 requirements

## Core Concepts

### WCAG Conformance Levels

| Level | Description | Required For |
|-------|-------------|--------------|
| **A** | Minimum accessibility | Legal baseline |
| **AA** | Standard conformance | Most regulations |
| **AAA** | Enhanced accessibility | Specialized needs |

### POUR Principles

| Principle | Question |
|-----------|----------|
| **Perceivable** | Can users perceive the content? |
| **Operable** | Can users operate the interface? |
| **Understandable** | Can users understand the content? |
| **Robust** | Does it work with assistive tech? |

## Common Violations by Impact

**Critical (Blockers):**
- Missing alt text for functional images
- No keyboard access to interactive elements
- Missing form labels
- Auto-playing media without controls

**Serious:**
- Insufficient color contrast
- Missing skip links
- Inaccessible custom widgets
- Missing page titles

**Moderate:**
- Missing language attribute
- Unclear link text
- Missing landmarks
- Improper heading hierarchy

## Quick Audit Checklist

### Level A (Must Have)
- [ ] All images have alt text (decorative: `alt=""`)
- [ ] All form inputs have labels
- [ ] All functionality keyboard accessible
- [ ] No keyboard traps
- [ ] Page has `<html lang="en">`
- [ ] Skip to main content link present

### Level AA (Should Have)
- [ ] Text contrast: 4.5:1 (large text: 3:1)
- [ ] UI component contrast: 3:1
- [ ] Focus indicator visible
- [ ] Text resizes to 200% without loss
- [ ] Headings and labels descriptive

## Automated Testing

```bash
# CLI tools
npx @axe-core/cli https://example.com
npx pa11y https://example.com
npx lighthouse https://example.com --only-categories=accessibility
```

```javascript
// Playwright + axe-core
test('should have no accessibility violations', async ({ page }) => {
  await page.goto('/');
  await page.addScriptTag({ path: require.resolve('axe-core') });
  const results = await page.evaluate(async () => {
    return await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
    });
  });
  expect(results.violations).toHaveLength(0);
});
```

**Note:** Automated testing catches only ~30-50% of issues. Manual testing required.

## Best Practices

### Do's
- Start early — accessibility from design phase
- Test with real users — disabled users provide best feedback
- Use semantic HTML — reduces ARIA needs
- Document patterns — build accessible component library

### Don'ts
- Don't rely only on automated testing
- Don't use ARIA as first solution — native HTML first
- Don't hide focus outlines — keyboard users need them
- Don't disable zoom — users need to resize
- Don't use color alone — multiple indicators needed

## Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [WebAIM](https://webaim.org/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [axe DevTools](https://www.deque.com/axe/)

## Reference Files

| File | Description |
|------|-------------|
| [perceivable-checklist.md](perceivable-checklist.md) | Full WCAG Principle 1 checklist |
| [operable-checklist.md](operable-checklist.md) | Full WCAG Principle 2 checklist |
| [understandable-checklist.md](understandable-checklist.md) | Full WCAG Principle 3 checklist |
| [robust-checklist.md](robust-checklist.md) | Full WCAG Principle 4 checklist |
| [remediation-patterns.md](remediation-patterns.md) | Fix patterns for common issues |
| [automated-testing.md](automated-testing.md) | axe-core integration examples |
