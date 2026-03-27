---
description: "Orchestrate git workflow from code review through PR creation with quality gates"
argument-hint: "<target branch> [--skip-tests] [--draft-pr] [--no-push] [--squash] [--conventional] [--trunk-based]"
---

# Git Workflow Orchestrator

## CRITICAL BEHAVIORAL RULES

You MUST follow these rules exactly. Violating any of them is a failure.

1. **Execute steps in order.** Do NOT skip ahead, reorder, or merge steps.
2. **Write output files.** Each step MUST produce its output file in `.git-workflow/` before the next step begins. Read from prior step files — do NOT rely on context window memory.
3. **Stop at checkpoints.** When you reach a `PHASE CHECKPOINT`, you MUST stop and wait for explicit user approval before continuing. Use the AskUserQuestion tool with clear options.
4. **Halt on failure.** If any step fails (agent error, test failure, missing dependency), STOP immediately. Present the error and ask the user how to proceed. Do NOT silently continue.
5. **Use only local agents.** All `subagent_type` references use agents bundled with this plugin or `general-purpose`. No cross-plugin dependencies.
6. **Never enter plan mode autonomously.** Do NOT use EnterPlanMode. This command IS the plan — execute it.

## Pre-flight Checks

Before starting, perform these checks:

### 1. Check for existing session

Check if `.git-workflow/state.json` exists:

- If it exists and `status` is `"in_progress"`: Read it, display the current step, and ask the user:

  ```
  Found an in-progress git workflow session:
  Target branch: [branch from state]
  Current step: [step from state]

  1. Resume from where we left off
  2. Start fresh (archives existing session)
  ```

- If it exists and `status` is `"complete"`: Ask whether to archive and start fresh.

### 2. Initialize state

Create `.git-workflow/` directory and `state.json`:

```json
{
  "target_branch": "$ARGUMENTS",
  "status": "in_progress",
  "flags": {
    "skip_tests": false,
    "draft_pr": false,
    "no_push": false,
    "squash": false,
    "conventional": true,
    "trunk_based": false
  },
  "current_step": 1,
  "current_phase": 1,
  "completed_steps": [],
  "files_created": [],
  "started_at": "ISO_TIMESTAMP",
  "last_updated": "ISO_TIMESTAMP"
}
```

Parse `$ARGUMENTS` for the target branch (defaults to 'main') and flags. Use defaults if not specified.

### 3. Gather git context

Run these commands and save output:

- `git status` — current working tree state
- `git diff --stat` — summary of changes
- `git diff` — full diff of changes
- `git log --oneline -10` — recent commit history
- `git branch --show-current` — current branch name

Save this context to `.git-workflow/00-git-context.md`.

---

## Phase 1: Pre-Commit Review and Analysis (Steps 1–2)

### Step 1: Code Quality Assessment

Read `.git-workflow/00-git-context.md`.

Use the Task tool to launch the code reviewer:

```
Task:
  subagent_type: "code-reviewer"
  description: "Review uncommitted changes for code quality"
  prompt: |
    Review all uncommitted changes for code quality issues.

    Focus on:
    - correctness or regression risk
    - security and data handling issues
    - missing tests and verification gaps
    - file/line-specific findings ordered by severity

    Write your complete review as a single markdown document.
```

Save the agent's output to `.git-workflow/01-code-review.md`.

Update `state.json`: set `current_step` to 2, add step 1 to `completed_steps`.

### Step 2: Dependency and Breaking Change Analysis

Read `.git-workflow/00-git-context.md` and `.git-workflow/01-code-review.md`.

Use the Task tool:

```
Task:
  subagent_type: "code-reviewer"
  description: "Analyze changes for dependencies and breaking changes"
  prompt: |
    Analyze the changes for dependency and breaking change issues.

    Focus on:
    - direct and transitive dependency changes
    - config or API compatibility risks
    - migration steps required before release
    - lockfile or generated file drift

    Write your complete analysis as a single markdown document.
```

