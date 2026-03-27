# Git and Instance Architecture

Use this pattern for systems where code is shared but configuration or data is
instance-specific.

## Two-Layer Rule

- shared repo for code, prompts, and reusable assets
- per-instance branch or workspace for local data, generated artifacts, and
  instance configuration

## Good Fit

- self-hosted agents
- agent fleets with mostly shared behavior
- products where each installation accumulates its own local memory

## Operational Guidance

- fix reusable bugs on the shared branch first
- keep per-instance data out of the shared history
- make sync or deploy tools explicit so branch drift is manageable
