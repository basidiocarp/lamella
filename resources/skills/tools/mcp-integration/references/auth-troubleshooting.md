# Auth Troubleshooting

Use this checklist when the MCP server exists but authentication still fails.

## OAuth Failures

- Sign out and sign back in if the flow loops.
- Check whether new scopes were added and require re-consent.
- Confirm the server advertises the right redirect and OAuth metadata.

## Token Failures

- Check that the expected environment variables are actually exported.
- Confirm the header name matches the provider documentation.
- Verify the token belongs to the right workspace, tenant, or region.

## Stdio Failures

- Print the effective environment in the launching shell, not in the repo docs.
- Confirm the child process actually receives the variables you configured.
- Check that shell-specific setup scripts are not silently failing on Windows.

## Practical Rule

When debugging auth, isolate one variable at a time: transport, credential
value, header name, tenant scoping, then authorization scope.
