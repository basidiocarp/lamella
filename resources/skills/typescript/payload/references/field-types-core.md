# Payload Field Types: Core Content Fields

Use these fields for the primary content model of a collection or global.

## Text and Slug

```ts
const titleField = {
  name: 'title',
  type: 'text',
  required: true,
}

const slugField = {
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
}
```

Use text for short author-entered values. Add slug helpers when routing or URL stability matters.

## Rich Text

```ts
const bodyField = {
  name: 'body',
  type: 'richText',
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, HeadingFeature(), LinkFeature()],
  }),
}
```

Use rich text when structured editorial content matters. Keep advanced Lexical feature sets focused instead of enabling everything by default.

## Select and Radio

```ts
const statusField = {
  name: 'status',
  type: 'select',
  options: ['draft', 'published', 'archived'],
}

const priorityField = {
  name: 'priority',
  type: 'radio',
  options: ['low', 'medium', 'high'],
}
```

Use select for compact menus and radio when seeing all options at once improves editing clarity.

## Upload

```ts
const featuredImageField = {
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
}
```

Use upload for media-backed relations, not arbitrary files without a media model.

## Conditional Content Fields

```ts
const heroTitleField = {
  name: 'heroTitle',
  type: 'text',
  admin: {
    condition: (data) => data.showHero === true,
  },
}
```

Use conditions to reduce editor noise, not to hide core required fields unpredictably.
