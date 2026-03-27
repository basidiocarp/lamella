# Pydantic V2 Schemas

Use this reference for the main Pydantic v2 model patterns in FastAPI and modern
Python services.

## Core Schema Patterns

Common model needs:
- field constraints with `Field(...)`
- `field_validator` for per-field rules
- `model_validator` for cross-field validation
- separate create, update, and response schemas

Prefer explicit request and response models over one schema that tries to do
everything.

## ORM / Attribute Loading

Use:

```python
model_config = {"from_attributes": True}
```

This replaces the old `orm_mode` pattern. Use `model_validate(...)` to build a
response model from ORM objects.

## Nested Models

Nested Pydantic models work well when:
- the response shape is stable
- the nesting is part of the API contract
- you want schema generation to stay explicit

Use `default_factory` for list or dict defaults instead of mutable literals.

## Serialization Controls

Reach for aliases and schema extras when the public API naming differs from the
internal model naming. Keep alias behavior deliberate; overusing it makes models
harder to read.

## Settings

Pydantic settings moved to `pydantic-settings`.

Use settings models for:
- environment variables
- `.env` loading
- shared typed configuration defaults

Keep runtime settings separate from request/response schemas.

## V1 to V2 Mapping

| V1 | V2 |
|---|---|
| `@validator` | `@field_validator` |
| `@root_validator` | `@model_validator` |
| `class Config` | `model_config = {}` |
| `orm_mode = True` | `from_attributes = True` |
| `.dict()` | `.model_dump()` |
| `.parse_obj()` | `.model_validate()` |

Use this as a migration and authoring checklist when writing new schemas.
