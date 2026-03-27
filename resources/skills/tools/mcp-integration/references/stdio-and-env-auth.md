# Stdio and Environment Variable Auth

Use this pattern for local MCP servers launched as child processes.

## Pass Secrets Through `env`

```json
{
  "database": {
    "command": "python",
    "args": ["-m", "mcp_server_db"],
    "env": {
      "DATABASE_URL": "${DATABASE_URL}",
      "DB_USER": "${DB_USER}",
      "DB_PASSWORD": "${DB_PASSWORD}"
    }
  }
}
```

This keeps the server portable and lets the user own credential loading in
their shell or `.env` process.

## User Setup Pattern

```bash
export DATABASE_URL="postgresql://localhost/mydb"
export DB_USER="myuser"
export DB_PASSWORD="mypassword"
```

## Practical Rules

- Keep credential names explicit.
- Do not hardcode secrets in `.mcp.json` or `plugin.json`.
- Prefer one env var per credential rather than packing everything into one
  undocumented blob.
- If the server only needs one connection string, document that and avoid
  extra variables.
