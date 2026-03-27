# Init, Build, and Validate

These commands handle the normal Packer lifecycle inside Atmos.

## Core Pattern

- `init` prepares plugins and template dependencies
- `build` creates artifacts
- `validate` checks syntax and configuration before the expensive run

## Rule

Keep template selection explicit when a component has more than one Packer file.
Use pass-through flags after `--` only for real native Packer behavior.
