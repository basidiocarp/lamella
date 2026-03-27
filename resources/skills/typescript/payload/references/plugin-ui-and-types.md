# Plugin UI and Type Patterns

## Admin Components

Client components belong under explicit entry points and should use Payload UI hooks rather than app-local assumptions.

```tsx
'use client'

import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

export const CustomFieldComponent: TextFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField<string>({ path })
  return <input value={value ?? ''} onChange={(e) => setValue(e.target.value)} />
}
```

## Export Surfaces

Keep server, client, and type exports separate:

```ts
// src/exports/types.ts
export type { MyPluginConfig } from "../types.js"

// src/exports/rsc.ts
export { BeforeDashboardServer } from "../components/BeforeDashboardServer.js"
```

## TypeScript Extension Patterns

- use Payload’s exported types directly
- use module augmentation sparingly and only for stable plugin contracts
- add schema extensions only when generated types truly need plugin-specific metadata

If a plugin needs complex UI and schema augmentation, document the public contract explicitly so consumers know which parts are safe to rely on.
