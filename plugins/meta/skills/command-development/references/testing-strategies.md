# Command Testing Strategies

Use this page as the routing layer for command validation and testing.

## Load Order

| Need | Reference |
| --- | --- |
| syntax, frontmatter, and structural validation | `structure-and-frontmatter-tests.md` |
| manual invocation, arguments, and interactive behavior | `manual-and-argument-tests.md` |
| integration, automation, and CI coverage | `integration-and-ci-tests.md` |

## Core Rules

- Validate structure before testing behavior.
- Cover at least one real invocation path, not only static linting.
- Test arguments, file references, and interactive flows separately.
- Keep CI checks small and repeatable.
