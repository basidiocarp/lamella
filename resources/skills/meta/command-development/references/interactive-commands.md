# Interactive Command Patterns

Comprehensive guide to creating commands that gather user feedback and make decisions through the AskUserQuestion tool.

## Overview

Some commands need user input that doesn't work well with simple arguments. For example:
- Choosing between multiple complex options with trade-offs
- Selecting multiple items from a list
- Making decisions that require explanation
- Gathering preferences or configuration interactively

For these cases, use the **AskUserQuestion tool** within command execution rather than relying on command arguments.

## When to Use AskUserQuestion

### Use AskUserQuestion When:

1. **Multiple choice decisions** with explanations needed
2. **Complex options** that require context to choose
3. **Multi-select scenarios** (choosing multiple items)
4. **Preference gathering** for configuration
5. **Interactive workflows** that adapt based on answers

### Use Command Arguments When:

1. **Simple values** (file paths, numbers, names)
2. **Known inputs** user already has
3. **Scriptable workflows** that should be automatable
4. **Fast invocations** where prompting would slow down

## AskUserQuestion Basics

### Tool Parameters

```typescript
{
  questions: [
    {
      question: "Which authentication method should we use?",
      header: "Auth method",  // Short label (max 12 chars)
// ... (15 lines trimmed)
    }
  ]
}
```

**Key points:**
- Users can always choose "Other" to provide custom input (automatic)
- `multiSelect: true` allows selecting multiple options
- Options should be 2-4 choices (not more)
- Can ask 1-4 questions per tool call

## Command Pattern for User Interaction

### Basic Interactive Command

```markdown
---
description: Interactive setup command
allowed-tools: AskUserQuestion, Write
---

// ... (66 lines trimmed)
## Step 4: Confirm and Next Steps

Confirm configuration created and guide user on next steps.
```

### Multi-Stage Interactive Workflow

```markdown
---
description: Multi-stage interactive workflow
allowed-tools: AskUserQuestion, Read, Write, Bash
---

// ... (37 lines trimmed)
## Stage 4: Execute Setup

Based on confirmed configuration, execute setup steps.
```

## Interactive Question Design

### Question Structure

**Good questions:**
```markdown
Question: "Which database should we use for this project?"
Header: "Database"
Options:
  - PostgreSQL (Relational, ACID compliant, best for complex queries)
  - MongoDB (Document store, flexible schema, best for rapid iteration)
  - Redis (In-memory, fast, best for caching and sessions)
```

**Poor questions:**
```markdown
Question: "Database?"  // Too vague
Header: "DB"  // Unclear abbreviation
Options:
  - Option 1  // Not descriptive
  - Option 2
```

### Option Design Best Practices

**Clear labels:**
- Use 1-5 words
- Specific and descriptive
- No jargon without context

**Helpful descriptions:**
- Explain what the option means
- Mention key benefits or trade-offs
- Help user make informed decision
- Keep to 1-2 sentences

**Appropriate number:**
- 2-4 options per question
- Don't overwhelm with too many choices
- Group related options
- "Other" automatically provided

### Multi-Select Questions

**When to use multiSelect:**

```markdown
Use AskUserQuestion for enabling features:

Question: "Which features do you want to enable?"
Header: "Features"
multiSelect: true  // Allow selecting multiple
Options:
  - Logging (Detailed operation logs)
  - Metrics (Performance monitoring)
  - Alerts (Error notifications)
  - Backups (Automatic backups)
```

User can select any combination: none, some, or all.

**When NOT to use multiSelect:**

```markdown
Question: "Which authentication method?"
multiSelect: false  // Only one auth method makes sense
```

Mutually exclusive choices should not use multiSelect.

## Command Patterns with AskUserQuestion

### Pattern 1: Simple Yes/No Decision

```markdown
---
description: Command with confirmation
allowed-tools: AskUserQuestion, Bash
---

// ... (16 lines trimmed)
If user selects "No":
  Cancel operation
  Exit without changes
```

### Pattern 2: Multiple Configuration Questions

```markdown
---
description: Multi-question configuration
allowed-tools: AskUserQuestion, Write
---

// ... (26 lines trimmed)
- options: Linting, Type checking, Code coverage, Security scanning

Process all answers together to generate cohesive configuration.
```

### Pattern 3: Conditional Question Flow

```markdown
---
description: Conditional interactive workflow
allowed-tools: AskUserQuestion, Read, Write
---

// ... (29 lines trimmed)
## Process Conditional Answers

Generate configuration appropriate for selected complexity level.
```

### Pattern 4: Iterative Collection

```markdown
---
description: Collect multiple items iteratively
allowed-tools: AskUserQuestion, Write
---

// ... (33 lines trimmed)
## Generate Team Configuration

After collecting all N members, create team configuration file with all members and their roles.
```

### Pattern 5: Dependency Selection

```markdown
---
description: Select dependencies with multi-select
allowed-tools: AskUserQuestion
---

// ... (22 lines trimmed)
- Generate sample configuration
- Create usage examples
- Update documentation
```

## Best Practices for Interactive Commands

### Question Design

1. **Clear and specific**: Question should be unambiguous
2. **Concise header**: Max 12 characters for clean display
3. **Helpful options**: Labels are clear, descriptions explain trade-offs
4. **Appropriate count**: 2-4 options per question, 1-4 questions per call
5. **Logical order**: Questions flow naturally

