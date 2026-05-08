---
name: code-review-pro
description: "Run this when reviewing code for security, performance, or maintainability — identifies vulnerabilities, bottlenecks, and refactoring opportunities."
origin: lamella
---

# Code Review Pro


## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Instructions](#instructions)
- [Output Format](#output-format)
- [🚨 Critical Issues (Fix Immediately)](#-critical-issues-fix-immediately)
- [⚠️ High Priority Issues](#-high-priority-issues)
- [💡 Medium Priority Issues](#-medium-priority-issues)
- [✅ Low Priority / Nice to Have](#-low-priority-nice-to-have)
- [📊 Summary](#-summary)
- [🎯 Quick Wins](#-quick-wins)
- [🏆 Strengths](#-strengths)
- [🔄 Refactoring Opportunities](#-refactoring-opportunities)
- [📚 Resources](#-resources)
- [Examples](#examples)
- [Best Practices](#best-practices)

Review code for security, performance, maintainability, and correctness issues.

## When to Use This Skill

Activate when the user:
- Asks for a code review
- Wants security vulnerability scanning
- Needs performance analysis
- Asks to "review this code" or "audit this code"
- Mentions finding bugs or improvements
- Wants refactoring suggestions
- Requests best practice validation

## Instructions

1. **Security Analysis (Critical Priority)**
   - SQL injection vulnerabilities
   - XSS (cross-site scripting) risks
   - Authentication/authorization issues
   - Secrets or credentials in code
   - Unsafe deserialization
   - Path traversal vulnerabilities
   - CSRF protection
   - Input validation gaps
   - Insecure cryptography
   - Dependency vulnerabilities

2. **Performance Analysis**
   - N+1 query problems
   - Inefficient algorithms (check Big O complexity)
   - Memory leaks
   - Unnecessary re-renders (React/Vue)
   - Missing indexes (database queries)
   - Blocking operations
   - Resource cleanup (file handles, connections)
   - Caching opportunities
   - Excessive network calls
   - Large bundle sizes

3. **Code Quality & Maintainability**
   - Code duplication (DRY violations)
   - Function/method length (should be <50 lines)
   - Cyclomatic complexity
   - Unclear naming
   - Missing error handling
   - Inconsistent style
   - Missing documentation
   - Hard-coded values that should be constants
   - God classes/functions
   - Tight coupling

4. **Best Practices**
   - Language-specific idioms
   - Framework conventions
   - SOLID principles
   - Design patterns usage
   - Testing approach
   - Logging and monitoring
   - Accessibility (for UI code)
   - Type safety
   - Null/undefined handling

5. **Bugs and Edge Cases**
   - Logic errors
   - Off-by-one errors
   - Race conditions
   - Null pointer exceptions
   - Unhandled edge cases
   - Timezone issues
   - Encoding problems
   - Floating point precision

6. **Provide Actionable Fixes**
   - Show specific code changes
   - Explain why change is needed
   - Include before/after examples
   - Prioritize by severity

## Output Format

```markdown
# Code Review Report

## 🚨 Critical Issues (Fix Immediately)
### 1. SQL Injection Vulnerability (line X)
**Severity**: Critical
**Issue**: User input directly concatenated into SQL query
**Impact**: Database compromise, data theft

**Current Code:**
```javascript
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

**Fixed Code:**
```javascript
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [userEmail]);
```

**Explanation**: Always use parameterized queries to prevent SQL injection.

## ⚠️ High Priority Issues
### 2. Performance: N+1 Query Problem (line Y)
**Issue**: The loop loads related orders one row at a time, which multiplies database round trips.

**Why it matters**: Query count grows with result size and quickly degrades a healthy endpoint under normal traffic.

**Recommended fix**:
```javascript
const users = await db('users')
  .leftJoin('orders', 'orders.user_id', 'users.id')
  .select('users.*', 'orders.total');
```

## ℹ️ Medium Priority Issues
### 3. Error handling gaps (line Z)
**Issue**: External API failures are logged but not surfaced to callers.

**Recommendation**: Return a typed application error and capture retryability explicitly.

## ✅ What looks good
- Input validation happens before persistence.
- The auth boundary is separated from data access.
- Naming is consistent and the control flow is easy to follow.

## Next Steps
1. Fix high-severity security issues first.
2. Eliminate N+1 and re-profile the endpoint.
3. Add regression tests for the corrected paths.
## 📚 Resources
- [OWASP SQL Injection Guide](https://...)
- [Performance Best Practices](https://...)
```

## Examples

**User**: "Review this authentication code"
**Response**: Analyze auth logic → Identify security issues (weak password hashing, no rate limiting) → Check token handling → Note missing CSRF protection → Provide specific fixes with code examples → Prioritize by severity

**User**: "Can you find performance issues in this React component?"
**Response**: Analyze component → Identify unnecessary re-renders → Find missing useMemo/useCallback → Note large state objects → Check for expensive operations in render → Provide optimized version with explanations

**User**: "Review this API endpoint"
**Response**: Check input validation → Analyze error handling → Test for SQL injection → Review authentication → Check rate limiting → Examine response structure → Suggest improvements with code samples

## Security Deep Dive (Differential Review)

For security-focused review of PRs, commits, or diffs, scale analysis by codebase size:

| Codebase | Strategy |
|----------|----------|
| <20 files | DEEP — read all deps, full git blame |
| 20-200 | FOCUSED — 1-hop deps, priority files |
| 200+ | SURGICAL — critical paths only |

### Risk Triggers

| Risk | Triggers |
|------|----------|
| HIGH | Auth, crypto, external calls, validation removal |
| MEDIUM | Business logic, state changes, new public APIs |
| LOW | Comments, tests, UI, logging |

### Rationalizations to Reject

| Rationalization | Required Action |
|-----------------|----------------|
| "Small PR, quick review" | Classify by RISK, not size |
| "Just a refactor" | Analyze as HIGH until proven LOW |
| "No tests = not my problem" | Flag in report, elevate severity |

### Red Flags (Immediate Escalation)

- Removed code from "security" or "CVE" commits
- Access control modifiers removed
- Validation removed without replacement
- External calls added without checks

### Workflow

```
Triage → Code Analysis → Test Coverage → Blast Radius → Adversarial Modeling → Report
```

**Reference files:**
- [references/methodology.md](references/methodology.md) — Phases 0-4 detailed workflow
- [references/adversarial.md](references/adversarial.md) — Attacker modeling, exploit scenarios
- [references/reporting.md](references/reporting.md) — Report structure and formatting
- [references/patterns.md](references/patterns.md) — Common vulnerability patterns

## Best Practices

- Always prioritize security issues first
- Provide specific line numbers for issues
- Include before/after code examples
- Explain *why* something is a problem
- Consider the language/framework context
- Don't just criticize—acknowledge good code too
- Suggest gradual improvements for large refactors
- Link to documentation for recommendations
- Consider project constraints (legacy code, deadlines)
- Balance perfectionism with pragmatism
- Focus on impactful changes
- Group similar issues together
- Make recommendations actionable
