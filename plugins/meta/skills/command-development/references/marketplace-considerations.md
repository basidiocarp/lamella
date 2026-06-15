# Marketplace Considerations for Commands

Guidance for commands intended for broad distribution rather than a single
developer's local setup.

## Overview

Marketplace-ready commands should:
- run across multiple environments
- fail clearly when prerequisites are missing
- guide unknown users toward success on the first run
- avoid hidden assumptions about shell, tools, or repository layout

## Design for Distribution

### Universal Compatibility

Prefer shell-neutral logic when possible. If shell commands are required, detect
platform differences explicitly.

```markdown
---
description: Cross-platform command
allowed-tools: Bash(*)
---

if [[ "$OSTYPE" == darwin* ]]; then
  echo "Running macOS-specific setup"
elif [[ "$OSTYPE" == linux* ]]; then
  echo "Running Linux-specific setup"
else
  echo "Unsupported platform for this step"
  exit 1
fi
```

Avoid commands that only work on one platform unless the command is clearly
documented as platform-specific.

### Minimal Dependencies

Check for required tools early and stop with a useful message.

```markdown
---
description: Dependency-aware command
allowed-tools: Bash(*)
---

for tool in git jq; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Missing required tool: $tool"
    echo "Install it and re-run the command."
    exit 1
  fi
done

echo "All dependencies available"
```

Document optional dependencies separately so the user knows which features will
degrade gracefully.

```markdown
<!--
DEPENDENCIES:
  Required:
  - git: repository operations
  Optional:
  - jq: prettier JSON formatting
-->
```

### Graceful Degradation

If an optional capability is missing, continue with a simpler path instead of
failing the whole command.

```markdown
---
description: Feature-aware command
allowed-tools: Bash(*)
---

if command -v jq >/dev/null 2>&1; then
  cat package.json | jq '.name'
else
  echo "jq not installed; printing raw package.json instead"
  cat package.json
fi
```

## User Experience for Unknown Users

### Clear Onboarding

The first run should explain what the command will do and what files or inputs
it expects.

```markdown
---
description: Command with onboarding
allowed-tools: Read, Write
---

if [[ ! -f .claude/plugin.json ]]; then
  echo "This command expects to run in a Claude Code plugin repository."
  echo "Create or open a plugin repo, then try again."
  exit 1
fi

echo "Detected plugin repository. Continuing..."
```

### Progressive Discovery

Keep the default path short, but point users toward deeper help.

```markdown
---
description: Command with tips
---

echo "Fast mode: /command --fast [args]"
echo "Need more guidance? Run: /command tips"
```

### Comprehensive Error Handling

Anticipate the mistakes a new user is most likely to make.

```markdown
---
description: Forgiving command
---

if [[ -z "$ARGUMENTS" ]]; then
  echo "Usage: /command [required-input]"
  echo "Example: /command my-feature"
  exit 1
fi
```

Helpful diagnostics should include enough context to debug without drowning the
user in raw logs.

```markdown
---
description: Diagnostic command
---

echo "Operation failed"
echo "Working directory: $(pwd)"
echo "Git branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
echo "Node version: $(node --version 2>/dev/null || echo unavailable)"
```

## Distribution Best Practices

### Namespace Awareness

Use command names that are descriptive and unlikely to collide with common
verbs.

```markdown
---
description: Review a plugin manifest for marketplace readiness
---
```

Prefer a scoped name like `/plugin-review-marketplace` over a generic name like
`/review`.

### Configurability

Let users opt into project-specific defaults without editing the command body.

```markdown
---
description: Configurable command
allowed-tools: Read
---

if [[ -f .claude/my-plugin.local.md ]]; then
  echo "Loading local plugin settings"
fi
```

### Sensible Defaults

Defaults should help the median user succeed without reading the source.

```markdown
---
description: Command with smart defaults
---

# Defaults:
# - dry-run enabled unless --apply is passed
# - concise output unless --verbose is passed
```

### Version Compatibility

Be explicit when a command relies on repo or platform versions.

```markdown
---
description: Version-aware command
allowed-tools: Bash(*)
---

required_major=20
node_major=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)

if (( node_major < required_major )); then
  echo "Node 20+ is required for this command."
  exit 1
fi
```

## Marketplace Presentation

### Command Discovery

Descriptions should tell users what the command does, not just what domain it
belongs to.

Good:

```markdown
---
description: Review pull request changes for security and release risk
---
```

Bad:

```markdown
---
description: Do the thing
---
```

### Showcase Examples

Include one short example of a realistic invocation.

```markdown
Example:
/release-check docs-and-manifests --verbose
```

### Quality Standards

Before distributing a command, verify:
- frontmatter is valid and minimal
- help text matches actual behavior
- optional dependencies degrade cleanly
- platform assumptions are documented
- failure messages suggest the next action

## Testing for Distribution

### Pre-Release Checklist

- Run the command in a clean checkout
- Run it with missing optional tools
- Run it with missing required input
- Verify output is still understandable in non-happy paths
- Check both concise and verbose modes if supported

### Beta Testing

Have at least one person unfamiliar with the command try it without coaching.
Note where they hesitate or misread the expected inputs.

## Maintenance and Updates

Commands distributed through a marketplace age faster than local scripts.
Review them when:
- supported toolchains change
- platform assumptions change
- plugin layout changes
- user error reports cluster around the same failure mode

## Best Practices Summary

- Design for unknown users
- Fail early on missing prerequisites
- Prefer graceful degradation over brittle branching
- Use clear names and direct descriptions
- Keep examples short but complete
