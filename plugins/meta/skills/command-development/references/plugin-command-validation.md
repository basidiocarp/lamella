# Plugin Command Validation

Validate plugin commands before shipping them.

## Required Checks

- frontmatter parses cleanly
- referenced plugin files exist
- `${CLAUDE_PLUGIN_ROOT}` paths are spelled correctly
- allowed tools match the real execution pattern
- examples and docs do not reference stale resource paths

## Fast Validation Pass

1. Confirm the command is discoverable from the manifest path.
2. Confirm each plugin-local script or template exists.
3. Load the command in Claude Code or the local validator.
4. Run one representative invocation.