### Error Handling

```markdown
# Handle AskUserQuestion Responses

After calling AskUserQuestion, verify answers received:

// ... (8 lines trimmed)
If answers look correct:
  Process as expected
```

### Progressive Disclosure

```markdown
# Start Simple, Get Detailed as Needed

## Question 1: Setup Type

Use AskUserQuestion:
// ... (14 lines trimmed)
If "Guided":
  Ask questions with extra explanation
  Provide recommendations along the way
```

### Multi-Select Guidelines

**Good multi-select use:**
```markdown
Question: "Which features do you want to enable?"
multiSelect: true
Options:
  - Logging
  - Metrics
  - Alerts
  - Backups

Reason: User might want any combination
```

**Bad multi-select use:**
```markdown
Question: "Which database engine?"
multiSelect: true  // ❌ Should be single-select

Reason: Can only use one database engine
```

## Advanced Patterns

### Validation Loop

```markdown
---
description: Interactive with validation
allowed-tools: AskUserQuestion, Bash
---

// ... (23 lines trimmed)
    - Cancel (Abort setup)

  Based on answer, retry or proceed or exit.
```

### Build Configuration Incrementally

```markdown
---
description: Incremental configuration builder
allowed-tools: AskUserQuestion, Write, Read
---

// ... (32 lines trimmed)
  - Yes (Save and apply)
  - No (Start over)
  - Modify (Edit specific settings)
```

### Dynamic Options Based on Context

```markdown
---
description: Context-aware questions
allowed-tools: AskUserQuestion, Bash, Read
---

// ... (31 lines trimmed)
    - Pylint (Linting and style)

Questions adapt to project context.
```

## Real-World Example: Multi-Agent Swarm Launch

**From multi-agent-swarm plugin:**

```markdown
---
description: Launch multi-agent swarm
allowed-tools: AskUserQuestion, Read, Write, Bash
---

// ... (97 lines trimmed)
3. Save to `.daisy/swarm/tasks.md`
4. Show user the file path
5. Proceed with launch using generated task list
```

## Best Practices

### Question Writing

1. **Be specific**: "Which database?" not "Choose option?"
2. **Explain trade-offs**: Describe pros/cons in option descriptions
3. **Provide context**: Question text should stand alone
4. **Guide decisions**: Help user make informed choice
5. **Keep concise**: Header max 12 chars, descriptions 1-2 sentences

### Option Design

1. **Meaningful labels**: Specific, clear names
2. **Informative descriptions**: Explain what each option does
3. **Show trade-offs**: Help user understand implications
4. **Consistent detail**: All options equally explained
5. **2-4 options**: Not too few, not too many

### Flow Design

1. **Logical order**: Questions flow naturally
2. **Build on previous**: Later questions use earlier answers
3. **Minimize questions**: Ask only what's needed
4. **Group related**: Ask related questions together
5. **Show progress**: Indicate where in flow

### User Experience

1. **Set expectations**: Tell user what to expect
2. **Explain why**: Help user understand purpose
3. **Provide defaults**: Suggest recommended options
4. **Allow escape**: Let user cancel or restart
5. **Confirm actions**: Summarize before executing

## Common Patterns

### Pattern: Feature Selection

```markdown
Use AskUserQuestion:

Question: "Which features do you need?"
Header: "Features"
multiSelect: true
Options:
  - Authentication
  - Authorization
  - Rate Limiting
  - Caching
```

### Pattern: Environment Configuration

```markdown
Use AskUserQuestion:

Question: "Which environment is this?"
Header: "Environment"
Options:
  - Development (Local development)
  - Staging (Pre-production testing)
  - Production (Live environment)
```

### Pattern: Priority Selection

```markdown
Use AskUserQuestion:

Question: "What's the priority for this task?"
Header: "Priority"
Options:
  - Critical (Must be done immediately)
  - High (Important, do soon)
  - Medium (Standard priority)
  - Low (Nice to have)
```

### Pattern: Scope Selection

```markdown
Use AskUserQuestion:

Question: "What scope should we analyze?"
Header: "Scope"
Options:
  - Current file (Just this file)
  - Current directory (All files in directory)
  - Entire project (Full codebase scan)
```

## Combining Arguments and Questions

### Use Both Appropriately

**Arguments for known values:**
```markdown
---
argument-hint: [project-name]
allowed-tools: AskUserQuestion, Write
---

Setup for project: $1

Now gather additional configuration...

Use AskUserQuestion for options that require explanation.
```

**Questions for complex choices:**
```markdown
Project name from argument: $1

Now use AskUserQuestion to choose:
- Architecture pattern
- Technology stack
- Deployment strategy

These require explanation, so questions work better than arguments.
```

## Troubleshooting

**Questions not appearing:**
- Verify AskUserQuestion in allowed-tools
- Check question format is correct
- Ensure options array has 2-4 items

**User can't make selection:**
- Check option labels are clear
- Verify descriptions are helpful
- Consider if too many options
- Ensure multiSelect setting is correct

**Flow feels confusing:**
- Reduce number of questions
- Group related questions
- Add explanation between stages
- Show progress through workflow

With AskUserQuestion, commands become interactive wizards that guide users through complex decisions while maintaining the clarity that simple arguments provide for straightforward inputs.
