# Atmos Packer Commands

Use this page as the routing layer for `atmos packer` command behavior.

## Load Order

| Need | Reference |
| --- | --- |
| init, build, and validate flows | `init-build-and-validate.md` |
| inspect, output, version, and source commands | `inspect-output-version-and-source.md` |

## Core Rules

- always distinguish Atmos flags from native Packer flags passed after `--`
- keep `--stack` explicit unless the command truly does not need it
- treat `output` as an Atmos-specific convenience around generated Packer
  manifests
