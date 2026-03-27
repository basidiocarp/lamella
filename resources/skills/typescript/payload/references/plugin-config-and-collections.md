# Plugin Config and Collection Patterns

## Preserve Existing Config

Always merge into incoming config instead of rebuilding it:

```ts
return {
  ...config,
  collections: [...(config.collections || []), redirectsCollection],
}
```

## Collection Transform Pattern

```ts
collections: config.collections?.map((collection) => {
  const isEnabled = options.collections?.includes(collection.slug)
  if (!isEnabled) return collection

  return {
    ...collection,
    fields: [...collection.fields, seoField],
  }
})
```

## Hook Composition

```ts
hooks: {
  ...collection.hooks,
  afterChange: [myHook, ...(collection.hooks?.afterChange || [])],
}
```

## Override Pattern

Let users override defaults without replacing the whole implementation:

```ts
const collection: CollectionConfig = {
  slug: "redirects",
  fields: defaultFields,
  ...options.overrides,
}
```

## Advanced Runtime Config

Use sanitization when the plugin accepts many booleans or nested config objects. Normalize once, then rely on the sanitized shape throughout the plugin.
