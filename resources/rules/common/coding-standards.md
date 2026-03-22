---
description: "Project-specific coding conventions. Standard patterns (DRY, KISS, naming) are assumed knowledge."
---

# Coding Standards

Standard coding practices (DRY, KISS, YAGNI, naming conventions) are assumed. This covers project-specific standards.

## Immutability (CRITICAL)

```typescript
// ✅ ALWAYS spread
const updated = { ...user, name: 'New' }
const withItem = [...items, newItem]

// ❌ NEVER mutate
user.name = 'New'
items.push(newItem)
```

## API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: { total: number; page: number; limit: number }
}

// Success
return NextResponse.json({ success: true, data: markets, meta: {...} })

// Error
return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
```

## Input Validation (Zod)

```typescript
const Schema = z.object({
  name: z.string().min(1).max(200),
  date: z.string().datetime(),
})

const validated = Schema.parse(body) // throws on invalid
```

## File Organization

```
src/
├── app/              # Next.js pages + API routes
├── components/       # React components (PascalCase.tsx)
│   ├── ui/          # Generic (Button, Modal)
│   └── features/    # Feature-specific
├── hooks/           # useXxx.ts
├── lib/             # utils, constants, api clients
└── types/           # xxx.types.ts
```

## Comments: WHY not WHAT

```typescript
// ✅ Exponential backoff to avoid overwhelming API during outages
const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)

// ❌ Increment counter by 1
count++
```

## Quick Patterns

| Pattern | Example |
|---------|---------|
| Early return | `if (!user) return` not nested ifs |
| Named constants | `MAX_RETRIES = 3` not magic numbers |
| Promise.all | Parallel fetches when independent |
| Zod parsing | Validate at boundaries |
| Functional updates | `setCount(prev => prev + 1)` |

## Code Smells

- Functions > 50 lines → split
- Nesting > 4 levels → early returns
- Magic numbers → named constants
- `any` type → proper interfaces
- Direct mutation → spread operators
