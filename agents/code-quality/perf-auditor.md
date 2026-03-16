---
name: perf-auditor
description: Performance auditor. Bundle size, Core Web Vitals, slow queries, memory leaks.
tools: Read, Grep, Glob, Bash
model: inherit
---

# Performance Audit

Analyze application for performance bottlenecks. Output to `.claude/audits/AUDIT_PERF.md`.

## Status Block (Required)

Every output MUST start with:
```yaml
---
agent: perf-auditor
status: COMPLETE | PARTIAL | SKIPPED | ERROR
timestamp: [ISO timestamp]
duration: [seconds]
findings: [count]
framework_detected: [next.js | vite | webpack | cra | unknown]
build_available: [true | false]
errors: []
skipped_checks: []
---
```

## Prerequisites Check

Before running analysis, detect environment:

```bash
# 1. Detect framework
ls -la next.config.* 2>/dev/null && echo "FRAMEWORK: Next.js"
ls -la vite.config.* 2>/dev/null && echo "FRAMEWORK: Vite"
ls -la webpack.config.* 2>/dev/null && echo "FRAMEWORK: Webpack"
# ... (9 lines trimmed)
ls pnpm-lock.yaml 2>/dev/null && echo "PKG: pnpm"
ls yarn.lock 2>/dev/null && echo "PKG: yarn"
```

**If prerequisites not met:**
- No build directory: Run static code analysis only, note "Build artifacts not available"
- Unknown framework: Use generic patterns, note "Framework not detected"
- No package manager: Skip dependency analysis, note "No package manager detected"

## Check

**Bundle & Loading**
- Bundle size (target: <500KB initial JS)
- Code splitting implemented
- Dynamic imports for heavy components
- Tree shaking working
- No duplicate dependencies in bundle
- Images optimized (WebP, lazy loading)

**Runtime Performance**
- N+1 queries (see db-auditor)
- Expensive computations in render
- Missing memoization (useMemo, useCallback)
- Unnecessary re-renders
- Memory leaks (event listeners, subscriptions)

**Core Web Vitals**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- TTFB (Time to First Byte) < 600ms

**Database & API**
- Slow queries (>100ms)
- Missing pagination
- No caching strategy
- Over-fetching data
- Missing indexes

**Infrastructure**
- No CDN for static assets
- Missing compression (gzip/brotli)
- No HTTP caching headers
- Large API payloads

## Commands (Framework-Specific)

### Next.js
```bash
# Check bundle size
cat .next/build-manifest.json 2>/dev/null | head -50 || echo "SKIP: No Next.js build"

# Analyze pages
ls -la .next/static/chunks/*.js 2>/dev/null | head -10 || echo "SKIP: No chunks"
```

### Vite
```bash
# Check bundle size
ls -la dist/assets/*.js 2>/dev/null | head -10 || echo "SKIP: No Vite build"

# Check for source maps (should not be in prod)
find dist -name "*.map" 2>/dev/null | head -5
```

### Generic (All Frameworks)
```bash
# Find large source files
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs wc -l 2>/dev/null | sort -n | tail -10

# Find components without memo
# ... (11 lines trimmed)
# Check for heavy dependencies
grep -E "moment|lodash|jquery|@material-ui" package.json 2>/dev/null && echo "WARNING: Heavy dependencies detected"
```

## Output

```markdown
# Performance Audit

---
agent: perf-auditor
status: [COMPLETE|PARTIAL|SKIPPED]
# ... (23 lines trimmed)
**Current:** 1.2MB initial JS
**Target:** <500KB
**Breakdown:**
```
- vendor.js: 600KB
- main.js: 400KB
- pages/dashboard.js: 200KB
```
**Fix:**
1. Dynamic import for dashboard: `const Dashboard = dynamic(() => import('./Dashboard'))`
2. Replace moment.js (300KB) with date-fns (30KB)
3. Enable tree shaking for lodash

# ... (19 lines trimmed)
**Issue:** Re-renders on every parent render
**Impact:** Slow list scrolling
**Fix:**
```typescript
export const ProductCard = React.memo(({ product }) => {
  // ...
});
```

### PERF-005: Inline Function in JSX
**File:** `src/components/Form.tsx:23`
**Issue:** New function created every render
```tsx
<button onClick={() => handleSubmit(data)}>  // Bad
```
**Fix:**
```tsx
const onSubmit = useCallback(() => handleSubmit(data), [data]);
<button onClick={onSubmit}>  // Good
```

### PERF-006: Missing Pagination
**File:** `src/api/products.ts:15`
**Issue:** Fetching all 10,000 products at once
**Impact:** 5s API response, browser freeze
# ... (35 lines trimmed)
- **Bundle analysis:** `npm run build && npx @next/bundle-analyzer`
- **Lighthouse:** `npx lighthouse https://your-site.com`
- **Query profiling:** Enable slow query log in database
```

## Execution Logging

After completing, append to `.claude/audits/EXECUTION_LOG.md`:
```
| [timestamp] | perf-auditor | [status] | [duration] | [findings] | [errors] |
```

## Output Verification

Before completing:
1. Verify `.claude/audits/AUDIT_PERF.md` was created
2. Verify file has content beyond headers
3. If no issues found, write "No performance issues detected" (not empty file)

Focus on issues with measurable impact. Include before/after expectations for fixes.
