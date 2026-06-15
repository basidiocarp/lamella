# Typography Systems

Use typography as a system, not a pile of ad hoc font sizes.

## Core Rules

- Build the type scale from a small number of intentional steps.
- Pair font families by role, not novelty.
- Keep line length, spacing, and wrap behavior readable by default.
- Prefer fluid sizing only when it still respects minimum and maximum bounds.

## Practical Checklist

- define a display, heading, body, caption, and code scale
- use semantic text styles instead of styling every component from scratch
- preload only genuinely critical fonts
- test fallback stacks and missing-font behavior
- audit text contrast and text resizing along with the scale

## Common Patterns

- modular or ratio-based scale
- `clamp()` for fluid display sizes
- semantic text classes or tokens
- variable fonts when they reduce asset count and still behave predictably

## Watch For

- too many font sizes with no clear hierarchy
- decorative headings that destroy readability
- fixed viewport typography with no cap at small or large widths
- line lengths that exceed comfortable reading range