Save output to `.git-workflow/02-breaking-changes.md`.

Update `state.json`: set `current_step` to "checkpoint-1", add step 2 to `completed_steps`.

---

## PHASE CHECKPOINT 1 — User Approval Required

Display a summary of code review and breaking change analysis and ask:

```
Pre-commit review complete. Please review:
- .git-workflow/01-code-review.md
- .git-workflow/02-breaking-changes.md

Issues found: [X critical, Y high, Z medium, W low]
Breaking changes: [summary]

1. Approve — proceed to testing (or skip if --skip-tests)
2. Fix issues first — I'll address the critical/high issues
3. Pause — save progress and stop here
```

If user selects option 2, address the critical/high issues, then re-run the review and re-checkpoint.

Do NOT proceed to Phase 2 until the user approves.

---

## Phase 2: Testing and Validation (Steps 3–4)

If `--skip-tests` flag is set, skip to Phase 3. Write a note in `.git-workflow/03-test-results.md` explaining tests were skipped.

### Step 3: Test Execution and Coverage

Read `.git-workflow/00-git-context.md` and `.git-workflow/01-code-review.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Execute test suites for modified code"
  prompt: |
    You are a test automation expert. Execute all test suites for the modified code.

    Cover:
    - which test commands were run
    - pass/fail status and notable failures
    - flaky or skipped areas
    - whether additional validation is still needed

    Write your complete test report as a single markdown document.
```

Save output to `.git-workflow/03-test-results.md`.

Update `state.json`: set `current_step` to 4, add step 3 to `completed_steps`.

### Step 4: Test Recommendations and Gap Analysis

Read `.git-workflow/03-test-results.md` and `.git-workflow/02-breaking-changes.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Identify test gaps and recommend additional tests"
  prompt: |
    You are a test automation expert. Based on test results and code changes, identify
    testing gaps.
    Cover:
    - changed behavior without direct coverage
    - edge cases still unverified
    - integration paths not exercised
    - highest-value next tests to add

    Write your complete analysis as a single markdown document.
```

Save output to `.git-workflow/04-test-gaps.md`.

Update `state.json`: set `current_step` to "checkpoint-2", add step 4 to `completed_steps`.

---

## PHASE CHECKPOINT 2 — User Approval Required

Display test results summary and ask:

```
Testing complete. Please review:
- .git-workflow/03-test-results.md
- .git-workflow/04-test-gaps.md

Test results: [X passed, Y failed, Z skipped]
Coverage: [summary]
Test gaps: [summary of critical gaps]

1. Approve — proceed to commit message generation
2. Fix failing tests first
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 3 until the user approves. If tests are failing, the user must address them first.

---

## Phase 3: Commit Message Generation (Steps 5–6)

### Step 5: Change Analysis and Categorization

Read `.git-workflow/00-git-context.md` and `.git-workflow/03-test-results.md`.

Use the Task tool:

```
Task:
  subagent_type: "code-reviewer"
  description: "Categorize changes for commit message"
  prompt: |
    Analyze all changes and categorize them according to Conventional Commits specification.

    Consider:
    - whether the dominant change is feat, fix, refactor, docs, test, or chore
    - whether there are separate independent change groups
    - whether the scope should name a specific subproject

    Write your complete categorization as a single markdown document.
```

Save output to `.git-workflow/05-change-categorization.md`.

Update `state.json`: set `current_step` to 6, add step 5 to `completed_steps`.

### Step 6: Conventional Commit Message Creation

Read `.git-workflow/05-change-categorization.md` and `.git-workflow/02-breaking-changes.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Create Conventional Commits message for changes"
  prompt: |
    You are an expert at writing clear, well-structured Conventional Commits messages.
    Create commit message(s) based on the change categorization.
    Output:
    - one preferred commit message
    - optional alternatives if the diff splits naturally
    - brief rationale for scope choice when ambiguous

    Write the commit messages as a single markdown document with clear delimiters.
