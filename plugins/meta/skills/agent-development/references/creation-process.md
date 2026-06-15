# Agent Creation Process

Step-by-step guide for creating production-quality agents.

## Step 1: Gather Requirements

Ask the user, if it is not already clear:

1. **Agent name**: What should the agent be called? Use kebab-case.
2. **Purpose**: What problem does this agent solve?
3. **Triggers**: When should Claude use this agent?
4. **Responsibilities**: What are the core tasks?
5. **Tools needed**: Read-only, editing, or shell access?
6. **Model**: Need maximum capability or balanced cost?

## Step 2: Create Agent File

```bash
# Create agents directory if needed
mkdir -p ${CLAUDE_PLUGIN_ROOT}/agents

# Create agent file
touch ${CLAUDE_PLUGIN_ROOT}/agents/<agent-name>.md
```

## Step 3: Write Frontmatter

Generate frontmatter with:

- unique, descriptive name
- description with triggering conditions and examples
- appropriate model setting
- distinct color
- minimal required tools

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

Create the system prompt with these sections:

1. role statement with specialization
2. core responsibilities
3. workflow
4. boundaries
5. output format
6. quality bar

### System Prompt Template

```markdown
You are [role] specializing in [domain].

**Your Core Responsibilities:**
1. [Primary responsibility]
2. [Secondary responsibility]
3. [Tertiary responsibility]

**Scope**
- [What the agent should handle]
- [What it should not handle]

**Workflow**
1. [How the agent starts analysis]
2. [How it gathers evidence]
3. [How it decides what matters]
4. [How it presents results]

**Output Format**
- [Section 1]
- [Section 2]
- [Section 3]

**Quality Bar**
- [Verification rule 1]
- [Verification rule 2]

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
- [ ] All required fields are present
- [ ] Examples are complete
- [ ] System prompt is explicit and scoped

## Step 6: Test Triggering

Test with:

1. explicit requests matching examples
2. implicit needs where the agent should activate
3. scenarios where the agent should not activate
4. edge cases and close neighbors

## AI-Assisted Agent Generation

Use this prompt to generate agent configurations automatically:

```markdown
Create an agent configuration based on this request: "[YOUR DESCRIPTION]"

Requirements:
1. Extract core intent and responsibilities.
2. Design expert persona for the domain.
3. Define when the agent should and should not activate.
4. Produce realistic trigger examples.
5. Write a complete system prompt with scope, workflow, boundaries, and output format.
6. Return valid JSON only using this schema:

{
  "identifier": "kebab-case-name",
  "whenToUse": "Use this agent when... Examples: <example>...</example>",
  "systemPrompt": "You are..."
}
```

## Elite Agent Architect Process

When creating agents, follow this 6-step process:

1. **Extract Core Intent**: Identify fundamental purpose, key responsibilities, and success criteria.
2. **Design Expert Persona**: Create a clear expert identity with the right domain knowledge.
3. **Architect Comprehensive Instructions**: Define behavior, workflow, boundaries, and edge cases.
4. **Optimize for Performance**: Add decision rules, quality controls, and fallback strategies.
5. **Create Identifier**: Keep it concise, descriptive, and kebab-case.
6. **Generate Examples**: Show realistic trigger scenarios with context and commentary.

## Quality Checklist

Before deployment:

- [ ] Name follows conventions: lowercase, hyphens, 3-50 chars
- [ ] Description starts with `Use this agent when...`
- [ ] Description includes 2-4 `<example>` blocks
- [ ] Each example has context, user, assistant, and commentary
- [ ] Model is appropriate for task complexity
- [ ] Color is unique among related agents
- [ ] Tools are restricted to what is needed
- [ ] System prompt has clear structure
- [ ] Responsibilities are specific and actionable
- [ ] Output format is defined
- [ ] Boundaries and edge cases are addressed
