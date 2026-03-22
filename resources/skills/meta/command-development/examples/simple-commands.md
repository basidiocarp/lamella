# Simple Command Examples

Basic slash command patterns for common use cases.

**Important:** All examples below are written as instructions FOR Claude (agent consumption), not messages TO users. Commands tell Claude what to do, not tell users what will happen.

## Example 1: Code Review Command

**File:** `.claude/commands/review.md`

```markdown
---
description: Review code for quality and issues
allowed-tools: Read, Bash(git:*)
---

// ... (15 lines trimmed)
   - Documentation adequate

Provide specific feedback with file and line references.
```

**Usage:**
```
> /review
```

---

## Example 2: Security Review Command

**File:** `.claude/commands/security-review.md`

```markdown
---
description: Review code for security vulnerabilities
allowed-tools: Read, Grep
model: sonnet
---
// ... (21 lines trimmed)
- Recommended fix

Prioritize issues by severity.
```

**Usage:**
```
> /security-review
```

---

## Example 3: Test Command with File Argument

**File:** `.claude/commands/test-file.md`

```markdown
---
description: Run tests for specific file
argument-hint: [test-file]
allowed-tools: Bash(npm:*), Bash(jest:*)
---
// ... (9 lines trimmed)
- Flaky tests

If failures found, suggest fixes based on error messages.
```

**Usage:**
```
> /test-file src/utils/helpers.test.ts
```

---

## Example 4: Documentation Generator

**File:** `.claude/commands/document.md`

```markdown
---
description: Generate documentation for file
argument-hint: [source-file]
---

// ... (23 lines trimmed)
- Known limitations

Format as Markdown suitable for project documentation.
```

**Usage:**
```
> /document src/api/users.ts
```

---

## Example 5: Git Status Summary

**File:** `.claude/commands/git-status.md`

```markdown
---
description: Summarize Git repository status
allowed-tools: Bash(git:*)
---

// ... (11 lines trimmed)
- Summary of changes
- Suggested next actions
- Any warnings or issues
```

**Usage:**
```
> /git-status
```

---

## Example 6: Deployment Command

**File:** `.claude/commands/deploy.md`

```markdown
---
description: Deploy to specified environment
argument-hint: [environment] [version]
allowed-tools: Bash(kubectl:*), Read
---
// ... (16 lines trimmed)
Document current version for rollback if issues occur.

Proceed with deployment? (yes/no)
```

**Usage:**
```
> /deploy staging v1.2.3
```

---

## Example 7: Comparison Command

**File:** `.claude/commands/compare-files.md`

```markdown
---
description: Compare two files
argument-hint: [file1] [file2]
---

// ... (23 lines trimmed)
   - Documentation updates needed

Present as structured comparison report.
```

**Usage:**
```
> /compare-files src/old-api.ts src/new-api.ts
```

---

## Example 8: Quick Fix Command

**File:** `.claude/commands/quick-fix.md`

```markdown
---
description: Quick fix for common issues
argument-hint: [issue-description]
model: haiku
---
// ... (13 lines trimmed)
- No breaking changes

Provide code changes with file paths and line numbers.
```

**Usage:**
```
> /quick-fix button not responding to clicks
> /quick-fix typo in error message
```

---

## Example 9: Research Command

**File:** `.claude/commands/research.md`

```markdown
---
description: Research best practices for topic
argument-hint: [topic]
model: sonnet
---
// ... (22 lines trimmed)
   - Resources for implementation

Provide actionable guidance based on research.
```

**Usage:**
```
> /research error handling in async operations
> /research API authentication patterns
```

---

## Example 10: Explain Code Command

**File:** `.claude/commands/explain.md`

```markdown
---
description: Explain how code works
argument-hint: [file-or-function]
---

// ... (27 lines trimmed)
   - Integration points

Explain at level appropriate for junior engineer.
```

**Usage:**
```
> /explain src/utils/cache.ts
> /explain AuthService.login
```

---

## Key Patterns

### Pattern 1: Read-Only Analysis

```markdown
---
allowed-tools: Read, Grep
---

Analyze but don't modify...
```

**Use for:** Code review, documentation, analysis

### Pattern 2: Git Operations

```markdown
---
allowed-tools: Bash(git:*)
---

!`git status`
Analyze and suggest...
```

**Use for:** Repository status, commit analysis

### Pattern 3: Single Argument

```markdown
---
argument-hint: [target]
---

Process $1...
```

**Use for:** File operations, targeted actions

### Pattern 4: Multiple Arguments

```markdown
---
argument-hint: [source] [target] [options]
---

Process $1 to $2 with $3...
```

**Use for:** Workflows, deployments, comparisons

### Pattern 5: Fast Execution

```markdown
---
model: haiku
---

Quick simple task...
```

**Use for:** Simple, repetitive commands

### Pattern 6: File Comparison

```markdown
Compare @$1 with @$2...
```

**Use for:** Diff analysis, migration planning

### Pattern 7: Context Gathering

```markdown
---
allowed-tools: Bash(git:*), Read
---

Context: !`git status`
Files: @file1 @file2

Analyze...
```

**Use for:** Informed decision making

## Tips for Writing Simple Commands

1. **Start basic:** Single responsibility, clear purpose
2. **Add complexity gradually:** Start without frontmatter
3. **Test incrementally:** Verify each feature works
4. **Use descriptive names:** Command name should indicate purpose
5. **Document arguments:** Always use argument-hint
6. **Provide examples:** Show usage in comments
7. **Handle errors:** Consider missing arguments or files
