# Marketplace Considerations for Commands

Guidelines for creating commands designed for distribution and marketplace success.

## Overview

Commands distributed through marketplaces need additional consideration beyond personal use commands. They must work across environments, handle diverse use cases, and provide excellent user experience for unknown users.

## Design for Distribution

### Universal Compatibility

**Cross-platform considerations:**

```markdown
---
description: Cross-platform command
allowed-tools: Bash(*)
---

// ... (22 lines trimmed)
fi

[Platform-appropriate implementation...]
```

**Avoid platform-specific commands:**

```markdown
<!-- BAD: macOS-specific -->
!`pbcopy < file.txt`

<!-- GOOD: Platform detection -->
// ... (7 lines trimmed)
  echo "Clipboard not available on this platform"
fi
```

### Minimal Dependencies

**Check for required tools:**

```markdown
---
description: Dependency-aware command
allowed-tools: Bash(*)
---

// ... (30 lines trimmed)
✓ All dependencies available

[Continue with command...]
```

**Document optional dependencies:**

```markdown
<!--
DEPENDENCIES:
  Required:
  - git 2.0+: Version control
// ... (6 lines trimmed)
  Feature availability depends on installed tools.
-->
```

### Graceful Degradation

**Handle missing features:**

```markdown
---
description: Feature-aware command
---

# Feature Detection
// ... (22 lines trimmed)
fi

[Adapt behavior based on available features...]
```

## User Experience for Unknown Users

### Clear Onboarding

**First-run experience:**

```markdown
---
description: Command with onboarding
allowed-tools: Read, Write
---

// ... (23 lines trimmed)
fi

[Normal command execution...]
```

**Progressive feature discovery:**

```markdown
---
description: Command with tips
---

# Command Execution
// ... (8 lines trimmed)
  /command --fast [args]

For more tips: /command tips
```

### Comprehensive Error Handling

**Anticipate user mistakes:**

```markdown
---
description: Forgiving command
---

# User Input Handling
// ... (24 lines trimmed)
fi

[Command continues...]
```

**Helpful diagnostics:**

```markdown
---
description: Diagnostic command
---

# Operation Failed
// ... (16 lines trimmed)
This information helps debug the issue.

For support, include the above diagnostics.
```

## Distribution Best Practices

### Namespace Awareness

**Avoid name collisions:**

```markdown
---
description: Namespaced command
---

<!--
// ... (14 lines trimmed)
# Plugin Name Command

[Implementation...]
```

**Document naming rationale:**

```markdown
<!--
NAMING DECISION:

Command name: /deploy-app
// ... (9 lines trimmed)
- Uniqueness (unlikely conflicts)
-->
```

### Configurability

**User preferences:**

```markdown
---
description: Configurable command
allowed-tools: Read
---

// ... (19 lines trimmed)
fi

[Use configuration in command...]
```

**Sensible defaults:**

```markdown
---
description: Command with smart defaults
---

# Smart Defaults
// ... (16 lines trimmed)
verbose: true
---
\`\`\`
```

### Version Compatibility

**Version checking:**

```markdown
---
description: Version-aware command
---

<!--
// ... (29 lines trimmed)
✓ Version compatible

[Command continues...]
```

**Deprecation warnings:**

```markdown
---
description: Command with deprecation warnings
---

# Deprecation Check
// ... (16 lines trimmed)
fi

[Handle both old and new flags during deprecation period...]
```

## Marketplace Presentation

### Command Discovery

**Descriptive naming:**

```markdown
---
description: Review pull request with security and quality checks
---

<!-- GOOD: Descriptive name and description -->
```

```markdown
---
description: Do the thing
---

<!-- BAD: Vague description -->
```

**Searchable keywords:**

```markdown
<!--
KEYWORDS: security, code-review, quality, validation, audit

These keywords help users discover this command when searching
for related functionality in the marketplace.
-->
```

### Showcase Examples

**Compelling demonstrations:**

```markdown
---
description: Advanced code analysis command
---

# Code Analysis Command
// ... (37 lines trimmed)
Ready to analyze your code...

[Command implementation...]
```

### User Reviews and Feedback

**Feedback mechanism:**

```markdown
---
description: Command with feedback
---

# Command Complete
// ... (16 lines trimmed)
- /command feedback

Your feedback matters!
```

**Usage analytics preparation:**

```markdown
<!--
ANALYTICS NOTES:

Track for improvement:
// ... (8 lines trimmed)
- User opt-out respected
-->
```

## Quality Standards

### Professional Polish

**Consistent branding:**

```markdown
---
description: Branded command
---

# ✨ Command Name
// ... (10 lines trimmed)
- Community: https://community.example.com

Powered by Plugin Name v2.1.0
```

**Attention to detail:**

```markdown
<!-- Details that matter -->

✓ Use proper emoji/symbols consistently
✓ Align output columns neatly
✓ Format numbers with thousands separators
✓ Use color/formatting appropriately
✓ Provide progress indicators
✓ Show estimated time remaining
✓ Confirm successful operations
```

### Reliability

**Idempotency:**

```markdown
---
description: Idempotent command
---

# Safe Repeated Execution
// ... (20 lines trimmed)

Marking complete...
echo "$(date)" > .claude/operation-completed.flag
```

**Atomic operations:**

```markdown
---
description: Atomic command
---

# Atomic Operation
// ... (21 lines trimmed)

  No changes applied. Safe to retry.
fi
```

## Testing for Distribution

### Pre-Release Checklist

```markdown
<!--
PRE-RELEASE CHECKLIST:

Functionality:
- [ ] Works on macOS
// ... (31 lines trimmed)
- [ ] Feedback mechanism
- [ ] License specified
-->
```

### Beta Testing

**Beta release approach:**

```markdown
---
description: Beta command (v0.9.0)
---

# 🧪 Beta Command
// ... (27 lines trimmed)
**Thank you for beta testing!**

Your feedback helps make this command better.
```

## Maintenance and Updates

### Update Strategy

**Versioned commands:**

```markdown
<!--
VERSION STRATEGY:

Major (X.0.0): Breaking changes
- Document all breaking changes
// ... (15 lines trimmed)
- Minors: Monthly
- Majors: Annually or as needed
-->
```

**Update notifications:**

```markdown
---
description: Update-aware command
---

# Check for Updates
// ... (19 lines trimmed)
fi

[Command continues...]
```

## Best Practices Summary

### Distribution Design

1. **Universal**: Works across platforms and environments
2. **Self-contained**: Minimal dependencies, clear requirements
3. **Graceful**: Degrades gracefully when features unavailable
4. **Forgiving**: Anticipates and handles user mistakes
5. **Helpful**: Clear errors, good defaults, excellent docs

### Marketplace Success

1. **Discoverable**: Clear name, good description, searchable keywords
2. **Professional**: Polished presentation, consistent branding
3. **Reliable**: Tested thoroughly, handles edge cases
4. **Maintainable**: Versioned, updated regularly, supported
5. **User-focused**: Great UX, responsive to feedback

### Quality Standards

1. **Complete**: Fully documented, all features working
2. **Tested**: Works in real environments, edge cases handled
3. **Secure**: No vulnerabilities, safe operations
4. **Performant**: Reasonable speed, resource-efficient
5. **Ethical**: Privacy-respecting, user consent

With these considerations, commands become marketplace-ready and delight users across diverse environments and use cases.
