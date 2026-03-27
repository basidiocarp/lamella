# Variant Worked Example

This example ports a Python SQL injection rule to Go.

## Original Python Intent

The source rule catches untrusted request input flowing into SQL execution calls.

Core semantics:

- user-controlled input from request helpers
- string-built query reaches a SQL execution sink
- parameterized queries remain safe

## Port Decision

```text
TARGET: golang
VERDICT: APPLICABLE
REASONING: database/sql exposes raw query execution functions and Go handlers
commonly read request data directly from URL or form helpers.
```

## Test File

```go
package main

import (
    "database/sql"
    "fmt"
    "net/http"
)

func demo(db *sql.DB, r *http.Request) {
    userID := r.URL.Query().Get("id")
    username := r.FormValue("username")

    // ruleid: python-sql-injection-golang
    db.Query("SELECT * FROM users WHERE id = " + userID)

    // ruleid: python-sql-injection-golang
    db.Exec(fmt.Sprintf("DELETE FROM users WHERE username = '%s'", username))

    // ok: python-sql-injection-golang
    db.Query("SELECT * FROM users WHERE id = ?", userID)

    // ok: python-sql-injection-golang
    db.Exec("DELETE FROM users WHERE id = 1")
}
```

## Rule File

```yaml
rules:
  - id: python-sql-injection-golang
    mode: taint
    languages: [go]
    message: Untrusted input reaches a SQL execution API.
    severity: ERROR
    metadata:
      original-rule: python-sql-injection
      ported-from: python
    pattern-sources:
      - patterns:
          - pattern: $REQ.URL.Query().Get(...)
          - focus-metavariable: $REQ
      - patterns:
          - pattern: $REQ.FormValue(...)
          - focus-metavariable: $REQ
    pattern-sinks:
      - patterns:
          - pattern: $DB.Query($QUERY, ...)
          - focus-metavariable: $QUERY
      - patterns:
          - pattern: $DB.Exec($QUERY, ...)
          - focus-metavariable: $QUERY
```

## Validation Loop

```bash
semgrep --validate --config python-sql-injection-golang.yaml
semgrep --test --config python-sql-injection-golang.yaml python-sql-injection-golang.go
```

If the `fmt.Sprintf` case fails, inspect its AST and add the right pattern shape rather than loosening every sink.
