# React Pattern Agent Notes

## Purpose

This file is the routing index for the focused React and Next.js rule files in `rules/`. Use it to pick the right category fast, then read the specific rule file that matches the problem. The detailed rule files are the source of truth; this overview only tells you where to look first.

---

## Source of Truth

- `rules/`: authoritative focused guidance for React and Next.js performance work.
- This file: routing order and category map.

When this overview and a specific rule file disagree, the specific rule file wins.

---

## Before You Start

Before changing code, verify:

1. **Priority**: solve the biggest performance class first.
2. **Category**: choose the rule group that matches the real bottleneck.
3. **Specific rule**: read the focused rule file before writing code.

---

## Preferred Commands

Use these for most work:

```bash
rg "async-|bundle-|server-|client-|rerender-|rendering-|advanced-" rules
fd . rules
```

For targeted work:

```bash
sed -n '1,120p' rules/<rule-file>.md
```

---

## Repo Architecture

This is a routing layer over a deeper rule set. The overview should stay short, ordered, and practical. The rule files should carry the real implementation guidance.

Key boundaries:

- this file: category order and routing
- `rules/async-*`: waterfall and async guidance
- `rules/bundle-*`, `rules/server-*`, `rules/client-*`, `rules/rerender-*`, `rules/rendering-*`, `rules/js-*`, `rules/advanced-*`: focused problem-specific rules

Current direction:

- Fix waterfalls before micro-optimizations
- Fix bundle shape before low-level rerender tweaks
- Use low-level JavaScript patterns last, not first

---

## Working Rules

- Eliminate waterfalls first.
- Reduce bundle size before tuning fine-grained rerender behavior.
- Fix server fetch and caching mistakes before low-level client work.
- Use JavaScript micro-patterns only after the bigger structural issues are gone.
- Treat this file as an index, not the final word.

---

## Done Means

A task is not complete until:

- [ ] The bottleneck category was identified first
- [ ] The focused rule file, not just this index, informed the change
- [ ] The final recommendation or code change reflects the priority order in this file

If you skipped the focused rule files, say so clearly and explain why.
