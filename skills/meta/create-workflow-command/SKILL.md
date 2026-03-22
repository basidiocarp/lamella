---
name: create-workflow-command
description: "Create a workflow command that orchestrates multi-step execution through sub-agents with file-based task prompts. Use when building multi-step automation, creating orchestrator commands, or designing sub-agent workflows."
metadata:
  argument-hint: "[workflow-name] [description]"
---
# Create Workflow Command

Create a command that orchestrates multi-step workflows by dispatching sub-agents with task-specific instructions stored in separate files.

## User Input

```text
Workflow Name: $1
Description: $2
```

## Architecture Overview

Workflow commands solve the **context bloat problem**: instead of embedding detailed step instructions in the main command (polluting orchestrator context), store them in separate task files that sub-agents read on-demand.

```
plugins/<plugin-name>/
├── commands/
│   └── <workflow>.md          # Lean orchestrator (~50-100 tokens per step)
├── agents/                     # Optional: reusable executor agents
│   └── step-executor.md       # Custom agent with specific tools/behavior
└── tasks/                      # All task instructions directly here
    ├── step-1-<name>.md       # Full instructions (~500+ tokens each)
    ├── step-2-<name>.md
    ├── step-3-<name>.md
    └── common-context.md      # Shared context across workflows
```

## Key Principles

### 1. Context Isolation

Each sub-agent gets its own isolated context window. The main orchestrator stays lean while sub-agents load detailed instructions from files.

| Component | Context Cost | Purpose |
|-----------|--------------|---------|
| Orchestrator command | ~50-100 tokens/step | Dispatch and coordinate |
| Task file | ~500+ tokens | Detailed step instructions |
| Sub-agent base | ~294 tokens | System prompt overhead |

### 2. Sub-Agent Capabilities

Sub-agents spawned via Task tool:

| Capability | Available | Notes |
|------------|-----------|-------|
| Read tool | ✅ Yes | Can read any file |
| Write tool | ✅ Yes | If not restricted |
| Grep/Glob | ✅ Yes | For code search |
| Skills loading | ❌ No | Skills don't auto-load in sub-agents |
| Spawn sub-agents | ❌ No | Cannot nest Task tool |
| Resume context | ✅ Yes | Via `resume` parameter |

### 3. File Reference Pattern

Use `${CLAUDE_PLUGIN_ROOT}` for portable paths within plugin:

```markdown
Read ${CLAUDE_PLUGIN_ROOT}/tasks/step-1-workflow-name.md and execute.
```

Sub-agent will use Read tool to fetch the file content.

## Implementation Process

### Step 1: Gather Requirements

Ask user (if not provided):

1. **Workflow name**: kebab-case identifier (e.g., `feature-implementation`)
2. **Description**: What the workflow accomplishes
3. **Steps**: List of discrete steps with:
   - Step name
   - Step goal
   - Required tools
   - Expected output
4. **Execution mode**: Sequential or parallel steps
5. **Agent type**: `general-purpose` or custom agent

### Step 2: Create Directory Structure

```bash
# Create tasks directory (if it doesn't exist)

## Contents

- [User Input](#user-input)
// ... (59 lines trimmed)

# Optional: Create agents directory (if using custom agents)
mkdir -p ${CLAUDE_PLUGIN_ROOT}/agents
```

**Note**: All task files (both workflow-specific steps and shared context) are placed directly in `tasks/` without subdirectories.

### Step 3: Create Task Files

For each step, create a task file with this structure:

```markdown
# Step N: <Step Name>

## Context
You are executing step N of the <workflow-name> workflow.

// ... (18 lines trimmed)
## Success Criteria
- [ ] <Measurable outcome>
- [ ] <Measurable outcome>
```

### Step 4: Create Orchestrator Command

Create the main command file with this pattern:

```markdown
---
description: <Workflow description>
argument-hint: <Required arguments>
allowed-tools: Task, Read
model: sonnet
// ... (46 lines trimmed)
1. <What was accomplished>
2. <Key outputs>
3. <Next steps if any>
```

#### Frontmatter Options

