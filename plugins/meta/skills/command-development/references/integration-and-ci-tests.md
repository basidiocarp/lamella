# Integration and CI Tests

Once structure and manual behavior are correct, verify the command inside its
real ecosystem.

## Integration Targets

- hooks
- MCP servers
- state files or workflow artifacts
- plugin-local scripts and templates

## CI Guidance

- run lightweight validation on every change
- keep one or two representative end-to-end checks for critical commands
- fail the build on stale paths, TODO placeholders, or broken examples
