# Task Decomposition Examples

## Example 1: User Authentication (Vertical Slices)

Stream 1: Login (implementer-1)
- Files: `src/pages/login.tsx`, `src/api/login.ts`, `tests/login.test.ts`
- Imports `AuthResponse` from shared types

Stream 2: Registration (implementer-2)
- Files: `src/pages/register.tsx`, `src/api/register.ts`, `tests/register.test.ts`
- Imports `AuthResponse` from shared types

Stream 3: Shared Infrastructure (implementer-3)
- Files: `src/types/auth.ts`, `src/middleware/auth.ts`, `src/utils/jwt.ts`
- No dependencies. Streams 1 and 2 depend on this.

## Example 2: REST CRUD Endpoints (By Layer)

Stream 1: Data Layer -- models, migrations, repositories. No dependencies.
Stream 2: Business Logic -- services, validators. Blocked by Stream 1.
Stream 3: API Layer -- routes, controllers. Blocked by Stream 2.

## Task Template

```markdown
## Objective
{1-2 sentences}

## Owned Files
- {file} -- {purpose}

## Requirements
1. {deliverable}

## Interface Contract
- Exports: {what this stream provides}
- Imports: {what it consumes from others}

## Acceptance Criteria
- [ ] {verifiable criterion}

## Out of Scope
- {excluded work}
```
