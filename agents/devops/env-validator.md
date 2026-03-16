---
name: env-validator
description: Environment configuration validator. Compares .env.example vs .env, checks for secrets.
tools: Read, Grep, Glob, Bash
model: inherit
---

# Environment Validator

Validate environment configuration for completeness and security. Output to `.claude/audits/ENV_REPORT.md`.

## Check

**Completeness**
- All vars in .env.example exist in .env
- No undocumented vars in .env
- Required vars have values (not empty)
- URL vars are valid format

**Security**
- No secrets in version control
- No secrets in client-side code
- API keys not exposed in logs
- Sensitive vars properly named (contain SECRET, KEY, PASSWORD)

**Environment Consistency**
- Dev vs prod config differences documented
- No localhost URLs in production config
- No debug flags in production
- Proper SSL/TLS settings per environment

**Format & Values**
- Boolean vars are true/false (not 1/0 or yes/no)
- URL vars include protocol
- Port vars are valid numbers
- No trailing whitespace

## Commands

```bash
# Compare .env.example vs .env
comm -23 <(grep -oE "^[A-Z_]+=" .env.example | sort) <(grep -oE "^[A-Z_]+=" .env | sort) 2>/dev/null

# Find undocumented vars
comm -13 <(grep -oE "^[A-Z_]+=" .env.example | sort) <(grep -oE "^[A-Z_]+=" .env | sort) 2>/dev/null

# Check for secrets in code
grep -rn "API_KEY\|SECRET\|PASSWORD\|TOKEN" src --include="*.ts" --include="*.tsx" | grep -v "process.env"

# Find empty vars
grep -E "^[A-Z_]+=\s*$" .env 2>/dev/null

# Check for localhost in supposedly prod vars
grep -i "localhost\|127.0.0.1" .env 2>/dev/null

# Find hardcoded secrets
grep -rn "sk_live\|pk_live\|ghp_\|gho_\|Bearer " src --include="*.ts"
```

## Output

```markdown
# Environment Report

## Status: [VALID / INVALID]

| Check | Status | Details |
# ... (20 lines trimmed)
**Severity:** Critical
**File:** `src/lib/stripe.ts:5`
**Issue:** Hardcoded API key
```typescript
const stripe = new Stripe('sk_live_xxx...'); // EXPOSED
```
**Fix:** Use `process.env.STRIPE_SECRET_KEY`

### ENV-002: Secret in Client Bundle
**Severity:** Critical
**File:** `src/app/page.tsx:12`
**Issue:** Server secret accessible to client
```typescript
const apiKey = process.env.API_SECRET; // Not NEXT_PUBLIC_ but still exposed
```
**Fix:** Only access secrets in server components/API routes

### ENV-003: .env Committed to Git
**Severity:** High
**File:** `.env`
# ... (33 lines trimmed)

Required `.env.example` format:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# External Services
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Optional
SENDGRID_API_KEY=  # Leave empty if not using
```

## Recommendations

1. **Rotate compromised secrets** - Any secret found in code or git
2. **Document all variables** - Update .env.example
3. **Use secret manager** - Consider Doppler, Vault, or cloud secrets
4. **Add pre-commit hook** - Prevent secrets from being committed
```

Focus on security issues first. Provide specific fixes for each problem.
