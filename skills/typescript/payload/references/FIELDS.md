# Payload CMS Field Types Reference

Complete reference for all Payload field types with examples.

## Text Field

```ts
import type { TextField } from 'payload'

const textField: TextField = {
  name: 'title',
  type: 'text',
// ... (11 lines trimmed)
    condition: (data) => data.showTitle === true,
  },
}
```

### Slug Field Helper

Built-in helper for auto-generating slugs:

```ts
import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
// ... (12 lines trimmed)
    }),
  ],
}
```

## Rich Text (Lexical)

```ts
import type { RichTextField } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { HeadingFeature, LinkFeature } from '@payloadcms/richtext-lexical'

const richTextField: RichTextField = {
// ... (13 lines trimmed)
    ],
  }),
}
```

### Advanced Lexical Configuration

```ts
import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
// ... (62 lines trimmed)
  }),
  label: false,
}
```

## Relationship

```ts
import type { RelationshipField } from 'payload'

// Single relationship
const singleRelationship: RelationshipField = {
  name: 'author',
// ... (21 lines trimmed)
  relationTo: ['posts', 'pages'],
  hasMany: true,
}
```

## Array

```ts
import type { ArrayField } from 'payload'

const arrayField: ArrayField = {
  name: 'slides',
  type: 'array',
// ... (19 lines trimmed)
    initCollapsed: true,
  },
}
```

## Blocks

```ts
import type { BlocksField, Block } from 'payload'

const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
// ... (26 lines trimmed)
  type: 'blocks',
  blocks: [HeroBlock, ContentBlock],
}
```

## Select

```ts
import type { SelectField } from 'payload'

const selectField: SelectField = {
  name: 'status',
  type: 'select',
// ... (12 lines trimmed)
  hasMany: true,
  options: ['tech', 'news', 'sports'],
}
```

## Upload

```ts
import type { UploadField } from 'payload'

const uploadField: UploadField = {
  name: 'featuredImage',
// ... (5 lines trimmed)
  },
}
```

## Point (Geolocation)

Point fields store geographic coordinates with automatic 2dsphere indexing for geospatial queries.

```ts
import type { PointField } from 'payload'

const locationField: PointField = {
  name: 'location',
// ... (5 lines trimmed)
// Returns [longitude, latitude]
// Example: [-122.4194, 37.7749] for San Francisco
```

### Geospatial Queries

```ts
// Query by distance (sorted by nearest first)
const nearbyLocations = await payload.find({
  collection: 'stores',
  where: {
    location: {
// ... (37 lines trimmed)
    },
  },
})
```

**Note**: Point fields are not supported in SQLite.

## Join Fields

Join fields create reverse relationships, allowing you to access related documents from the "other side" of a relationship.

```ts
import type { JoinField } from 'payload'

// From Users collection - show user's orders
const ordersJoinField: JoinField = {
  name: 'orders',
// ... (17 lines trimmed)
    defaultColumns: ['id', 'createdAt', 'total', 'currency'],
  },
}
```

## Virtual Fields

```ts
import type { TextField } from 'payload'

// Computed from siblings
const computedVirtualField: TextField = {
  name: 'fullName',
// ... (10 lines trimmed)
  type: 'text',
  virtual: 'author.name',
}
```

## Conditional Fields

```ts
import type { UploadField, CheckboxField } from 'payload'

// Simple boolean condition
const enableFeatureField: CheckboxField = {
  name: 'enableFeature',
// ... (25 lines trimmed)
  },
  required: true,
}
```

## Radio

Radio fields present options as radio buttons for single selection.

```ts
import type { RadioField } from 'payload'

const radioField: RadioField = {
  name: 'priority',
// ... (9 lines trimmed)
  },
}
```

## Row (Layout)

Row fields arrange fields horizontally in the admin panel (presentational only).

```ts
import type { RowField } from 'payload'

const rowField: RowField = {
  type: 'row',
  fields: [
// ... (9 lines trimmed)
    },
  ],
}
```

## Collapsible (Layout)

Collapsible fields group fields in an expandable/collapsible section.

```ts
import type { CollapsibleField } from 'payload'

const collapsibleField: CollapsibleField = {
  label: ({ data }) => data?.title || 'Advanced Options',
// ... (7 lines trimmed)
  ],
}
```

## UI (Custom Components)

UI fields allow fully custom React components in the admin (no data stored).

```ts
import type { UIField } from 'payload'

const uiField: UIField = {
  name: 'customMessage',
// ... (6 lines trimmed)
  },
}
```

## Tabs & Groups

```ts
import type { TabsField, GroupField } from 'payload'

// Tabs
const tabsField: TabsField = {
  type: 'tabs',
// ... (24 lines trimmed)
    { name: 'description', type: 'textarea' },
  ],
}
```

## Reusable Field Factories

Create composable field patterns that can be customized with overrides.

```ts
import type { Field, GroupField } from 'payload'

// Utility for deep merging
const deepMerge = <T>(target: T, source: Partial<T>): T => {
  // Implementation would deeply merge objects
// ... (99 lines trimmed)
    },
  },
})
```

## Field Type Guards

Type guards for runtime field type checking and safe type narrowing.

| Type Guard                  | Checks For                                                  | Use When                                 |
| --------------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| `fieldAffectsData`          | Field stores data (has name, not UI-only)                   | Need to access field data or name        |
| `fieldHasSubFields`         | Field contains nested fields (group/array/row/collapsible)  | Need to recursively traverse fields      |
| `fieldIsArrayType`          | Field is array type                                         | Distinguish arrays from other containers |
| `fieldIsBlockType`          | Field is blocks type                                        | Handle blocks-specific logic             |
| `fieldIsGroupType`          | Field is group type                                         | Handle group-specific logic              |
| `fieldSupportsMany`         | Field can have multiple values (select/relationship/upload) | Check for `hasMany` support              |
| `fieldHasMaxDepth`          | Field supports population depth control                     | Control relationship/upload/join depth   |
| `fieldIsPresentationalOnly` | Field is UI-only (no data storage)                          | Exclude from data operations             |
| `fieldIsSidebar`            | Field positioned in sidebar                                 | Separate sidebar rendering               |
| `fieldIsID`                 | Field name is 'id'                                          | Special ID field handling                |
| `fieldIsHiddenOrDisabled`   | Field is hidden or disabled                                 | Filter from UI operations                |
| `fieldShouldBeLocalized`    | Field needs localization handling                           | Proper locale table checks               |
| `fieldIsVirtual`            | Field is virtual (computed/no DB column)                    | Skip in database transforms              |
| `tabHasName`                | Tab is named (stores data)                                  | Distinguish named vs unnamed tabs        |
| `groupHasName`              | Group is named (stores data)                                | Distinguish named vs unnamed groups      |
| `optionIsObject`            | Option is `{label, value}` format                           | Access option properties safely          |
| `optionsAreObjects`         | All options are objects                                     | Batch option processing                  |
| `optionIsValue`             | Option is string value                                      | Handle string options                    |
| `valueIsValueWithRelation`  | Value is polymorphic relationship                           | Handle polymorphic relationships         |

```ts
import { fieldAffectsData, fieldHasSubFields, fieldIsArrayType } from 'payload'

function processField(field: Field) {
  if (fieldAffectsData(field)) {
// ... (7 lines trimmed)
  }
}
```

See [FIELD-TYPE-GUARDS.md](FIELD-TYPE-GUARDS.md) for detailed usage patterns.
