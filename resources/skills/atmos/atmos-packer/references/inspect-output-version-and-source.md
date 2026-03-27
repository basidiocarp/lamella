# Inspect, Output, Version, and Source

These commands are mainly discovery and inspection tools.

## Focus

- `inspect` reveals variables, builders, and post-processors
- `output` reads the Atmos-managed Packer manifest
- `version` confirms tool compatibility
- `source` surfaces source configuration details

## Rule

Use `output` only after a build has produced a manifest. It is not a substitute
for validating whether the component was actually built.
