---
name: payload
description: "Guides Payload CMS collections, hooks, access control, and APIs."
origin: lamella
---

# Payload CMS Application Development

Use this skill as the router for Payload application and plugin work. Standard collection setup, field syntax, and Next.js integration basics are assumed.

## When to Use

- collection, field, and hook design
- Local API, REST, or GraphQL query behavior
- access-control bugs and security review
- plugin authoring and package structure
- transaction, adapter, or endpoint behavior

## Core Warnings

1. Local API calls bypass access control unless `overrideAccess: false` is set.
2. Nested Payload operations inside hooks should usually thread `req` through to preserve transaction context.
3. Hook-triggered writes need loop protection via `req.context` or equivalent request-scoped guards.

## Quick Routing

| Need | Reference |
| --- | --- |
| field types and validation | [FIELDS.md](references/FIELDS.md), [field-types-core.md](references/field-types-core.md), [field-types-advanced.md](references/field-types-advanced.md) |
| collection config, auth, upload, drafts | [COLLECTIONS.md](references/COLLECTIONS.md) |
| hook patterns and loop prevention | [HOOKS.md](references/HOOKS.md) |
| access control basics | [ACCESS-CONTROL.md](references/ACCESS-CONTROL.md) |
| advanced access control | [ACCESS-CONTROL-ADVANCED.md](references/ACCESS-CONTROL-ADVANCED.md) |
| queries and Local API behavior | [QUERIES.md](references/QUERIES.md) |
| custom endpoints | [ENDPOINTS.md](references/ENDPOINTS.md), [endpoint-patterns.md](references/endpoint-patterns.md), [endpoint-helpers.md](references/endpoint-helpers.md) |
| adapters and transactions | [ADAPTERS.md](references/ADAPTERS.md) |
| broader advanced platform features | [ADVANCED.md](references/ADVANCED.md) |
| plugin development | [PLUGIN-DEVELOPMENT.md](references/PLUGIN-DEVELOPMENT.md) |

## Common Tasks

| Task | Start Here |
| --- | --- |
| auto-generate slugs | [field-types-core.md](references/field-types-core.md) |
| row-level access or self-service access | [ACCESS-CONTROL.md](references/ACCESS-CONTROL.md) |
| complex access factories or context-aware rules | [ACCESS-CONTROL-ADVANCED.md](references/ACCESS-CONTROL-ADVANCED.md) |
| query by relationship or nested properties | [QUERIES.md](references/QUERIES.md) |
| custom endpoint auth and parsing | [endpoint-patterns.md](references/endpoint-patterns.md) |
| plugin package shape and export surfaces | [plugin-architecture-and-packaging.md](references/plugin-architecture-and-packaging.md) |
| plugin collection transforms and hook composition | [plugin-config-and-collections.md](references/plugin-config-and-collections.md) |

## Load Order by Problem

### Application Model Work

1. `COLLECTIONS.md`
2. `FIELDS.md`
3. one of the `field-types-*` references

### Security or Access Bugs

1. `ACCESS-CONTROL.md`
2. `ACCESS-CONTROL-ADVANCED.md`
3. `QUERIES.md` if Local API behavior is involved

### Plugin Work

1. `PLUGIN-DEVELOPMENT.md`
2. `plugin-architecture-and-packaging.md`
3. `plugin-config-and-collections.md`
4. `plugin-ui-and-types.md` if admin UI or type augmentation is involved

## Minimal Safe Patterns

### Local API on Behalf of a User

```ts
await payload.find({
  collection: "posts",
  user: someUser,
  overrideAccess: false,
})
```

### Hook Operation Inside a Transaction

```ts
await req.payload.update({
  collection: "posts",
  id: doc.id,
  data: { synced: true },
  req,
})
```

### Hook Loop Guard

```ts
if (req.context?.skipResave) return doc
req.context = { ...req.context, skipResave: true }
```

## Resource Boundary

This skill intentionally stays thin. The detailed examples live in the reference files, and those references should be loaded by problem area rather than all at once.
