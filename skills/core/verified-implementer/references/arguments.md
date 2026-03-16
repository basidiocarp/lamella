# Command Arguments Reference

## Argument Definitions

| Argument | Format | Default | Description |
|----------|--------|---------|-------------|
| `task-file` | Path or filename | Auto-detect | Task file name or path (e.g., `add-validation.feature.md`) |
| `--continue` | `--continue` | None | Continue implementation from last completed step. Launches judge first to verify state, then iterates with implementation agent. |
| `--refine` | `--refine` | `false` | Incremental refinement mode - detect changes against git and re-implement only affected steps (from modified step onwards). |
| `--human-in-the-loop` | `--human-in-the-loop [step1,step2,...]` | None | Steps after which to pause for human verification. If no steps specified, pauses after every step. |
| `--target-quality` | `--target-quality X.X` or `--target-quality X.X,Y.Y` | `4.0` (standard) / `4.5` (critical) | Target threshold value (out of 5.0). Single value sets both. Two comma-separated values set standard,critical. |
| `--max-iterations` | `--max-iterations N` | `3` | Maximum fix→verify cycles per step. Default is 3 iterations. Set to `unlimited` for no limit. |
| `--skip-judges` | `--skip-judges` | `false` | Skip all judge validation checks - steps proceed without quality gates. |

## Configuration Resolution

Parse `$ARGUMENTS` and resolve configuration as follows:

```
# Extract task file (first positional argument, optional - auto-detect if not provided)
TASK_FILE = first argument that is a file path or filename

# Parse --target-quality (supports single value or two comma-separated values)
if --target-quality has single value X.X:
// ... (16 lines trimmed)
# Special handling for --human-in-the-loop without step list
if --human-in-the-loop present without step numbers:
    HUMAN_IN_THE_LOOP_STEPS = "*" (all steps)
```

## Context Resolution for `--continue`

When `--continue` is used:

1. **Step Resolution:**
   - Parse the task file for `[DONE]` markers on step titles
   - Identify the last incompleted step
   - Launch judge to verify the last INCOMPLETE step's artifacts
   - If judge PASS: Mark step as done and resume from the next step
   - If judge FAIL: Re-implement the step and iterate until PASS

2. **State Recovery:**
   - Check task file location (`in-progress/`, `todo/`, `done/`)
   - If in `todo/`, move to `in-progress/` before continuing
   - Pre-populate captured values from existing artifacts

## Refine Mode Behavior (`--refine`)

When `--refine` is used, it detects changes to **project files** (not the task file) and maps them to implementation steps to determine what needs re-verification.

### 1. Detect Changed Project Files

First, determine what to compare against based on git state:

```bash
# Check for staged changes
STAGED=$(git diff --cached --name-only)

# Check for unstaged changes
UNSTAGED=$(git diff --name-only)
```

**Comparison logic:**

| Staged | Unstaged | Compare Against | Command |
|--------|----------|-----------------|---------|
| Yes | Yes | Staged (unstaged only) | `git diff --name-only` |
| Yes | No | Last commit | `git diff HEAD --name-only` |
| No | Yes | Last commit | `git diff HEAD --name-only` |
| No | No | No changes | Exit with message |

- If **both staged AND unstaged**: Compare working directory vs staging area (unstaged changes only)
- If **only staged OR only unstaged**: Compare against last commit
- This ensures refine operates on the most recent work in progress

### 2. Map Changes to Implementation Steps

- Read the task file to get the list of implementation steps
- For each changed file, determine which step created/modified it:
  - Check step's "Expected Output" section for file paths
  - Check step's subtasks for file references
  - Check step's artifacts in `#### Verification` section
- Build a mapping: `{changed_file → step_number}`

### 3. Determine Affected Steps

- Find all steps that have associated changed files
- The **earliest affected step** is the starting point
- All steps from that point onwards need re-verification
- Earlier steps (unaffected) are preserved as-is

### 4. Refine Execution

- For each affected step (in order):
  - Launch **judge agent** to verify the step's artifacts (including user's changes)
  - If judge PASS: Mark step done, proceed to next
  - If judge FAIL: Launch implementation agent with user's changes as context, then re-verify
- User's manual fixes are preserved - implementation agent should build upon them, not overwrite

### 5. Example

```bash
# User manually fixed src/validation/validation.service.ts
# (This file was created in Step 2)

/implement my-task.feature.md --refine

# Detects: src/validation/validation.service.ts modified
# Maps to: Step 2 (Create ValidationService)
# Action: Launch judge for Step 2
#   - If PASS: User's fix is good, proceed to Step 3
#   - If FAIL: Implementation agent align rest of the code with user changes, without overwriting user's changes
# Continues: Step 3, Step 4... (re-verify all subsequent steps)
```

### 6. Multiple Files Changed

```bash
# User edited files from Step 2 AND Step 4

/implement my-task.feature.md --refine

# Detects: Files from Step 2 and Step 4 modified
# Earliest affected: Step 2
# Re-verifies: Step 2, Step 3, Step 4, Step 5...
# (Step 3 re-verified even though no direct changes, because it depends on Step 2)
```

### 7. Staged vs Unstaged Changes

```bash
# Scenario: User staged some changes, then made more edits
# Staged: src/validation/validation.service.ts (git add done)
# Unstaged: src/validation/validators/email.validator.ts (still editing)

/implement my-task.feature.md --refine
// ... (14 lines trimmed)
# Detects: Only staged changes
# Mode: Compares against last commit
# validation.service.ts changes are verified
```

## Human-in-the-Loop Behavior

Human verification checkpoints occur:

### Trigger Conditions

- After implementation + judge verification **PASS** for a step in `HUMAN_IN_THE_LOOP_STEPS`
- After implementation + judge + implementation retry (before the next judge retry)
- If `HUMAN_IN_THE_LOOP_STEPS` is `"*"`, triggers after every step

### At Checkpoint

- Display current step results summary
- Display generated artifacts with paths
- Display judge score and feedback
- Ask user: "Review step output. Continue? [Y/n/feedback]"
- If user provides feedback, incorporate into next iteration or step
- If user says "n", pause workflow

### Checkpoint Message Format

```markdown
---
## 🔍 Human Review Checkpoint - Step X

**Step:** {step title}
**Step Type:** {standard/critical}
// ... (11 lines trimmed)

> Continue? [Y/n/feedback]:
---
```
