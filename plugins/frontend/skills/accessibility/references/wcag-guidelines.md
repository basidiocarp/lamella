# WCAG 2.2 Guidelines

Use this page as the routing layer for WCAG work in Lamella.

## Load Order

| Need | Reference |
| --- | --- |
| principle 1 checks for text alternatives, media, contrast, and reflow | `perceivable-checklist.md` |
| principle 2 checks for keyboard access, focus, timing, and target size | `operable-checklist.md` |
| principle 3 checks for readability, predictability, and form help | `understandable-checklist.md` |
| principle 4 checks for compatibility, ARIA, and status messaging | `robust-checklist.md` |
| modal, tabs, live regions, and other widget-specific ARIA guidance | `aria-patterns.md` |
| audit method, triage, and remediation workflow | `wcag-audit-patterns.md` |
| mobile-specific VoiceOver and TalkBack guidance | `mobile-accessibility.md` |

## Conformance Targets

- Level A: minimum acceptable accessibility
- Level AA: normal production target
- Level AAA: optional enhancement, not a blanket default

Most product teams should target WCAG 2.2 AA and document any known
exceptions explicitly.

## Core Rules

- Start with semantic HTML before adding ARIA.
- Verify keyboard and screen-reader behavior, not only visual output.
- Treat target size, focus visibility, and non-text contrast as product-level
  requirements, not polish.
- Pair automated checks with manual assistive-tech testing.

## Fast Triage

- Broken structure or missing alternatives: load `perceivable-checklist.md`
- Keyboard or focus issues: load `operable-checklist.md`
- Form confusion or inconsistent behavior: load `understandable-checklist.md`
- Screen reader or ARIA issues: load `robust-checklist.md` and
  `aria-patterns.md`