```

Save output to `.git-workflow/06-commit-messages.md`.

Update `state.json`: set `current_step` to "checkpoint-3", add step 6 to `completed_steps`.

---

## PHASE CHECKPOINT 3 — User Approval Required

Display the proposed commit message(s) and ask:

```
Commit message(s) ready. Please review .git-workflow/06-commit-messages.md

[Display the commit message(s)]

1. Approve — proceed to branch management and push
2. Edit message — tell me what to change
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 4 until the user approves.

---

## Phase 4: Branch Strategy and Push (Steps 7–8)

### Step 7: Branch Management and Pre-Push Validation

Read `.git-workflow/00-git-context.md`, `.git-workflow/06-commit-messages.md`, and all previous step files.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Prepare branch strategy and validate push readiness"
  prompt: |
    You are a deployment engineer specializing in git workflows and CI/CD.

    Validate:
    - branch is ready for push or PR
    - required checks/tests are identified
    - release or deployment implications are called out
    - any blockers to merge are explicit

    Write your complete validation as a single markdown document.
```

Save output to `.git-workflow/07-branch-validation.md`.

Update `state.json`: set `current_step` to 8, add step 7 to `completed_steps`.

If `--no-push` flag is set, skip Step 8 and proceed to Phase 5.

### Step 8: Execute Git Operations

Based on the approved commit messages and branch validation:

1. Stage changes: `git add` the relevant files
2. Create commit(s) using the approved messages from `.git-workflow/06-commit-messages.md`
3. If `--squash` flag: squash commits as configured
4. Push to remote with appropriate flags

**Important:** Before executing any git operations, display the planned commands and ask for final confirmation:

```
Ready to execute git operations:
[List exact commands]

1. Execute — run these commands
2. Modify — adjust the commands
3. Abort — do not execute
```

Save execution results to `.git-workflow/08-push-results.md`.

Update `state.json`: set `current_step` to "checkpoint-4", add step 8 to `completed_steps`.

---

## PHASE CHECKPOINT 4 — User Approval Required (if not --no-push)

```
Git operations complete. Please review .git-workflow/08-push-results.md

1. Approve — proceed to PR creation
2. Pause — save progress and stop here
```

---

## Phase 5: Pull Request Creation (Steps 9–10)

If `--no-push` flag is set, skip this phase entirely.

### Step 9: PR Description Generation

Read all `.git-workflow/*.md` files.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Create comprehensive PR description"
  prompt: |
    You are a technical writer specializing in pull request documentation.
    Create a comprehensive PR description.
    Include:
    - summary of the change
    - affected areas and risk notes
    - validation performed
    - follow-up work or rollout notes

    Write the complete PR description as a single markdown document.
```

Save output to `.git-workflow/09-pr-description.md`.

Update `state.json`: set `current_step` to 10, add step 9 to `completed_steps`.

### Step 10: PR Creation and Metadata

Read `.git-workflow/09-pr-description.md` and `.git-workflow/00-git-context.md`.

Create the PR using the `gh` CLI:

- Use the description from `.git-workflow/09-pr-description.md`
- Set draft status if `--draft-pr` flag is set
- Add appropriate labels based on change categorization
- Link related issues if referenced

**Important:** Display the planned PR creation command and ask for confirmation:

```
Ready to create PR:
Title: [proposed title]
Target: [target branch]
Draft: [yes/no]

1. Create PR — execute now
2. Edit — adjust title or description
3. Skip — don't create PR
```

Save PR URL and metadata to `.git-workflow/10-pr-created.md`.

Update `state.json`: set `current_step` to "complete", add step 10 to `completed_steps`.

---

## Completion

Update `state.json`:

- Set `status` to `"complete"`
- Set `last_updated` to current timestamp

Present the final summary:

```
Git workflow complete!

## Files Created
[List all .git-workflow/ output files]

## Workflow Summary
1. Review code quality and dependency impact before committing.
2. Run tests and identify remaining test gaps.
3. Hotfix Branch: For critical issues, create hotfix branch from main
4. Communication: Notify team via designated channels
```
