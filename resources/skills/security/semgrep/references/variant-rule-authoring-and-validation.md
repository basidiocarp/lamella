# Variant Rule Authoring and Validation

## 1. Inspect the Target AST

Start with the target-language test file, not the original rule:

```bash
semgrep --dump-ast -l go python-sql-injection-golang.go
```

Look for:

- function and method call shapes
- how concatenation appears
- how formatting helpers appear
- whether member access or receivers change the pattern shape

## 2. Draft the Ported Rule

Example:

```yaml
rules:
  - id: python-sql-injection-golang
    mode: taint
    languages: [go]
    message: Untrusted input flows into a SQL execution API.
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
      - patterns:
          - pattern: $DB.QueryRow($QUERY, ...)
          - focus-metavariable: $QUERY
```

## 3. Update the Metadata

For every language port:

- change `id` to include the target language
- set `languages` to the new language only
- adjust the message only when the language needs different terminology
- record the original rule in metadata

## 4. Validate Before Testing

```bash
semgrep --validate --config python-sql-injection-golang.yaml
```

Fix YAML or schema errors before you run tests. Otherwise you end up debugging two failures at once.

## 5. Run the Test File

```bash
semgrep --test \
  --config python-sql-injection-golang.yaml \
  python-sql-injection-golang.go
```

Pass criteria:

- all `ruleid:` lines are reported
- all `ok:` lines stay clean

## 6. When Taint Rules Misbehave

Use dataflow traces:

```bash
semgrep --dataflow-traces \
  -f python-sql-injection-golang.yaml \
  python-sql-injection-golang.go
```

Check:

- whether the source was recognized
- where the taint path breaks
- whether the sink is too broad or too narrow
- whether you need a sanitizer or exclusion pattern
