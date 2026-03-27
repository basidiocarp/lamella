# Variant Applicability and Test Setup

## 1. Confirm the Rule Transfers

Before writing anything, answer four questions:

1. Does the same vulnerability class exist in the target language?
2. Are there equivalent source APIs?
3. Are there equivalent sink APIs?
4. Are there sanitizers or safe idioms you must model explicitly?

Document the verdict in a short note:

```text
TARGET: golang
VERDICT: APPLICABLE
REASONING: SQL injection exists in Go via database/sql when queries are built
from untrusted input instead of placeholders.
EQUIVALENT_CONSTRUCTS:
  - Source: r.URL.Query().Get(), r.FormValue()
  - Sink: db.Query(), db.Exec(), db.QueryRow()
  - Sanitizer: parameterized queries with placeholders
```

If the target language does not have an equivalent primitive, mark it `NOT_APPLICABLE` and stop there.

## 2. Create the Test Directory

```bash
mkdir python-sql-injection-golang
```

Keep one directory per language port so the test file and rule file stay coupled.

## 3. Build the Test File First

The test file should prove three things:

- the port catches the vulnerable pattern
- the port ignores obvious safe variants
- the port handles the normal calling shapes for that ecosystem

Example Go test file:

```go
package main

import (
    "database/sql"
    "fmt"
    "net/http"
)

func vulnerable(db *sql.DB, r *http.Request) {
    userID := r.URL.Query().Get("id")

    // ruleid: python-sql-injection-golang
    db.Query("SELECT * FROM users WHERE id = " + userID)

    // ruleid: python-sql-injection-golang
    db.Exec(fmt.Sprintf("DELETE FROM users WHERE id = %s", userID))
}

func safe(db *sql.DB, r *http.Request) {
    userID := r.URL.Query().Get("id")

    // ok: python-sql-injection-golang
    db.Query("SELECT * FROM users WHERE id = ?", userID)

    // ok: python-sql-injection-golang
    db.Exec("DELETE FROM users WHERE id = 1")
}
```

## 4. Annotation Rules

Put the annotation on the line immediately before the code it governs:

```go
// ruleid: my-rule
dangerousCall()

// ok: my-rule
safeCall()
```

## 5. Coverage Checklist

Before moving to rule authoring, make sure the test file includes:

- multiple sink functions
- multiple source shapes if the language has them
- at least one safe case that looks similar to the vulnerable case
- one or two ecosystem-specific variants such as builders, helpers, or wrappers
