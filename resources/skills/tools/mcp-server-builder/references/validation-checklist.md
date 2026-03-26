# MCP Validation Checklist

## Structural Integrity

- [ ] Tool names are unique across the manifest
- [ ] Tool names use lowercase snake_case
- [ ] `inputSchema.type` is `object`
- [ ] Every `required` field exists in `properties`

## Descriptive Quality

- [ ] All tools include actionable descriptions
- [ ] Descriptions start with a verb
- [ ] Parameter descriptions explain expected values, not just types

## Security and Safety

- [ ] Secrets do not appear in tool schemas
- [ ] Destructive tools require explicit confirmation input
- [ ] Tools do not accept arbitrary URLs or file paths without validation

## Runtime and Error Handling

- [ ] Error responses use consistent structure
- [ ] Timeout behavior is documented
- [ ] Large responses are paginated or truncated
