# Design Tokens

Use this page as the routing layer for token-system design.

## Load Order

| Need | Reference |
| --- | --- |
| token categories, naming, and semantic hierarchy | `token-categories-and-naming.md` |
| transforms, Style Dictionary, and platform output generation | `token-transforms-and-platform-output.md` |
| governance, deprecation, and validation | `token-governance-and-validation.md` |

## Core Rules

- separate primitive, semantic, and component tokens
- name tokens by role, not raw color or implementation detail alone
- treat token changes as API changes
- validate references and contrast before publishing generated output
