# Advanced Workflow Patterns

Multi-step command sequences and composition patterns for complex workflows.

## Overview

Advanced workflows combine multiple commands, coordinate state across invocations, and create sophisticated automation sequences. These patterns enable building complex functionality from simple command building blocks.

## Multi-Step Command Patterns

### Sequential Workflow Command

Commands that guide users through multi-step processes:

```markdown
---
description: Complete PR review workflow
argument-hint: [pr-number]
allowed-tools: Bash(gh:*), Read, Grep
---
// ... (32 lines trimmed)
3. Leave comments only

Reply with your choice and I'll help complete the action.
```

**Key features:**
- Numbered steps for clarity
- Bash execution for context
- Decision points for user input
- Next action suggestions

### State-Carrying Workflow

Commands that maintain state between invocations:

```markdown
---
description: Initialize deployment workflow
allowed-tools: Write, Bash(git:*)
---

// ... (27 lines trimmed)
\`\`\`

State saved. Run `/deploy-test` to continue.
```

**Next command** (`/deploy-test`):
```markdown
---
description: Run deployment tests
allowed-tools: Read, Bash(npm:*)
---
// ... (6 lines trimmed)

Tests complete. Run `/deploy-build` to continue.
```

**Pattern benefits:**
- Persistent state across commands
- Clear workflow progression
- Safety checkpoints
- Resume capability

### Conditional Workflow Branching

Commands that adapt based on conditions:

```markdown
---
description: Smart deployment workflow
argument-hint: [environment]
allowed-tools: Bash(git:*), Bash(npm:*), Read
---
// ... (28 lines trimmed)
[Conditional steps based on environment and status]

Ready to deploy? (yes/no)
```

## Command Composition Patterns

### Command Chaining

Commands designed to work together:

```markdown
---
description: Prepare for code review
---

# Prepare Code Review
// ... (10 lines trimmed)
I'll compile results and prepare comprehensive review materials.

Starting sequence...
```

**Individual commands** are simple:
- `/format-code` - Just formats
- `/lint-code` - Just lints
- `/test-all` - Just tests

**Composition command** orchestrates them.

### Pipeline Pattern

Commands that process output from previous commands:

```markdown
---
description: Analyze test failures
---

# Analyze Test Failures
// ... (24 lines trimmed)
1. Fix highest priority failure
2. Generate detailed fix plans for all
3. Create GitHub issues for each
```

### Parallel Execution Pattern

Commands that coordinate multiple simultaneous operations:

```markdown
---
description: Run comprehensive validation
allowed-tools: Bash(*), Read
---

// ... (20 lines trimmed)

Details:
[Collated results from all checks]
```

## Workflow State Management

### Using .local.md Files

Store workflow state in plugin-specific files:

```markdown
.claude/plugin-name-workflow.local.md:

---
workflow: deployment
stage: testing
// ... (19 lines trimmed)
- Build
- Deploy
- Smoke tests
```

**Reading state in commands:**

```markdown
---
description: Continue deployment workflow
allowed-tools: Read, Write
---
// ... (6 lines trimmed)

Next action based on state: [determined action]
```

### Workflow Recovery

Handle interrupted workflows:

```markdown
---
description: Resume deployment workflow
allowed-tools: Read
---

// ... (14 lines trimmed)
3. Abort and clean up

Which would you like? (1/2/3)
```

## Workflow Coordination Patterns

### Cross-Command Communication

Commands that signal each other:

```markdown
---
description: Mark feature complete
allowed-tools: Write
---

// ... (9 lines trimmed)
- Release notes (/release-notes will add)

Feature marked complete.
```

**Other commands check for flag:**

```markdown
---
description: Generate release notes
allowed-tools: Read, Bash(git:*)
---
// ... (6 lines trimmed)

[Include in release notes]
```

### Workflow Locking

Prevent concurrent workflow execution:

```markdown
---
description: Start deployment
allowed-tools: Read, Write, Bash
---

// ... (15 lines trimmed)

Deployment started. Lock created.
[Proceed with deployment]
```

**Lock cleanup:**

```markdown
---
description: Complete deployment
allowed-tools: Write, Bash
---
// ... (5 lines trimmed)

Ready for next deployment.
```

## Advanced Argument Handling

### Optional Arguments with Defaults

```markdown
---
description: Deploy with optional version
argument-hint: [environment] [version]
---
// ... (7 lines trimmed)
- Environment defaults to 'staging'
- Version defaults to 'latest'
```

### Argument Validation

```markdown
---
description: Deploy to validated environment
argument-hint: [environment]
---

// ... (9 lines trimmed)
fi

Environment validated. Proceeding...
```

### Argument Transformation

```markdown
---
description: Deploy with shorthand
argument-hint: [env-shorthand]
---

// ... (12 lines trimmed)
esac

Deploying to: $ENV
```

## Error Handling in Workflows

### Graceful Failure

```markdown
---
description: Resilient deployment workflow
---

# Deployment Workflow
// ... (18 lines trimmed)

## Step 2: Build
[Continue only if Step 1 succeeded]
```

### Rollback on Failure

```markdown
---
description: Deployment with rollback
---

# Deploy with Rollback
// ... (16 lines trimmed)
fi

Deployment complete.
```

### Checkpoint Recovery

```markdown
---
description: Workflow with checkpoints
---

# Multi-Stage Deployment
// ... (12 lines trimmed)

If any step fails, resume with:
/deployment-resume [last-successful-checkpoint]
```

## Best Practices

### Workflow Design

1. **Clear progression**: Number steps, show current position
2. **Explicit state**: Don't rely on implicit state
3. **User control**: Provide decision points
4. **Error recovery**: Handle failures gracefully
5. **Progress indication**: Show what's done, what's pending

### Command Composition

1. **Single responsibility**: Each command does one thing well
2. **Composable design**: Commands work together easily
3. **Standard interfaces**: Consistent input/output formats
4. **Loose coupling**: Commands don't depend on each other's internals

### State Management

1. **Persistent state**: Use .local.md files
2. **Atomic updates**: Write complete state files atomically
3. **State validation**: Check state file format/completeness
4. **Cleanup**: Remove stale state files
5. **Documentation**: Document state file formats

### Error Handling

1. **Fail fast**: Detect errors early
2. **Clear messages**: Explain what went wrong
3. **Recovery options**: Provide clear next steps
4. **State preservation**: Keep state for recovery
5. **Rollback capability**: Support undoing changes

## Example: Complete Deployment Workflow

### Initialize Command

```markdown
---
description: Initialize deployment
argument-hint: [environment]
allowed-tools: Write, Bash(git:*)
---
// ... (16 lines trimmed)
Written to .claude/deployment-state.local.md

Next: Run /deployment-validate
```

### Validation Command

```markdown
---
description: Validate deployment
allowed-tools: Read, Bash
---
// ... (9 lines trimmed)

Next: Run /deployment-execute
```

### Execution Command

```markdown
---
description: Execute deployment
allowed-tools: Read, Bash, Write
---
// ... (9 lines trimmed)

Cleanup: /deployment-cleanup
```

### Cleanup Command

```markdown
---
description: Clean up deployment
allowed-tools: Bash
---

Removing deployment state...
rm .claude/deployment-state.local.md

Deployment workflow complete.
```

This complete workflow demonstrates state management, sequential execution, error handling, and clean separation of concerns across multiple commands.
