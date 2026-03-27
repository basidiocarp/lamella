# Security Review Code Examples

Use these examples as fast review anchors when you need to explain why a pattern is safe or unsafe.

## Secrets Management

```typescript
// Bad
const apiKey = "sk-proj-xxxxx"
const dbPassword = "password123"

// Good
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

if (!apiKey || !dbUrl) {
  throw new Error("Required secrets are not configured")
}
```

Review for:

- hardcoded secrets in source or tests
- fallback secrets in config loaders
- logs that accidentally emit credentials

## Input Validation

```typescript
import { z } from "zod"

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(13).max(130),
})

export async function createUser(input: unknown) {
  const data = CreateUserSchema.parse(input)
  return db.user.create({ data })
}
```

File uploads need independent checks for:

- size
- MIME type
- extension
- storage path

```typescript
function validateFileUpload(file: File) {
  const maxSize = 5 * 1024 * 1024
  const allowedTypes = new Set(["image/png", "image/jpeg", "application/pdf"])

  if (file.size > maxSize) throw new Error("File too large")
  if (!allowedTypes.has(file.type)) throw new Error("Unsupported file type")
}
```

## SQL Injection Prevention

```typescript
// Bad
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)

// Good
await db.query("SELECT * FROM users WHERE email = $1", [userEmail])

const { data } = await supabase
  .from("users")
  .select("*")
  .eq("email", userEmail)
```

Reject:

- string interpolation into SQL
- homegrown query builders that concatenate conditions
- “internal only” admin tools that skip parameterization

## Authentication and Authorization

```typescript
// Bad: token readable by XSS
localStorage.setItem("token", token)

// Good: httpOnly cookie
res.setHeader(
  "Set-Cookie",
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
)
```

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  const requester = await db.users.findUnique({ where: { id: requesterId } })

  if (!requester || requester.role !== "admin") {
    throw new Error("Forbidden")
  }

  await db.users.delete({ where: { id: userId } })
}
```

For data stores with row-level controls, verify the database policy, not just the API layer:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

## XSS and HTML Rendering

```typescript
import DOMPurify from "isomorphic-dompurify"

function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p"],
    ALLOWED_ATTR: [],
  })

  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

If the app allows inline scripts or broad `script-src` exceptions, call that out explicitly in the review.

## CSRF and Session Protection

```typescript
export async function POST(request: Request) {
  const token = request.headers.get("X-CSRF-Token")

  if (!csrf.verify(token)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
  }

  return NextResponse.json({ ok: true })
}
```

```typescript
res.setHeader(
  "Set-Cookie",
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`,
)
```

## Rate Limiting

```typescript
import rateLimit from "express-rate-limit"

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests",
})

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many search requests",
})
```

Apply tighter limits to:

- login
- password reset
- search
- export
- any expensive AI or PDF operation

## Logging and Error Handling

```typescript
// Bad
console.log("User login:", { email, password })

// Good
console.log("User login:", { email, userId })
```

```typescript
try {
  await sensitiveOperation()
} catch (error) {
  logger.error("Sensitive operation failed", { requestId, userId })
  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}
```

Reject:

- stack traces or raw exception messages returned to clients
- logs that include tokens, secrets, or full payment data
- “temporary” debug logs left in auth or billing flows

## Wallet or Signature Verification

```typescript
async function verifyWalletOwnership(
  publicKey: string,
  signature: Uint8Array,
  message: Uint8Array,
) {
  try {
    return nacl.sign.detached.verify(message, signature, new PublicKey(publicKey).toBytes())
  } catch {
    return false
  }
}
```

Security review question: does the code verify the exact message the user saw, or only a reusable template string?
