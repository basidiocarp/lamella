# Component Lifecycle

Claude Code loads plugin components during plugin initialization, then activates
them later when the user or runtime triggers them.

## Lifecycle Stages

1. discovery
2. parsing
3. registration
4. activation

## Design Implication

Treat discovery-time paths, metadata, and startup assumptions as part of the
plugin contract. If a component is not discoverable at load time, users will
never reach the more interesting runtime behavior.
