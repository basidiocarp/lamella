# Atmos Manifest Schema Structure

Use this page as the routing layer for the Atmos manifest schema layout.

## Load Order

| Need | Reference |
| --- | --- |
| top-level schema shape and validation gates | `schema-top-level.md` |
| manifest sections and definition families | `schema-definitions.md` |
| backends, workflows, and website-only extensions | `schema-specialized-sections.md` |

## Core Rules

- start with the top-level shape before inspecting individual definitions
- treat the website schema as the richest public reference surface
- keep workflow-only and stack-only validation logic distinct in your mental model
