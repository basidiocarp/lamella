# Sensitive Data

Telemetry data is broadly accessible within an organization and often shipped to third-party backends. Treat it with the same care as application logs.

## Never Instrument

These values must not appear in any span attribute, metric label, or log field:

| Category | Examples |
|----------|---------|
| Credentials | Passwords, API keys, tokens, secrets, private keys |
| Authentication material | Session cookies, OAuth tokens, JWTs (full value) |
| PII — identity | Full name, date of birth, government ID numbers |
| PII — contact | Email address, phone number, physical address |
| PII — financial | Credit card numbers, bank account numbers, CVV |
| PII — health | Diagnosis codes, prescription data, health record IDs |
| PII — location | GPS coordinates, precise location history |
| Biometric data | Fingerprints, facial recognition vectors |

## High-Risk Fields That Need Evaluation

These fields may be safe in your context but require a deliberate decision:

| Field | Risk | Mitigation |
|-------|------|-----------|
| User ID / account ID | Low if opaque, high if it encodes PII | Use an opaque internal ID |
| IP address | PII in some jurisdictions (GDPR) | Hash or drop at collector |
| User agent string | Low individually, fingerprintable in aggregate | Drop or truncate |
| Request headers | May contain Authorization, Cookie | Allowlist specific safe headers only |
| Query parameters | May contain tokens or PII | Strip or redact before recording |
| Error messages | May echo back user input | Sanitize before recording |
| Database query text | May contain literal values | Parameterize; record `db.query.text` with placeholders only |
| HTTP request/response body | Almost always contains sensitive data | Do not record by default |

## URL Sanitization

Strip credentials and query parameters before recording URLs in span attributes:

```python
# Good: record parameterized path, not the full URL with query string
span.set_attribute("url.path", "/orders/{order_id}")
span.set_attribute("http.response.status_code", 200)

# Bad: full URL may contain tokens or PII in query params
span.set_attribute("url.full", "https://api.example.com/orders?token=abc123&email=user@example.com")
```

OTel semantic conventions: use `url.path` for the path, `url.scheme` + `server.address` for the host. Never put credentials in `url.full`.

## Database Query Sanitization

Record the query template, not the query with literal values:

```go
// Good: parameterized template
span.SetAttributes(attribute.String("db.query.text", "SELECT * FROM orders WHERE id = $1"))

// Bad: literal value leaks data
span.SetAttributes(attribute.String("db.query.text", "SELECT * FROM orders WHERE id = 'user@example.com'"))
```

Most OTel DB instrumentation libraries sanitize by default. Confirm this is enabled before disabling the feature.

## Collector-Level Redaction

If sensitive values leak into telemetry despite SDK-level controls, redact them in the OTel Collector before export using the `redaction` processor or attribute-filtering transform. This is a last defense, not a substitute for not collecting the data in the first place.
