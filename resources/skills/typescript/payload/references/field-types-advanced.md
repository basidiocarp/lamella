# Payload Field Types: Relationships, Layout, and Advanced Patterns

Use these fields when the content model needs structure beyond simple scalar content.

## Relationship and Join

```ts
const authorField = {
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
}

const ordersJoinField = {
  name: 'orders',
  type: 'join',
  collection: 'orders',
  on: 'customer',
}
```

Use relationship for forward links and join for reverse access patterns.

## Array and Blocks

```ts
const slidesField = {
  name: 'slides',
  type: 'array',
  fields: [{ name: 'title', type: 'text' }],
}

const contentBlocks = {
  name: 'layout',
  type: 'blocks',
  blocks: [HeroBlock, ContentBlock],
}
```

Use:
- array for repeated uniform items
- blocks for repeated heterogeneous sections

## Point and Virtual

```ts
const locationField = {
  name: 'location',
  type: 'point',
}

const fullNameField = {
  name: 'fullName',
  type: 'text',
  virtual: true,
}
```

Point supports geospatial queries. Virtual fields are for computed or projected values, not persisted source data.

## Layout Fields

```ts
const rowField = {
  type: 'row',
  fields: [{ name: 'firstName', type: 'text' }, { name: 'lastName', type: 'text' }],
}

const collapsibleField = {
  label: 'Advanced Options',
  type: 'collapsible',
  fields: [{ name: 'debugMode', type: 'checkbox' }],
}
```

These are admin-UX tools. They do not change persistence semantics by themselves.

## UI Fields

```ts
const uiField = {
  name: 'customMessage',
  type: 'ui',
}
```

Use UI fields for admin-only helpers or custom rendering. Do not use them as a substitute for proper persisted data fields.
