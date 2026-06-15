# Payload CMS Field Types Reference

This file is the quick router for Payload field design. Keep the full field catalog split by field family so the skill stays loadable on demand.

## Quick Selection Guide

```text
Use content fields for:
- text
- rich text
- select / radio
- upload

Use relationship and layout fields for:
- relationship
- join
- array
- blocks
- row
- collapsible
- UI-only admin helpers
```

## Design Rules

Prefer:
- the simplest field that matches the editing model
- helper functions for repeated field conventions
- conditional logic only when it reduces admin confusion

Avoid:
- giant all-in-one field definitions
- deeply nested blocks without a clear authoring need
- mixing presentation-only layout concerns into data modeling decisions

## Reference Split

See:
- [`field-types-core.md`](./field-types-core.md)
- [`field-types-advanced.md`](./field-types-advanced.md)

Keep this file as the routing reference. Load the detailed file that matches the field family you need.
