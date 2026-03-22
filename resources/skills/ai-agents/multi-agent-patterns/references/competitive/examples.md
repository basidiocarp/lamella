# Competitive Multi-Agent Examples

Detailed examples showing the adaptive strategy selection in action.

## Example 1: API Design (Clear Winner - SELECT_AND_POLISH)

```bash
/do-competitively "Design REST API for user management (CRUD + auth)" \
  --output "specs/api/users.md" \
  --criteria "RESTfulness,security,scalability,developer-experience"
```

### Phase 1 Outputs

- `specs/api/users.a.md` - Resource-based design with nested routes
- `specs/api/users.b.md` - Action-based design with RPC-style endpoints
- `specs/api/users.c.md` - Minimal design, missing auth consideration

### Phase 2 Outputs (date: 2025-01-15)

**Judge 1** (`.specs/reports/users-api-2025-01-15.1.md`):
```
VOTE: Solution A
SCORES: A=4.5/5.0, B=3.2/5.0, C=2.8/5.0
```
"Most RESTful, good security"

**Judge 2** (`.specs/reports/users-api-2025-01-15.2.md`):
```
VOTE: Solution A
SCORES: A=4.3/5.0, B=3.5/5.0, C=2.6/5.0
```
"Clean resource design, scalable"

**Judge 3** (`.specs/reports/users-api-2025-01-15.3.md`):
```
VOTE: Solution A
SCORES: A=4.6/5.0, B=3.0/5.0, C=2.9/5.0
```
"Best practices, clear structure"

### Phase 2.5 Decision

- **Unanimous vote**: A, A, A
- **Average scores**: A=4.5, B=3.2, C=2.8
- **Strategy**: SELECT_AND_POLISH
- **Reason**: Unanimous winner with >1.0 point gap

### Phase 3 Output

`specs/api/users.md` - Solution A polished with:
- Added rate limiting documentation (from B)
- Simplified nested routes (judge feedback)
- **Total cost**: 6 agents (saved 1 from full synthesis)

---

## Example 2: Algorithm Selection (Split Decision - FULL_SYNTHESIS)

```bash
/do-competitively "Design caching strategy for high-traffic API" \
  --output "specs/caching.md" \
  --criteria "performance,memory-efficiency,simplicity,reliability"
```

### Phase 1 Outputs

- `specs/caching.a.md` - Redis with LRU eviction
- `specs/caching.b.md` - Multi-tier cache (memory + Redis)
- `specs/caching.c.md` - CDN + application cache

### Phase 2 Outputs (date: 2025-01-15)

**Judge 1** (`.specs/reports/caching-2025-01-15.1.md`):
```
VOTE: Solution B
SCORES: A=3.8/5.0, B=4.2/5.0, C=3.9/5.0
```
"Best performance, complex"

**Judge 2** (`.specs/reports/caching-2025-01-15.2.md`):
```
VOTE: Solution A
SCORES: A=4.0/5.0, B=3.9/5.0, C=3.7/5.0
```
"Simple, reliable, proven"

**Judge 3** (`.specs/reports/caching-2025-01-15.3.md`):
```
VOTE: Solution C
SCORES: A=3.6/5.0, B=4.0/5.0, C=4.1/5.0
```
"Global reach, cost-effective"

### Phase 2.5 Decision

- **Split votes**: B, A, C (no consensus)
- **Average scores**: A=3.8, B=4.0, C=3.9
- **Score gap**: 4.0 - 3.9 = 0.1 (<1.0 threshold)
- **Strategy**: FULL_SYNTHESIS
- **Reason**: Split decision, all solutions ≥3.0, no clear winner

### Phase 3 Output

`specs/caching.md` - Hybrid approach:
- Multi-tier architecture (from B)
- Simple LRU policy (from A)
- CDN for static content (from C)
- **Total cost**: 7 agents (full synthesis needed)

---

## Example 3: Authentication Design (All Flawed - REDESIGN)

```bash
/do-competitively "Design authentication system with social login" \
  --output "specs/auth.md" \
  --criteria "security,user-experience,maintainability"
```

### Phase 1 Outputs

- `specs/auth.a.md` - Custom OAuth2 implementation
- `specs/auth.b.md` - Session-based with social providers
- `specs/auth.c.md` - JWT with password-only auth

### Phase 2 Outputs (date: 2025-01-15)

**Judge 1** (`.specs/reports/auth-2025-01-15.1.md`):
```
VOTE: Solution A
SCORES: A=2.5/5.0, B=2.2/5.0, C=2.3/5.0
```
"Security risks, reinventing wheel"

**Judge 2** (`.specs/reports/auth-2025-01-15.2.md`):
```
VOTE: Solution B
SCORES: A=2.4/5.0, B=2.8/5.0, C=2.1/5.0
```
"Sessions don't scale, missing requirements"

**Judge 3** (`.specs/reports/auth-2025-01-15.3.md`):
```
VOTE: Solution C
SCORES: A=2.6/5.0, B=2.5/5.0, C=2.3/5.0
```
"No social login, security concerns"

### Phase 2.5 Decision

- **Split votes**: A, B, C (no consensus)
- **Average scores**: A=2.5, B=2.5, C=2.2 (ALL <3.0)
- **Strategy**: REDESIGN
- **Reason**: All solutions below 3.0 threshold, fundamental issues

### Next Steps

Return to Phase 1 with lessons learned:
- Use established OAuth libraries (Auth0, Firebase Auth)
- Don't mix session/JWT strategies
- Must include social login as core requirement

Eventually completes with SELECT_AND_POLISH or FULL_SYNTHESIS.
