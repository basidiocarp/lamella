# Animations and Dark Mode Theming

Native CSS animations with v4 and dark mode implementation patterns.

## Pattern 5: Native CSS Animations (v4)

```css
/* In your CSS file - native @starting-style for entry animations */
@theme {
  --animate-dialog-in: dialog-fade-in 0.2s ease-out;
  --animate-dialog-out: dialog-fade-out 0.15s ease-in;
}
// ... (41 lines trimmed)
    transform: scale(0.95);
  }
}
```

```typescript
// components/ui/dialog.tsx - Using native popover API
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

const DialogPortal = DialogPrimitive.Portal
// ... (43 lines trimmed)
    </DialogPortal>
  )
}
```

## Pattern 6: Dark Mode with CSS (v4)

```typescript
// providers/ThemeProvider.tsx - Simplified for v4
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// ... (81 lines trimmed)
    </Button>
  )
}
```
