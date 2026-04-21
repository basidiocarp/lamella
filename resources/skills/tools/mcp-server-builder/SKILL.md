---
name: mcp-server-builder
description: "Builds MCP server scaffolds from OpenAPI contracts and validates tool manifests before publishing."
origin: lamella
---

# MCP Server Builder

Use this skill when `mcp-integration` is not enough because the server itself
still needs to be built.

## Workflow

1. Start from a stable OpenAPI contract when one exists.
2. Generate a tool manifest and starter server scaffold.
3. Normalize tool names and descriptions before wiring runtime logic.
4. Validate the manifest in strict mode.
5. Add auth, error handling, timeouts, and destructive-action confirmation.

## Commands

Generate a Python scaffold:

```bash
python3 scripts/openapi_to_mcp.py --input openapi.json --server-name billing-mcp --language python --output-dir ./out
```

Generate a TypeScript scaffold:

```bash
python3 scripts/openapi_to_mcp.py --input openapi.json --server-name billing-mcp --language typescript --output-dir ./out
```

Validate a manifest:

```bash
python3 scripts/mcp_validator.py --input out/tool_manifest.json --strict
```

## Rules

- Prefer `operationId` for tool names.
- Keep one user intent per tool.
- Do not expose secrets in schemas.
- Require explicit confirmation fields for destructive actions.
- Keep error payloads structured and consistent.

## References

- `references/openapi-extraction-guide.md`
- `references/python-server-template.md`
- `references/typescript-server-template.md`
- `references/validation-checklist.md`
