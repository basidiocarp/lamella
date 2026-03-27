# Coding Style

Use this rule for general readability and structure. Put project-specific
patterns such as immutability, boundary validation, and API response
conventions in [coding-standards.md](./coding-standards.md).

## Readability First

- Prefer clear names over clever abbreviations.
- Keep control flow easy to scan.
- Use early returns to avoid deep nesting.
- Keep related logic together instead of spreading it across distant files.

## Comments

- Explain why, constraints, or non-obvious tradeoffs.
- Do not narrate obvious line-by-line behavior.
- Delete comments that no longer match the code.

## File and Function Shape

- Keep files cohesive and organized by feature or responsibility.
- Split large functions once they stop fitting in one mental pass.
- Extract helpers only when the new name improves clarity.
- Prefer a small number of well-named public entrypoints.

## Formatting

- Use the standard formatter and linter for the language.
- Do not hand-format around the formatter.
- Keep examples and snippets consistent with repo conventions.

## Code Quality Checklist

Before marking work complete:
- [ ] Code is readable and well-named
- [ ] Functions are focused and easy to scan
- [ ] Files have one clear responsibility
- [ ] No deep nesting (>4 levels)
- [ ] Comments explain why, not what
- [ ] Formatting and lint expectations are satisfied
