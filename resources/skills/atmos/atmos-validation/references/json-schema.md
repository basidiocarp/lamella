# JSON Schema Validation

Use JSON Schema in Atmos for structural validation of component configuration.

## Good Uses

- required fields
- scalar and object types
- patterns and enums
- numeric or array bounds
- conditional validation across component settings

## Atmos-Specific Rules

- schemas validate the resolved component configuration, not only `vars`
- keep schema paths organized under the configured schema base path
- use JSON Schema for structure and shape, not for policy logic better handled
  elsewhere
