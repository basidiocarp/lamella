# OpenAPI Extraction Guide

Turn stable API operations into stable MCP tools.

## Rules

1. Prefer `operationId` as the tool name.
2. Fallback naming should sanitize `<method>_<path>` into snake_case.
3. Pull `summary` first for the description, then `description`.
4. Merge path and query parameters into `inputSchema.properties`.
5. Merge `application/json` request body fields when the body is an object.
6. Preserve all required fields from both parameters and the request body.

## Naming Guidance

Good:

- `list_customers`
- `create_invoice`
- `archive_project`

Avoid:

- `tool1`
- `run`
- `get__v1__customer___id`
