# Complete Agent Examples

Full, production-ready agent examples for common use cases. Use these as templates for your own agents.

## Example 1: Code Review Agent

**File:** `agents/code-reviewer.md`

```markdown
---
name: code-reviewer
description: Use this agent when the user has written code and needs quality review, security analysis, or best practices validation. Examples:

<example>
// ... (94 lines trimmed)
- Unclear code intent: Note ambiguity and request clarification
- Missing context (no CLAUDE.md): Apply general best practices
- Large changeset: Focus on most impactful files first
```

## Example 2: Test Generator Agent

**File:** `agents/test-generator.md`

```markdown
---
name: test-generator
description: Use this agent when the user has written code without tests, explicitly asks for test generation, or needs test coverage improvement. Examples:

<example>
// ... (61 lines trimmed)

**Output Format:**
Create test file at [appropriate path] with:
```[language]
// Test suite for [module]

describe('[module name]', () => {
  // Test cases with descriptive names
  test('should [expected behavior] when [scenario]', () => {
    // Arrange
    // Act
    // Assert
  })

  // More tests...
})
```

**Edge Cases:**
- No existing tests: Create new test file following best practices
- Existing test file: Add new tests maintaining consistency
- Unclear behavior: Add tests for observable behavior, note uncertainties
- Complex mocking: Prefer integration tests or minimal mocking
- Untestable code: Suggest refactoring for testability
```

## Example 3: Documentation Generator

**File:** `agents/docs-generator.md`

```markdown
---
name: docs-generator
description: Use this agent when the user has written code needing documentation, API endpoints requiring docs, or explicitly requests documentation generation. Examples:

<example>
// ... (70 lines trimmed)
- Complex APIs: Break into sections, provide multiple examples
- Deprecated code: Mark as deprecated with migration guide
- Unclear behavior: Document observable behavior, note assumptions
```

## Example 4: Security Analyzer

**File:** `agents/security-analyzer.md`

```markdown
---
name: security-analyzer
description: Use this agent when the user implements security-critical code (auth, payments, data handling), explicitly requests security analysis, or before deploying sensitive changes. Examples:

<example>
// ... (77 lines trimmed)
- False positives: Verify before reporting
- Uncertain vulnerabilities: Mark as "potential" with caveat
- Out of scope items: Note but don't deep-dive
```

## Customization Tips

### Adapt to Your Domain

Take these templates and customize:
- Change domain expertise (e.g., "Python expert" vs "React expert")
- Adjust process steps for your specific workflow
- Modify output format to match your needs
- Add domain-specific quality standards
- Include technology-specific checks

### Adjust Tool Access

Restrict or expand based on agent needs:
- **Read-only agents**: `["Read", "Grep", "Glob"]`
- **Generator agents**: `["Read", "Write", "Grep"]`
- **Executor agents**: `["Read", "Write", "Bash", "Grep"]`
- **Full access**: Omit tools field

### Customize Colors

Choose colors that match agent purpose:
- **Blue**: Analysis, review, investigation
- **Cyan**: Documentation, information
- **Green**: Generation, creation, success-oriented
- **Yellow**: Validation, warnings, caution
- **Red**: Security, critical analysis, errors
- **Magenta**: Refactoring, transformation, creative

## Using These Templates

1. Copy template that matches your use case
2. Replace placeholders with your specifics
3. Customize process steps for your domain
4. Adjust examples to your triggering scenarios
5. Validate with `scripts/validate-agent.sh`
6. Test triggering with real scenarios
7. Iterate based on agent performance

These templates provide battle-tested starting points. Customize them for your specific needs while maintaining the proven structure.
