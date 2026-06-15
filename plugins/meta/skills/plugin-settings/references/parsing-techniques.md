# Settings File Parsing Techniques

Use this page as the routing layer for reading and updating
`.claude/plugin-name.local.md` files.

## Load Order

| Need | Reference |
| --- | --- |
| frontmatter and body extraction | `frontmatter-and-body-parsing.md` |
| value extraction and validation patterns | `field-extraction-and-validation.md` |
| safe updates and atomic writes | `updating-settings-files.md` |

## Core Rules

- treat frontmatter parsing as structured data handling, not free-form grep
- use atomic writes for updates
- validate required fields and numeric ranges before using settings values
