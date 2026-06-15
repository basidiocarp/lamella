# Common Harness Patterns

Use this reference as the routing layer for common fuzz-harness shapes.

## Pattern Families

- fixed-width primitive extraction
- structured input with `FuzzedDataProvider`
- interleaved or multi-operation harnesses

## Rule

Pick the simplest harness shape that still exercises the target realistically. If the harness becomes more complex than the code under test, split the target or introduce structure-aware input handling deliberately.
