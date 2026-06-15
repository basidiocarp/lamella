# OTTL (OpenTelemetry Transformation Language)

OTTL expressions run inside `transform` and `filter` processors to modify or drop telemetry.

## Contexts

Each statement runs in a context that determines which fields are accessible.

| Context | Available in | Common paths |
|---------|-------------|--------------|
| `span` | `transform`, `filter` | `name`, `status.code`, `attributes["key"]`, `resource.attributes["key"]` |
| `metric` | `transform`, `filter` | `name`, `description`, `unit`, `attributes["key"]` |
| `datapoint` | `transform`, `filter` | `attributes["key"]`, `start_time_unix_nano` |
| `log` | `transform`, `filter` | `body`, `severity_number`, `attributes["key"]`, `resource.attributes["key"]` |
| `spanevent` | `transform` | `name`, `attributes["key"]` |

## Path Expressions

```
attributes["http.method"]          # span/log attribute
resource.attributes["service.name"]  # resource attribute
status.code                        # span status
name                               # span or metric name
body                               # log body
instrumentation_scope.name         # instrumentation library name
```

## Operators and Functions

### Set and delete

```yaml
statements:
  - set(attributes["environment"], "production")
  - set(resource.attributes["service.version"], attributes["version"])
  - delete_key(attributes, "http.user_agent")
  - delete_matching_keys(attributes, "internal\\..*")
```

### Conditional set

```yaml
statements:
  - set(attributes["region"], "us-east-1") where resource.attributes["cloud.region"] == nil
```

### String operations

```yaml
statements:
  - set(attributes["url.path"], Substring(attributes["url.full"], 0, 100))
  - set(name, Concat([resource.attributes["service.name"], name], "/"))
```

### Replace / redact

```yaml
statements:
  # Mask credit card numbers in a log body
  - replace_pattern(body, "\\b\\d{4}-\\d{4}-\\d{4}-\\d{4}\\b", "****-****-****-****")
  # Redact a specific attribute value
  - replace_all_patterns(attributes, "value", "password=\\S+", "password=REDACTED")
```

### Convert type

```yaml
statements:
  - set(attributes["http.status_code"], Int(attributes["http.status_code"]))
```

## transform Processor Examples

### Set attribute and drop another

```yaml
processors:
  transform:
    trace_statements:
      - context: span
        statements:
          - set(attributes["environment"], "production")
          - delete_key(attributes, "db.statement")
    log_statements:
      - context: log
        statements:
          - delete_key(attributes, "user.password")
          - replace_pattern(body, "token=[A-Za-z0-9]+", "token=REDACTED")
```

### Route by attribute (using routing connector)

```yaml
connectors:
  routing:
    default_pipelines: [traces/default]
    error_mode: ignore
    table:
      - statement: route() where attributes["env"] == "prod"
        pipelines: [traces/prod]
      - statement: route() where attributes["env"] == "dev"
        pipelines: [traces/dev]
```

## filter Processor Examples

### Drop health check spans

```yaml
processors:
  filter:
    error_mode: ignore
    traces:
      span:
        - 'attributes["http.route"] == "/healthz"'
        - 'attributes["http.route"] == "/readyz"'
```

### Keep only error logs

```yaml
processors:
  filter:
    error_mode: ignore
    logs:
      log_record:
        - 'severity_number < SEVERITY_NUMBER_ERROR'
```

### Drop a specific metric

```yaml
processors:
  filter:
    error_mode: ignore
    metrics:
      metric:
        - 'name == "go_gc_duration_seconds"'
```

## Where Clause

Any `set`, `delete_key`, or other OTTL function accepts an optional `where` condition:

```yaml
statements:
  - set(attributes["sampled"], "true") where attributes["http.status_code"] == 500
  - delete_key(attributes, "debug.trace") where resource.attributes["env"] == "production"
```

## Error Modes

Both `transform` and `filter` accept `error_mode`:

- `ignore` — log the error and continue evaluating remaining statements (recommended for production).
- `propagate` — stop processing and propagate the error upstream.
- `silent` — skip the statement silently with no log output.
