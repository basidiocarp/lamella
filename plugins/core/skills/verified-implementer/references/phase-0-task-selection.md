# Phase 0: Parse User Input and Select Task

Parse user input to get the task file path and arguments.

## Step 0.1: Resolve Task File

**If `$ARGUMENTS` is empty or only contains flags:**

1. **Check in-progress folder first:**

   ```bash
   ls .specs/tasks/in-progress/*.md 2>/dev/null
   ```

   - If exactly 1 file → Set `$TASK_FILE` to that file, `$TASK_FOLDER` to `in-progress`
   - If multiple files → List them and ask user: "Multiple tasks in progress. Which one to continue?"
   - If no files → Continue to step 2

2. **Check todo folder:**

   ```bash
   ls .specs/tasks/todo/*.md 2>/dev/null
   ```

   - If exactly 1 file → Set `$TASK_FILE` to that file, `$TASK_FOLDER` to `todo`
   - If multiple files → List them and ask user: "Multiple tasks in todo. Which one to implement?"
   - If no files → Report "No tasks available. Create one with /add-task first." and STOP

**If `$ARGUMENTS` contains a task file name:**

1. Search for the file in order: `in-progress/` → `todo/` → `done/`
2. Set `$TASK_FILE` and `$TASK_FOLDER` accordingly
3. If not found, report error and STOP

## Step 0.2: Move to In-Progress (if needed)

**If task is in `todo/` folder:**

```bash
git mv .specs/tasks/todo/$TASK_FILE .specs/tasks/in-progress/
# Fallback if git not available: mv .specs/tasks/todo/$TASK_FILE .specs/tasks/in-progress/
```

Update `$TASK_PATH` to `.specs/tasks/in-progress/$TASK_FILE`

**If task is already in `in-progress/`:**
Set `$TASK_PATH` to `.specs/tasks/in-progress/$TASK_FILE`

## Step 0.3: Parse Flags and Initialize Configuration

Parse all flags from `$ARGUMENTS` and initialize configuration.
**Display resolved configuration:**

```markdown
### Configuration

| Setting | Value |
|---------|-------|
| **Task File** | {TASK_PATH} |
| **Standard Components Threshold** | {THRESHOLD_FOR_STANDARD_COMPONENTS}/5.0 |
| **Critical Components Threshold** | {THRESHOLD_FOR_CRITICAL_COMPONENTS}/5.0 |
| **Max Iterations** | {MAX_ITERATIONS or "3"} |
| **Human Checkpoints** | {HUMAN_IN_THE_LOOP_STEPS as comma-separated or "All steps" or "None"} |
| **Skip Judges** | {SKIP_JUDGES} |
| **Continue Mode** | {CONTINUE_MODE} |
| **Refine Mode** | {REFINE_MODE} |
```

## Step 0.4: Handle Continue Mode

**If `CONTINUE_MODE` is true:**

1. **Identify Last Completed Step:**
   - Parse task file for `[DONE]` markers on step titles
   - Find the highest step number marked `[DONE]`
   - Set `LAST_COMPLETED_STEP` to that number (or 0 if none)

2. **Verify Last Completed Step (if any):**
   - If `LAST_COMPLETED_STEP > 0`:
     - Launch judge agent to verify the artifacts from that step
     - If judge PASS: Set `RESUME_FROM_STEP = LAST_COMPLETED_STEP + 1`
     - If judge FAIL: Set `RESUME_FROM_STEP = LAST_COMPLETED_STEP` (re-implement)

3. **Skip to Resume Point:**
   - In Phase 2, skip all steps before `RESUME_FROM_STEP`
   - Continue execution from `RESUME_FROM_STEP`

## Step 0.5: Handle Refine Mode

**If `REFINE_MODE` is true:**

1. **Detect Changed Project Files:**

   ```bash
   # Check for staged and unstaged changes
   STAGED=$(git diff --cached --name-only)
   UNSTAGED=$(git diff --name-only)
   ```

   **Determine comparison mode:**

   ```
   if STAGED is not empty AND UNSTAGED is not empty:
       # Both staged and unstaged - use unstaged only
       CHANGED_FILES = git diff --name-only  # working dir vs staging
       COMPARISON_MODE = "unstaged_only"
   elif STAGED is not empty OR UNSTAGED is not empty:
       # Only one type - compare against last commit
       CHANGED_FILES = git diff HEAD --name-only
       COMPARISON_MODE = "vs_last_commit"
   else:
       # No changes
       Report: "No project changes detected. Make edits first, then run --refine."
       Exit
   ```

2. **Load Task File and Extract Step→File Mapping:**
   - Read the task file to get implementation steps
   - For each step, extract the files it creates/modifies from:
     - "Expected Output" sections
     - Subtask descriptions mentioning file paths
     - `#### Verification` artifact paths
   - Build mapping: `STEP_FILE_MAP = {step_number → [file_paths]}`

3. **Map Changed Files to Steps:**

   ```
   AFFECTED_STEPS = []
   for each changed_file:
       for step_number, file_list in STEP_FILE_MAP:
           if changed_file matches any path in file_list:
               AFFECTED_STEPS.append(step_number)
   ```

   - If no steps matched: "Changed files don't map to any implementation step. Verify manually."

4. **Determine Refine Scope:**
   - `REFINE_FROM_STEP` = min(AFFECTED_STEPS)  # earliest affected step
   - All steps from `REFINE_FROM_STEP` onwards need re-verification
   - Steps before `REFINE_FROM_STEP` are preserved as-is

5. **Store Changed Files Context:**
   - `CHANGED_FILES` = list of changed file paths
   - `USER_CHANGES_CONTEXT` = git diff output for affected files
   - Pass this context to judge and implementation agents
   - Agents should build upon user's fixes, not overwrite them
