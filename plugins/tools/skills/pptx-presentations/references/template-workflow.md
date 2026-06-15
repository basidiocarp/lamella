# Template Workflow

Use this workflow when building a presentation from an existing PPTX template.

## Recommended Flow

1. extract template text and slide thumbnails
2. inventory the available layouts
3. map content to real template slides
4. duplicate or reorder the chosen slides
5. extract placeholder text inventory
6. generate replacement text JSON
7. apply replacements and review the output

## Layout Rule

Match content to the actual template structure:

- one idea for one-column slides
- exactly two items for two-column slides
- image layouts only when images are available
- quote layouts only for actual quotations

## Practical Rule

Do the layout mapping before writing replacement text. Most bad template output
comes from forcing the wrong content into the wrong slide structure.
