---
name: api-test-suite-builder
description: "Run this when building API test suites — generates scaffolds for route handlers, auth flows, validation rules, and contract edges."
origin: lamella
---

# API Test Suite Builder

Use this skill when generic "write tests" guidance is not enough because the
API surface itself needs systematic coverage.

## Workflow

1. Enumerate the real route surface from the codebase.
2. Confirm auth rules, request schemas, and expected status codes from handlers or specs.
3. Build a route-by-route test matrix before writing files.
4. Generate baseline tests for auth, validation, error codes, pagination, and sensitive fields.
5. Run the suite and trim redundant cases after the safety net exists.

## Coverage Areas

- Authentication and authorization failures
- Request validation and boundary cases
- Error-code matrix for known failure modes
- Pagination and filtering behavior
- File-upload edge cases
- Response-shape checks for sensitive fields

## Rules

- Test observable API behavior, not handler internals.
- Prefer one route group per file so failures stay local.
- Use factories or fixtures instead of hardcoded IDs.
- Verify unauthorized and malformed-input cases before the happy path.
- Keep generated scaffolds honest by checking the current route implementation first.

## References

- `references/example-test-files.md`
