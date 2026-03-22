# Standard Plugin Example

A well-structured plugin with commands, agents, and skills.

## Directory Structure

```
code-quality/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── lint.md
// ... (19 lines trimmed)
└── scripts/
    ├── run-linter.sh
    └── generate-report.py
```

## File Contents

### .claude-plugin/plugin.json

```json
{
  "name": "code-quality",
  "version": "1.0.0",
  "description": "Comprehensive code quality tools including linting, testing, and review automation",
  "author": {
    "name": "Quality Team",
    "email": "quality@example.com"
  },
  "homepage": "https://docs.example.com/plugins/code-quality",
  "repository": "https://github.com/example/code-quality-plugin",
  "license": "MIT",
  "keywords": ["code-quality", "linting", "testing", "code-review", "automation"]
}
```

### commands/lint.md

```markdown
---
name: lint
description: Run linting checks on the codebase
---

// ... (25 lines trimmed)
- File path and line number
- Issue description
- Suggested fix (if available)
```

### commands/test.md

```markdown
---
name: test
description: Run test suite with coverage reporting
---

// ... (22 lines trimmed)
- Fix failing tests
- Generate tests for untested code (using test-generator agent)
- Update documentation based on test changes
```

### agents/code-reviewer.md

```markdown
---
description: Expert code reviewer specializing in identifying bugs, security issues, and improvement opportunities
capabilities:
  - Analyze code for potential bugs and logic errors
  - Identify security vulnerabilities
// ... (34 lines trimmed)
- Important issues (should fix)
- Suggestions (nice to have)
- Positive feedback (what was done well)
```

### agents/test-generator.md

```markdown
---
description: Generates comprehensive test suites from code analysis
capabilities:
  - Analyze code structure and logic flow
  - Generate unit tests for functions and methods
// ... (34 lines trimmed)
- Error handling verification
- Mock data for external dependencies
- Clear test descriptions
```

### skills/code-standards/SKILL.md

```markdown
---
name: Code Standards
description: This skill should be used when reviewing code, enforcing style guidelines, checking naming conventions, or ensuring code quality standards. Provides project-specific coding standards and best practices.
version: 1.0.0
---
// ... (86 lines trimmed)

For comprehensive style guides by language, see:
- `references/style-guide.md`
```

### skills/code-standards/references/style-guide.md

```markdown
# Comprehensive Style Guide

Detailed style guidelines for all supported languages.

## JavaScript/TypeScript
// ... (90 lines trimmed)
- Go: `references/go-style.md`
- Rust: `references/rust-style.md`
- Ruby: `references/ruby-style.md`
```

### hooks/hooks.json

```json
{
  "PreToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
// ... (18 lines trimmed)
    }
  ]
}
```

### hooks/scripts/validate-commit.sh

```bash
#!/bin/bash
# Validate code quality before task completion

set -e

// ... (36 lines trimmed)

echo '{"systemMessage": "Code quality checks passed. Ready to commit."}'
exit 0
```

## Usage Examples

### Running Commands

```
$ claude
> /lint
Running linter checks...

Critical Issues (2):
// ... (26 lines trimmed)
  1. User API › GET /users › should handle pagination
     Expected 200, received 500
  ...
```

### Using Agents

```
> Review the changes in src/api/users.js

[code-reviewer agent selected automatically]

Code Review: src/api/users.js
// ... (14 lines trimmed)
     - Frequent DB queries for same users
     - Add Redis caching layer
     - Priority: MEDIUM
```

## Key Points

1. **Complete manifest**: All recommended metadata fields
2. **Multiple components**: Commands, agents, skills, hooks
3. **Rich skills**: References and examples for detailed information
4. **Automation**: Hooks enforce standards automatically
5. **Integration**: Components work together cohesively

## When to Use This Pattern

- Production plugins for distribution
- Team collaboration tools
- Plugins requiring consistency enforcement
- Complex workflows with multiple entry points
