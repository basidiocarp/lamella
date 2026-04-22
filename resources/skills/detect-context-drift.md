---
name: detect-context-drift
description: "Detects when an agent's working context (recent tool calls, files touched) drifts from the assigned task, preventing off-scope work."
origin: "Basidiocarp Canopy Drift Detection Pipeline"
---

# Detect Context Drift Skill

Use this skill to verify that your actual working context (the files you are reading and editing) remains aligned with the task you were assigned. Prevents off-scope tool usage and silent scope creep.

## When to Activate

- At task start, to establish the expected working scope
- Every 10-20 tool calls (Ed/Read/Bash/Glob) during active implementation
- When you notice yourself working in an unfamiliar area of the codebase
- When a tool call succeeds but the result seems unrelated to the task
- When switching between repositories or projects

## How It Works

The skill assesses alignment in two phases: capture recent activity and compare against expected scope.

### Phase 1: Capture Recent Working Context

Record the last 10-15 tool calls (or recent activity in the last 30 minutes if working in parallel):

**Data to collect:**

1. **Files touched** (Read, Edit, Write, Glob):
   - List all unique file paths accessed
   - Group by directory or module
   - Count reads vs writes

2. **Commands executed** (Bash):
   - List the last 5-10 non-trivial bash commands
   - Identify their purpose (build, test, search, git, etc.)

3. **Outcome patterns**:
   - Are the commands returning expected results?
   - Are errors or unexpected outputs appearing?
   - Is progress visible or are you repeating similar commands?

**Self-assessment methods:**

- Read the session history and count tool calls
- Ask the model (yourself) to summarize recent activity
- Check which directories your Read/Edit calls touched
- Review the actual task assignment to remind yourself of expected scope

### Phase 2: Compare Against Task Scope

Reference the task specification (from `canopy task view --task-id <id>` or from the handoff):

1. **Expected scope areas**: What repos, directories, or file patterns does the task mention?
   - Example: "modify src/auth/* and tests/auth/*"
   - Example: "update CLAUDE.md and ecosystem-versions.toml"

2. **Actual scope areas**: What did your tool calls actually touch?
   - List the directories or repos
   - Identify patterns (all in one repo, spread across three repos, etc.)

3. **Assessment**:
   - **ON-SCOPE**: recent activity stays within expected directories and file patterns
   - **CONTEXT DRIFT — minor**: activity touches adjacent areas (e.g., docs/ when task is code, or one extra test file) but core work is aligned
   - **CONTEXT DRIFT — major**: activity is in a different repo, module, or purpose than assigned task

## Output Format

Emit a structured context assessment:

```
Context Drift Check:
  Task: "<task title>" (ID: #<task-id>)
  Expected scope: <description from task spec>
  Recent activity: <M>/<N> tool calls
    Repos touched: <repo1>, <repo2>, ...
    Directories: <dir1>, <dir2>, ...
    File count: <M> files (read: <N>, write: <P>)
  Assessment: CONTEXT DRIFT — <specific reason> | ON-SCOPE — <confirmation>
  Confidence: low | medium | high
```

### On-Scope Example

```
Context Drift Check:
  Task: "Add verify scripts to audit campaign" (ID: #212)
  Expected scope: lamella/resources/skills and scripts/ directory
  Recent activity: 12/12 tool calls in relevant scope
    Repos touched: basidiocarp (root)
    Directories: scripts/, lamella/resources/skills/
    File count: 8 files (read: 4, write: 4)
  Assessment: ON-SCOPE — all activity aligns with task specification
  Confidence: high
```

### Context Drift — Minor

```
Context Drift Check:
  Task: "Implement auth refactor" (ID: #98)
  Expected scope: src/auth/*, tests/auth/*
  Recent activity: 15/18 tool calls
    Repos touched: mycelium
    Directories: src/auth/, tests/auth/, docs/
    File count: 11 files (read: 7, write: 4)
  Assessment: CONTEXT DRIFT — minor. Task scope is src/auth and tests/auth. 
               Recent activity includes docs/auth-guide.md (2 read calls).
               Core work (auth implementation) is on-scope; adjacent documentation 
               is outside scope but within same system.
  Confidence: medium
```

### Context Drift — Major

```
Context Drift Check:
  Task: "Fix cortina lifecycle signals" (ID: #147)
  Expected scope: cortina/src/lifecycle/* and cortina/tests/*
  Recent activity: 10/10 tool calls
    Repos touched: cortina (2 calls), lamella (5 calls), hyphae (3 calls)
    Directories: cortina/src/, lamella/resources/, hyphae/src/storage/
    File count: 9 files (read: 6, write: 3)
  Assessment: CONTEXT DRIFT — major. Task is cortina-specific lifecycle signals. 
              Recent activity shows 5 calls to lamella/resources/ (off-scope) and 
              3 calls to hyphae/src/storage/ (different repo, different subsystem).
              Hypothesis: scope has expanded or been redirected; needs clarification.
  Confidence: high
```

## Recovery When Drift is Detected

If you detect **minor drift**:
- Complete adjacent work only if it directly supports the main task
- Document the scope extension in the handoff notes
- Return to primary scope when adjacent work is done

If you detect **major drift**:
- Stop work in the off-scope area immediately
- Surface the drift to the human or orchestrating agent
- Wait for clarification before continuing
- Do not commit off-scope changes unless explicitly approved

## Operating Contract

**Context drift detection is continuous, not post-hoc.**

- Check alignment at task start
- Re-check every 10-20 tool calls during implementation
- Surface drift immediately when detected
- Treat major drift as a blocker until clarified
- Update the task or handoff if scope truly has changed

**When unsure about scope boundaries:**

- Ask: "Is my activity in this directory/repo within the task scope?"
- Do not assume scope can be inferred from file patterns alone
- Check the original task assignment for explicit scope statements

## Related Skills and Topics

- **detect-spec-drift**: checks whether code changes align with the specification
- **agent-introspection-debugging**: detects loops and stuck states; uses context drift patterns to avoid spinning in off-scope areas

## Handoff Pointers

- **Canopy task assignment**: canopy owns task scope and specification. Context drift detection reads task metadata.
- **Hyphae session context**: hyphae stores session-level context per task. You can use `hyphae session context --task-id <id>` to retrieve expected scope if available.
