---
name: accessibility
description: "Implements and audits accessible frontend experiences."
origin: lamella
---

# Accessibility

## Contents

- [When to Use](#when-to-use)
- [Core Principles (POUR)](#core-principles-pour)
- [WCAG 2.2 Quick Reference](#wcag-22-quick-reference)
- [ARIA Essentials](#aria-essentials)
- [Keyboard Navigation](#keyboard-navigation)
- [Color Contrast](#color-contrast)
- [Common Patterns](#common-patterns)
- [Testing](#testing)
- [Best Practices](#best-practices)
- [References](#references)

## When to Use

- Implementing WCAG 2.2 Level AA or AAA compliance
- Building screen reader accessible interfaces
- Adding keyboard navigation to interactive components
- Conducting accessibility audits and fixing violations
- Supporting reduced motion and high contrast preferences
- Building mobile accessibility features (VoiceOver, TalkBack)

## Core Principles (POUR)

| Principle | Question | Key Criteria |
|-----------|----------|-------------|
| **Perceivable** | Can users perceive the content? | Alt text, captions, contrast |
| **Operable** | Can users operate the interface? | Keyboard access, timing, navigation |
| **Understandable** | Can users understand the content? | Readable, predictable, error help |
| **Robust** | Does it work with assistive tech? | Valid markup, ARIA, name/role/value |

## WCAG 2.2 Quick Reference

| Level | Criterion | Description |
|-------|-----------|-------------|
| A | 1.1.1 | Non-text content has text alternatives |
| A | 1.3.1 | Info and relationships programmatically determinable |
| A | 2.1.1 | All functionality keyboard accessible |
| A | 2.4.1 | Skip to main content mechanism |
| AA | 1.4.3 | Contrast ratio 4.5:1 (text), 3:1 (large text) |
| AA | 1.4.11 | Non-text contrast 3:1 |
| AA | 2.4.7 | Focus visible |
| AA | 2.5.8 | Target size minimum 24x24px (NEW in 2.2) |

For full per-principle checklists, see references.

## ARIA Essentials

- **Roles**: Define element purpose (`button`, `dialog`, `navigation`)
- **States**: Indicate condition (`aria-expanded`, `aria-selected`, `aria-disabled`)
- **Properties**: Describe relationships (`aria-labelledby`, `aria-describedby`)
- **Live regions**: Announce dynamic changes (`aria-live="polite"`)

**Rule of thumb**: Use native HTML first. Only add ARIA when no semantic equivalent exists.

## Keyboard Navigation

- Tab order must follow visual order
- All interactive elements must be focusable
- Focus indicators must be visible (never `outline: none` without replacement)
- Modals must trap focus and restore it on close
- Skip links for bypassing repetitive content
- Touch targets: minimum 44x44px (AAA) or 24x24px (AA in 2.2)

## Color Contrast

| Text Type | AA Ratio | AAA Ratio |
|-----------|----------|-----------|
| Normal text (<18pt) | 4.5:1 | 7:1 |
| Large text (≥18pt or ≥14pt bold) | 3:1 | 4.5:1 |
| UI components and graphics | 3:1 | — |

## Common Patterns

### Accessible Button

```tsx
<button
  disabled={disabled || isLoading}
  aria-busy={isLoading}
  aria-disabled={disabled || isLoading}
  className="focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px] min-w-[44px]"
>
  {isLoading ? <><span className="sr-only">Loading</span><Spinner aria-hidden /></> : children}
</button>
```

### Skip Navigation

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50">
  Skip to main content
</a>
```

### Live Region

```tsx
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {message}
</div>
```

### Accessible Form Field

```tsx
<label htmlFor="email">
  Email <span className="sr-only">(required)</span>
</label>
<input
  id="email" type="email" required
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : "email-hint"}
/>
```

## Testing

### Automated Tools
```bash
npx @axe-core/cli https://example.com
npx pa11y https://example.com
npx lighthouse https://example.com --only-categories=accessibility
```

**Note:** Automated testing catches only ~30-50% of issues. Manual testing required.

### Screen Reader Testing

| Screen Reader | Platform | Browser | Market Share |
|--------------|----------|---------|-------------|
| JAWS | Windows | Chrome/IE | ~40% |
| NVDA | Windows | Firefox/Chrome | ~31% |
| VoiceOver | macOS/iOS | Safari | ~15% |
| TalkBack | Android | Chrome | ~10% |

For screen reader commands and testing checklists, see [references/screen-reader-testing.md](references/screen-reader-testing.md).

## Best Practices

1. **Use semantic HTML first** — prefer native elements over ARIA
2. **Keyboard first** — design interactions to work without a mouse
3. **Don't disable focus styles** — style them, don't remove them
4. **Provide text alternatives** — all non-text content needs descriptions
5. **Support zoom** — content should work at 200% zoom
6. **Announce changes** — use live regions for dynamic content
7. **Respect preferences** — honor `prefers-reduced-motion` and `prefers-contrast`
8. **Test with real assistive tech** — not just automated tools

## References

### Audit & Compliance
- [wcag-audit-patterns.md](references/wcag-audit-patterns.md) — Audit methodology, violation checklist, remediation patterns
- [perceivable-checklist.md](references/perceivable-checklist.md) — WCAG Principle 1 checklist
- [operable-checklist.md](references/operable-checklist.md) — WCAG Principle 2 checklist
- [understandable-checklist.md](references/understandable-checklist.md) — WCAG Principle 3 checklist
- [robust-checklist.md](references/robust-checklist.md) — WCAG Principle 4 checklist
- [remediation-patterns.md](references/remediation-patterns.md) — Fix patterns for common issues
- [automated-testing.md](references/automated-testing.md) — axe-core integration examples

### ARIA & Screen Readers
- [screen-reader-testing.md](references/screen-reader-testing.md) — VoiceOver, NVDA, JAWS commands and testing checklists
- [screen-reader-commands.md](references/screen-reader-commands.md) — Full command reference
- [aria-patterns.md](references/aria-patterns.md) — Modal, live region, and tab patterns

### Mobile & Guidelines
- [mobile-accessibility.md](references/mobile-accessibility.md) — Mobile accessibility guidance for iOS, Android, and React Native
- [wcag-guidelines.md](references/wcag-guidelines.md) — WCAG 2.2 routing guide into the per-principle checklists
### Additional Resources

- [Testing Checklists](references/testing-checklists.md)
