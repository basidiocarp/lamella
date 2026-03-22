# Command Documentation Patterns

Strategies for creating self-documenting, maintainable commands with excellent user experience.

## Overview

Well-documented commands are easier to use, maintain, and distribute. Documentation should be embedded in the command itself, making it immediately accessible to users and maintainers.

## Self-Documenting Command Structure

### Complete Command Template

```markdown
---
description: Clear, actionable description under 60 chars
argument-hint: [arg1] [arg2] [optional-arg]
allowed-tools: Read, Bash(git:*)
model: sonnet
// ... (49 lines trimmed)
[Guide user through steps...]

[Provide clear output...]
```

### Documentation Comment Sections

**PURPOSE**: Why the command exists
- Problem it solves
- Use cases
- When to use vs when not to use

**USAGE**: Basic syntax
- Command invocation pattern
- Required vs optional arguments
- Default values

**ARGUMENTS**: Detailed argument documentation
- Each argument described
- Type information
- Valid values/ranges
- Defaults

**EXAMPLES**: Concrete usage examples
- Common use cases
- Edge cases
- Expected outputs

**REQUIREMENTS**: Prerequisites
- Dependencies
- Permissions
- Environmental setup

**RELATED COMMANDS**: Connections
- Similar commands
- Complementary commands
- Alternative approaches

**TROUBLESHOOTING**: Common issues
- Known problems
- Solutions
- Workarounds

**CHANGELOG**: Version history
- What changed when
- Breaking changes highlighted
- Migration guidance

## In-Line Documentation Patterns

### Commented Sections

```markdown
---
description: Complex multi-step command
---

<!-- SECTION 1: VALIDATION -->
// ... (16 lines trimmed)
[Recommendations...]

<!-- END: Next steps for user -->
```

### Inline Explanations

```markdown
---
description: Deployment command with inline docs
---

# Deploy to $1
// ... (33 lines trimmed)
1. Monitor logs: /logs $1
2. Run smoke tests: /smoke-test $1
3. Notify team: /notify-deployment $1
```

### Decision Point Documentation

```markdown
---
description: Interactive deployment command
---

# Interactive Deployment
// ... (21 lines trimmed)
<!-- All subsequent steps are automated -->

Proceeding with deployment...
```

## Help Text Patterns

### Built-in Help Command

Create a help subcommand for complex commands:

```markdown
---
description: Main command with help
argument-hint: [subcommand] [args]
---

// ... (25 lines trimmed)
fi

[Regular command processing...]
```

### Contextual Help

Provide help based on context:

```markdown
---
description: Context-aware command
argument-hint: [operation] [target]
---

// ... (20 lines trimmed)
fi

[Command continues if operation provided...]
```

## Error Message Documentation

### Helpful Error Messages

```markdown
---
description: Command with good error messages
---

# Validation Command
// ... (33 lines trimmed)
fi

[Command continues if validation passes...]
```

### Error Recovery Guidance

```markdown
---
description: Command with recovery guidance
---

# Operation Command
// ... (28 lines trimmed)

  Exit.
fi
```

## Usage Example Documentation

### Embedded Examples

```markdown
---
description: Command with embedded examples
---

# Feature Command
// ... (44 lines trimmed)
Now processing your request...

[Command implementation...]
```

### Example-Driven Documentation

```markdown
---
description: Example-heavy command
---

# Transformation Command
// ... (45 lines trimmed)
Format: $2

[Perform transformation...]
```

## Maintenance Documentation

### Version and Changelog

```markdown
<!--
VERSION: 2.1.0
LAST UPDATED: 2025-01-15
AUTHOR: DevOps Team

// ... (32 lines trimmed)
  - #123: Slow performance with large files (workaround: use --stream flag)
  - #456: Special characters in Windows (fix planned for v2.2.0)
-->
```

### Maintenance Notes

```markdown
<!--
MAINTENANCE NOTES:

CODE STRUCTURE:
  - Lines 1-50: Argument parsing and validation
// ... (31 lines trimmed)
  - lib/formatter.sh: Output formatting
  - config/defaults.yml: Default configuration
-->
```

## README Documentation

Commands should have companion README files:

```markdown
# Command Name

Brief description of what the command does.

## Installation
// ... (73 lines trimmed)
- Issues: https://github.com/user/plugin/issues
- Docs: https://docs.example.com
- Email: support@example.com
```

## Best Practices

### Documentation Principles

1. **Write for your future self**: Assume you'll forget details
2. **Examples before explanations**: Show, then tell
3. **Progressive disclosure**: Basic info first, details available
4. **Keep it current**: Update docs when code changes
5. **Test your docs**: Verify examples actually work

### Documentation Locations

1. **In command file**: Core usage, examples, inline explanations
2. **README**: Installation, configuration, troubleshooting
3. **Separate docs**: Detailed guides, tutorials, API reference
4. **Comments**: Implementation details for maintainers

### Documentation Style

1. **Clear and concise**: No unnecessary words
2. **Active voice**: "Run the command" not "The command can be run"
3. **Consistent terminology**: Use same terms throughout
4. **Formatted well**: Use headings, lists, code blocks
5. **Accessible**: Assume reader is beginner

### Documentation Maintenance

1. **Version everything**: Track what changed when
2. **Deprecate gracefully**: Warn before removing features
3. **Migration guides**: Help users upgrade
4. **Archive old docs**: Keep old versions accessible
5. **Review regularly**: Ensure docs match reality

## Documentation Checklist

Before releasing a command:

- [ ] Description in frontmatter is clear
- [ ] argument-hint documents all arguments
- [ ] Usage examples in comments
- [ ] Common use cases shown
- [ ] Error messages are helpful
- [ ] Requirements documented
- [ ] Related commands listed
- [ ] Changelog maintained
- [ ] Version number updated
- [ ] README created/updated
- [ ] Examples actually work
- [ ] Troubleshooting section complete

With good documentation, commands become self-service, reducing support burden and improving user experience.
