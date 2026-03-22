# Input Validation

## Zod Validation

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100).regex(/^[\w\s-]+$/),
// ... (10 lines trimmed)
if (!result.success) {
  console.error(result.error.issues);
}
```

## SQL Injection Prevention

```typescript
// ❌ NEVER do this
const bad = `SELECT * FROM users WHERE id = ${userId}`;
const bad2 = `SELECT * FROM users WHERE name = '${name}'`;

// ✅ Parameterized queries
// ... (11 lines trimmed)
const user = await knex('users')
  .where({ id: userId, name: name })
  .first();
```

## Path Traversal Prevention

```typescript
import path from 'path';

// ❌ Vulnerable
const vulnerable = path.join('/uploads', userInput);

// ... (11 lines trimmed)

  return fullPath;
}
```

## Command Injection Prevention

```typescript
import { execFile } from 'child_process';

// ❌ Never use exec with user input
exec(`convert ${userInput}`); // Vulnerable!

// ✅ Use execFile with arguments array
execFile('convert', ['-resize', '100x100', safeFilename], (error, stdout) => {
  // ...
});

// ✅ Better: Use library functions instead of shell
import sharp from 'sharp';
await sharp(inputPath).resize(100, 100).toFile(outputPath);
```

## URL Validation

```typescript
function validateUrl(input: string, allowedHosts: string[]): URL {
  const url = new URL(input);

  // Check protocol
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Invalid protocol');
  }

  // Check host allowlist
  if (!allowedHosts.includes(url.hostname)) {
    throw new Error('Host not allowed');
  }

  return url;
}
```

## File Upload Validation

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateUpload(file: Express.Multer.File) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
// ... (12 lines trimmed)
    throw new Error('Invalid file content');
  }
}
```

## Quick Reference

| Input Type | Validation |
|------------|------------|
| Email | Regex + max length |
| URL | Protocol + host allowlist |
| File path | basename + resolve check |
| SQL | Parameterized queries |
| Command | execFile + no shell |
| File upload | Type + size + magic bytes |
