# Agent Triggering Patterns

Four patterns for when and how agents should be activated.

## Pattern 1: Explicit Request

User directly asks for the agent's function.

```markdown
<example>
Context: User wants code reviewed
user: "Can you review my code changes?"
assistant: "I'll use the code-reviewer agent to analyze the changes."
<commentary>
User explicitly requested code review, trigger the code-reviewer agent.
</commentary>
</example>
```

**Characteristics:**
- User uses keywords matching agent function
- Request is direct and unambiguous
- Most common activation pattern

## Pattern 2: Implicit Need

Agent needed based on context, not explicit request.

```markdown
<example>
Context: User mentions code is hard to understand
user: "This code is confusing and hard to follow"
assistant: "I can help improve the code clarity."
<commentary>
User indicates complexity issues. Trigger code-simplifier agent to refactor
for better readability.
</commentary>
assistant: "I'll use the code-simplifier agent to suggest improvements."
</example>
```

**Characteristics:**
- User describes a problem, not a solution
- Agent matches to the underlying need
- Requires interpretation of user intent

## Pattern 3: Proactive Trigger

Agent triggers after completing relevant work without explicit request.

```markdown
<example>
Context: User just implemented database queries
user: "I've added the user search functionality"
assistant: "Great! Let me review it for security."
<commentary>
Database code written. Proactively trigger security-analyzer to check
for SQL injection and other database security issues.
</commentary>
assistant: "I'll use the security-analyzer agent to check the database code."
</example>
```

**Characteristics:**
- No explicit user request for the agent
- Prior context indicates need for agent
- Improves workflow quality automatically
- Best for quality assurance agents

## Pattern 4: Tool Usage Pattern

Agent triggers based on prior tool usage.

```markdown
<example>
Context: User made multiple edits to test files
user: "I've updated all the tests"
assistant: "Great! Let me verify test quality."
<commentary>
Multiple Edit tools used on test files. Proactively trigger test-quality-analyzer
to ensure tests follow best practices.
</commentary>
assistant: "I'll use the test-quality-analyzer agent to review the tests."
</example>
```

**Characteristics:**
- Triggered by patterns in tool usage
- Multiple file edits to specific file types
- Monitors workflow for optimization opportunities

## Writing Effective Trigger Conditions

### Good Trigger Descriptions

```markdown
# Specific and actionable
description: Use this agent when the user asks to review code changes,
check code quality, or analyze modifications for bugs and improvements.

# Clear context for proactive triggers
description: Use this agent after database operations are written to check
for SQL injection variables and security issues.

# Multiple trigger scenarios
description: Use this agent when reviewing authentication code, handling
user credentials, or implementing access control.
```

### Poor Trigger Descriptions

```markdown
# Too vague
description: Helps with code.

# No triggering conditions
description: A code review agent.

# Missing examples
description: Use for security analysis.
```

## Example Block Format

Every agent needs concrete examples:

```markdown
<example>
Context: [Describe the situation - what led to this interaction]
user: "[Exact user message or request]"
assistant: "[How Claude should respond before triggering]"
<commentary>
[Explanation of why this agent should be triggered in this scenario]
</commentary>
assistant: "[How Claude triggers the agent - 'I'll use the [agent-name] agent...']"
</example>
```

## Best Practices

1. **Include 2-4 examples** - Cover different phrasings and scenarios
2. **Show proactive triggers** - When agent should activate without being asked
3. **Explain reasoning** - Commentary helps Claude understand trigger logic
4. **Be specific about when NOT to use** - Avoid false positives
