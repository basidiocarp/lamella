# System Prompt Design Patterns

Complete guide to writing effective agent system prompts that enable autonomous, high-quality operation.

## Core Structure

Every agent system prompt should follow this proven structure:

```markdown
You are [specific role] specializing in [specific domain].

**Your Core Responsibilities:**
1. [Primary responsibility - the main task]
2. [Secondary responsibility - supporting task]
// ... (20 lines trimmed)
Handle these situations:
- [Edge case 1]: [Specific handling approach]
- [Edge case 2]: [Specific handling approach]
```

## Pattern 1: Analysis Agents

For agents that analyze code, PRs, or documentation:

```markdown
You are an expert [domain] analyzer specializing in [specific analysis type].

**Your Core Responsibilities:**
1. Thoroughly analyze [what] for [specific issues]
2. Identify [patterns/problems/opportunities]
// ... (36 lines trimmed)
- No issues found: Provide positive feedback and validation
- Too many issues: Group and prioritize top 10
- Unclear code: Request clarification rather than guessing
```

## Pattern 2: Generation Agents

For agents that create code, tests, or documentation:

```markdown
You are an expert [domain] engineer specializing in creating high-quality [output type].

**Your Core Responsibilities:**
1. Generate [what] that meets [quality standards]
2. Follow [specific conventions/patterns]
// ... (28 lines trimmed)
- Insufficient context: Ask user for clarification
- Conflicting patterns: Follow most recent/explicit pattern
- Complex requirements: Break into smaller pieces
```

## Pattern 3: Validation Agents

For agents that validate, check, or verify:

```markdown
You are an expert [domain] validator specializing in ensuring [quality aspect].

**Your Core Responsibilities:**
1. Validate [what] against [criteria]
2. Identify violations and issues
// ... (35 lines trimmed)
- No violations: Confirm validation passed
- Too many violations: Group by type, show top 20
- Ambiguous rules: Document uncertainty, request clarification
```

## Pattern 4: Orchestration Agents

For agents that coordinate multiple tools or steps:

```markdown
You are an expert [domain] orchestrator specializing in coordinating [complex workflow].

**Your Core Responsibilities:**
1. Coordinate [multi-step process]
2. Manage [resources/tools/dependencies]
// ... (33 lines trimmed)
- Phase failure: Attempt retry, then report and stop
- Missing dependencies: Request from user
- Timeout: Report partial completion
```

## Writing Style Guidelines

### Tone and Voice

**Use second person (addressing the agent):**
```
✅ You are responsible for...
✅ You will analyze...
✅ Your process should...

❌ The agent is responsible for...
❌ This agent will analyze...
❌ I will analyze...
```

### Clarity and Specificity

**Be specific, not vague:**
```
✅ Check for SQL injection by examining all database queries for parameterization
❌ Look for security issues

✅ Provide file:line references for each finding
❌ Show where issues are

✅ Categorize as critical (security), major (bugs), or minor (style)
❌ Rate the severity of issues
```

### Actionable Instructions

**Give concrete steps:**
```
✅ Read the file using the Read tool, then search for patterns using Grep
❌ Analyze the code

✅ Generate test file at test/path/to/file.test.ts
❌ Create tests
```

## Common Pitfalls

### ❌ Vague Responsibilities

```markdown
**Your Core Responsibilities:**
1. Help the user with their code
2. Provide assistance
3. Be helpful
```

**Why bad:** Not specific enough to guide behavior.

### ✅ Specific Responsibilities

```markdown
**Your Core Responsibilities:**
1. Analyze TypeScript code for type safety issues
2. Identify missing type annotations and improper 'any' usage
3. Recommend specific type improvements with examples
```

### ❌ Missing Process Steps

```markdown
Analyze the code and provide feedback.
```

**Why bad:** Agent doesn't know HOW to analyze.

### ✅ Clear Process

```markdown
**Analysis Process:**
1. Read code files using Read tool
2. Scan for type annotations on all functions
3. Check for 'any' type usage
4. Verify generic type parameters
5. List findings with file:line references
```

### ❌ Undefined Output

```markdown
Provide a report.
```

**Why bad:** Agent doesn't know what format to use.

### ✅ Defined Output Format

```markdown
**Output Format:**
## Type Safety Report

### Summary
[Overview of findings]

### Issues Found
- `file.ts:42` - Missing return type on `processData`
- `utils.ts:15` - Unsafe 'any' usage in parameter

### Recommendations
[Specific fixes with examples]
```

## Length Guidelines

### Minimum Viable Agent

**~500 words minimum:**
- Role description
- 3 core responsibilities
- 5-step process
- Output format

### Standard Agent

**~1,000-2,000 words:**
- Detailed role and expertise
- 5-8 responsibilities
- 8-12 process steps
- Quality standards
- Output format
- 3-5 edge cases

### Comprehensive Agent

**~2,000-5,000 words:**
- Complete role with background
- Comprehensive responsibilities
- Detailed multi-phase process
- Extensive quality standards
- Multiple output formats
- Many edge cases
- Examples within system prompt

**Avoid > 10,000 words:** Too long, diminishing returns.

## Testing System Prompts

### Test Completeness

Can the agent handle these based on system prompt alone?

- [ ] Typical task execution
- [ ] Edge cases mentioned
- [ ] Error scenarios
- [ ] Unclear requirements
- [ ] Large/complex inputs
- [ ] Empty/missing inputs

### Test Clarity

Read the system prompt and ask:

- Can another developer understand what this agent does?
- Are process steps clear and actionable?
- Is output format unambiguous?
- Are quality standards measurable?

### Iterate Based on Results

After testing agent:
1. Identify where it struggled
2. Add missing guidance to system prompt
3. Clarify ambiguous instructions
4. Add process steps for edge cases
5. Re-test

## Conclusion

Effective system prompts are:
- **Specific**: Clear about what and how
- **Structured**: Organized with clear sections
- **Complete**: Covers normal and edge cases
- **Actionable**: Provides concrete steps
- **Testable**: Defines measurable standards

Use the patterns above as templates, customize for your domain, and iterate based on agent performance.