| Field | Purpose | Default |
|-------|---------|---------|
| `description` | Brief description of workflow purpose | Required |
| `argument-hint` | Expected arguments description | None |
| `allowed-tools` | Tools the command can use | Inherits from conversation |
| `model` | Specific Claude model (sonnet, opus, haiku) | Inherits from conversation |

**Model selection**:
- `haiku` - Fast, efficient for simple workflows
- `sonnet` - Balanced performance (recommended default)
- `opus` - Maximum capability for complex orchestration

## Execution Patterns

### Pattern A: Sequential Steps (Default)

Each step depends on previous step's output:

```markdown
### Step 1: Analyze
Launch agent → Get analysis result

### Step 2: Plan (uses Step 1 result)
Launch agent with Step 1 context → Get plan

### Step 3: Execute (uses Step 2 result)
Launch agent with Step 2 context → Complete
```

### Pattern B: Parallel Independent Steps

Steps can run concurrently:

```markdown
### Analysis Phase (Parallel)

Launch 3 agents simultaneously:
1. Agent 1: Security analysis → Read ${CLAUDE_PLUGIN_ROOT}/tasks/step-1a-security.md
2. Agent 2: Performance analysis → Read ${CLAUDE_PLUGIN_ROOT}/tasks/step-1b-performance.md
3. Agent 3: Code quality analysis → Read ${CLAUDE_PLUGIN_ROOT}/tasks/step-1c-quality.md

**Wait for all**, then consolidate results.

### Synthesis Phase
Launch agent with all analysis results...
```

### Pattern C: Stateful Multi-Step (Resume)

When steps need shared context:

```markdown
### Step 1: Initialize
Launch agent, **capture agent_id**

### Step 2: Continue (same context)
Resume agent using agent_id:
- **resume**: <agent_id from Step 1>
- **prompt**: "Proceed to phase 2: <additional instructions>"
```

## Example: Feature Implementation Workflow

### Orchestrator Command

```markdown
---
description: Execute feature implementation through research, planning, and coding phases
argument-hint: [feature-description]
allowed-tools: Task, Read, TodoWrite
model: sonnet
// ... (52 lines trimmed)
1. Files created/modified
2. Tests added
3. Remaining work
```

### Task File Example (step-1-feature-impl-research.md)

```markdown
# Step 1: Feature Research

## Context
You are the research phase of a feature implementation workflow.

// ... (58 lines trimmed)
- [ ] Relevant existing code identified
- [ ] No implementation attempted
- [ ] Clear handoff to architecture phase
```

## Known Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| No nested sub-agents | Sub-agents can't spawn Task tool | Keep all orchestration in main command |
| No skill auto-loading | Sub-agents don't trigger skills | Pass explicit file paths or inline context |
| Fresh context per agent | Each dispatch starts empty | Use resume pattern OR pass summaries |
| File read latency | Extra tool call per step | Acceptable trade-off for context savings |

## Validation Checklist

Before finalizing workflow command:

- [ ] Each step has clear, specific goal
- [ ] Task files are self-contained (sub-agent doesn't need external context)
- [ ] File paths use `${CLAUDE_PLUGIN_ROOT}` for portability
- [ ] Context passed between steps is minimal (summaries, not full data)
- [ ] Orchestrator command stays lean (<100 tokens per step dispatch)
- [ ] Error handling defined for step failures
- [ ] Success criteria measurable for each step

## Create the Workflow

Based on user input, create:

1. **Directories**:
   - `${CLAUDE_PLUGIN_ROOT}/tasks/` - All task files directly here
   - `${CLAUDE_PLUGIN_ROOT}/agents/` - (Optional) Custom agent definitions

2. **Task files**: Create in `tasks/` directory with naming pattern `step-N-<workflow>-<name>.md`
   - Example: `step-1-feature-impl-research.md`
   - Example: `step-2-feature-impl-architecture.md`
   - Shared context: `common-context.md` directly in `tasks/`

3. **Orchestrator command**: Lean dispatch logic in `commands/<workflow-name>.md`

4. **Custom agents** (Optional): If workflow needs specialized agent behavior in `agents/`

5. **Update plugin.json**: Add command to plugin manifest if needed

After creation, suggest testing with `/customaize-agent:test-prompt` command.
