# Testing and Troubleshooting

Use this reference when the MCP server is configured but tool usage is still
failing.

## Discovery Checks

- Run `/mcp` and confirm the server appears.
- Verify the full tool name matches what your command or agent expects.
- Check the input schema for required fields and shape changes.

## Call-Time Checks

- Validate the user input before calling the tool.
- Confirm auth is working before debugging the tool logic itself.
- Distinguish transport failures from schema or permission failures.

## Command Troubleshooting

If a command cannot use the MCP tool:

- check `allowed-tools`
- check for a mismatched server name
- check whether the command assumes a tool that the server does not export

## Practical Rule

When MCP usage fails, debug in this order: server presence, auth, tool name,
schema, then instruction quality.
