# Agent Creation Process

Step-by-step guide for creating production-quality agents.

## Step 1: Gather Requirements

Ask user (if not provided):

1. **Agent name**: What should the agent be called? (kebab-case)
2. **Purpose**: What problem does this agent solve?
3. **Triggers**: When should Claude use this agent?
4. **Responsibilities**: What are the core tasks?
5. **Tools needed**: Read-only? Can modify files?
6. **Model**: Need maximum capability (opus) or balanced (sonnet/inherit)?

## Step 2: Create Agent File

```bash
# Create agents directory if needed
mkdir -p ${CLAUDE_PLUGIN_ROOT}/agents

# Create agent file
touch ${CLAUDE_PLUGIN_ROOT}/agents/<agent-name>.md
```

## Step 3: Write Frontmatter

Generate frontmatter with:

- Unique, descriptive name
- Description with triggering conditions and examples
- Appropriate model setting
- Distinct color
- Minimal required tools

### Model Selection Guide

| Value | Use Case | Cost |
|-------|----------|------|
| `inherit` | Use parent conversation model | Default |
| `haiku` | Fast, simple tasks | Lowest |
| `sonnet` | Balanced performance | Medium |
| `opus` | Maximum capability, complex reasoning | Highest |

### Tool Restriction Examples

```yaml
# Read-only analysis
tools: ["Read", "Grep", "Glob"]

# Code modification
tools: ["Read", "Write", "Grep", "Glob"]

# System operations
tools: ["Read", "Bash", "Grep"]
```

## Step 4: Write System Prompt

Create system prompt following the template:

1. Role statement with specialization
2. Core responsibilities (numbered list)
3. Analysis/work process (step-by-step)
4. Quality standards (measurable criteria)
5. Output format (specific structure)
6. Edge cases (how to handle special situations)

### System Prompt Template

```markdown
You are [role] specializing in [domain].

**Your Core Responsibilities:**
1. [Primary responsibility - what the agent MUST do]
2. [Secondary responsibility]
// ... (22 lines trimmed)
**What NOT to Do:**
- [Anti-pattern 1]
- [Anti-pattern 2]
```

## Step 5: Validate

Run validation:

```bash
scripts/validate-agent.sh agents/<agent-name>.md
```

Check:

- [ ] Frontmatter parses correctly
- [ ] All required fields present
- [ ] Examples are complete
- [ ] System prompt is comprehensive

## Step 6: Test Triggering

Test with various scenarios:

1. Explicit requests matching examples
2. Implicit needs where agent should activate
3. Scenarios where agent should NOT activate
4. Edge cases and variations

## AI-Assisted Agent Generation

Use this prompt to generate agent configurations automatically:

```markdown
Create an agent configuration based on this request: "[YOUR DESCRIPTION]"

Requirements:
1. Extract core intent and responsibilities
2. Design expert persona for the domain
// ... (12 lines trimmed)
  "whenToUse": "Use this agent when... Examples: <example>...</example>",
  "systemPrompt": "You are..."
}
```

## Elite Agent Architect Process

When creating agents, follow this 6-step process:

1. **Extract Core Intent**: Identify fundamental purpose, key responsibilities, success criteria
2. **Design Expert Persona**: Create compelling expert identity with domain knowledge
3. **Architect Comprehensive Instructions**: Behavioral boundaries, methodologies, edge cases, output formats
4. **Optimize for Performance**: Decision frameworks, quality control, workflow patterns, fallback strategies
5. **Create Identifier**: Concise, descriptive, 2-4 words with hyphens
6. **Generate Examples**: Triggering scenarios with context, user/assistant dialogue, commentary

## Quality Checklist

Before deployment:

- [ ] Name follows conventions (lowercase, hyphens, 3-50 chars)
- [ ] Description starts with "Use this agent when..."
- [ ] Description includes 2-4 `<example>` blocks
- [ ] Each example has context, user, assistant, commentary
- [ ] Model is appropriate for task complexity
- [ ] Color is unique among related agents
- [ ] Tools restricted to what's needed (least privilege)
- [ ] System prompt has clear structure
- [ ] Responsibilities are specific and actionable
- [ ] Process steps are concrete
- [ ] Output format is defined
- [ ] Edge cases are addressed
