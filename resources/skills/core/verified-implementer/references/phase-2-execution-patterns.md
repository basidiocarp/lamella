# Phase 2: Execution Patterns

For each step in dependency order, use one of these patterns based on the verification requirements.

## Pattern A: Simple Step (No Verification)

**1. Launch Developer Agent:**

Use Task tool with:

- **Agent Type**: `sdd:developer`
- **Model**: As specified in step or `opus` by default
- **Description**: "Implement Step [N]: [Title]"
- **Prompt**:

```
Implement Step [N]: [Step Title]

Task File: $TASK_PATH
Step Number: [N]

Your task:
- Execute ONLY Step [N]: [Step Title]
- Do NOT execute any other steps
- Follow the Expected Output and Success Criteria exactly

When complete, report:
1. What files were created/modified (paths)
2. Confirmation that success criteria are met
3. Any issues encountered
```

**2. Use Agent's Report (No Verification)**

- Agent reports what was created → Use this information
- **DO NOT read the created files yourself**
- This pattern has NO verification (simple operations)

**3. Mark Step Complete**

- Update task file:
  - Mark step title with `[DONE]` (e.g., `### Step 1: Setup [DONE]`)
  - Mark step's subtasks as `[X]` complete
- Update todo to `completed`

---

## Pattern B: Critical Step (Panel of 2 Evaluations)

**1. Launch Developer Agent:**

Use Task tool with:

- **Agent Type**: `sdd:developer`
- **Model**: As specified in step or `opus` by default
- **Description**: "Implement Step [N]: [Title]"
- **Prompt**:

```
Implement Step [N]: [Step Title]

Task File: $TASK_PATH
Step Number: [N]

Your task:
- Execute ONLY Step [N]: [Step Title]
- Do NOT execute any other steps
- Follow the Expected Output and Success Criteria exactly

When complete, report:
1. What files were created/modified (paths)
2. Confirmation of completion
3. Self-critique summary
```

**2. Wait for Completion**

- Receive the agent's report
- Note the artifact path(s) from the report
- **DO NOT read the artifact yourself**

**3. Launch 2 Evaluation Agents in Parallel (MANDATORY):**

**⚠️ MANDATORY: This pattern requires launching evaluation agents. You MUST launch these evaluations. Do NOT skip. Do NOT verify yourself.**

**Use `sdd:developer` agent type for evaluations**

**Evaluation 1 & 2** (launch both in parallel with same prompt structure):

```
CLAUDE_PLUGIN_ROOT=${CLAUDE_PLUGIN_ROOT}

Read @${CLAUDE_PLUGIN_ROOT}/prompts/judge.md for evaluation methodology.

Evaluate artifact at: [artifact_path from implementation agent report]
// ... (12 lines trimmed)
You can verify the artifact works - run tests, check imports, validate syntax.

Return: scores per criterion with evidence, overall weighted score, PASS/FAIL, improvements if FAIL.
```

**4. Aggregate Results:**

- Calculate median score per criterion
- Flag high-variance criteria (std > 1.0)
- Pass if median overall ≥ threshold

**5. Determine Threshold:**

- Check if step is marked as critical in task file (in `#### Verification` section or step metadata)
- If critical: use `THRESHOLD_FOR_CRITICAL_COMPONENTS`
- If standard: use `THRESHOLD_FOR_STANDARD_COMPONENTS`

**6. On FAIL: Iterate Until PASS (max 3 iterations by default)**

- Present issues to implementation agent with judge feedback
- Re-implement with judge feedback incorporated (align code with requirements, preserve user's changes if in refine mode)
- Re-verify with judge
- **Iterate until PASS** - continue fix → verify cycle until quality threshold is met or max iterations reached
- If `MAX_ITERATIONS` reached (default 3):
  - Log warning: "Step [N] did not pass after {MAX_ITERATIONS} iterations"
  - Proceed to next step (do not block indefinitely)

**7. On PASS: Mark Step Complete**

- Update task file:
  - Mark step title with `[DONE]` (e.g., `### Step 2: Create Service [DONE]`)
  - Mark step's subtasks as `[X]` complete
- Update todo to `completed`
- Record judge scores in tracking

**8. Human-in-the-Loop Checkpoint (if applicable):**

**Only after step PASSES**, if step number is in `HUMAN_IN_THE_LOOP_STEPS` (or `HUMAN_IN_THE_LOOP_STEPS == "*"`):

```markdown
---
## 🔍 Human Review Checkpoint - Step [N]

**Step:** [Step Title]
**Judge Score:** [score]/[threshold for step type] threshold
// ... (10 lines trimmed)

> Continue? [Y/n/feedback]:
---
```

- If user provides feedback: Store for next step or re-implement current step with feedback
- If user says "n": Pause workflow, report current progress
- If user says "Y" or continues: Proceed to next step

---

## Pattern C: Multi-Item Step (Per-Item Evaluations)

For steps that create multiple similar items:

**1. Launch Developer Agents in Parallel (one per item):**

Use Task tool for EACH item (launch all in parallel):

- **Agent Type**: `sdd:developer`
- **Model**: As specified or `opus` by default
- **Description**: "Implement Step [N], Item: [Name]"
- **Prompt**:

```
Implement Step [N], Item: [Item Name]

Task File: $TASK_PATH
Step Number: [N]
Item: [Item Name]

Your task:
- Create ONLY [item_name] from Step [N]
- Do NOT create other items or steps
- Follow the Expected Output and Success Criteria exactly

When complete, report:
1. File path created
2. Confirmation of completion
3. Self-critique summary
```

**2. Wait for All Completions**

- Collect all agent reports
- Note all artifact paths
- **DO NOT read any of the created files yourself**

**3. Launch Evaluation Agents in Parallel (one per item)**

**⚠️ MANDATORY: Launch evaluation agents. Do NOT skip. Do NOT verify yourself.**

**Use `sdd:developer` agent type for evaluations**

For each item:

```
CLAUDE_PLUGIN_ROOT=${CLAUDE_PLUGIN_ROOT}

Read @${CLAUDE_PLUGIN_ROOT}/prompts/judge.md for evaluation methodology.

Evaluate artifact at: [item_path from implementation agent report]
// ... (12 lines trimmed)
You can verify the artifact works - run tests, check syntax, confirm dependencies.

Return: scores with evidence, overall score, PASS/FAIL, improvements if FAIL.
```

**4. Collect All Results**

**5. Report Aggregate:**

- Items passed: X/Y
- Items needing revision: [list with specific issues]

**6. Determine Threshold:**

- Check if step is marked as critical in task file (in `#### Verification` section or step metadata)
- If critical: use `THRESHOLD_FOR_CRITICAL_COMPONENTS`
- If standard: use `THRESHOLD_FOR_STANDARD_COMPONENTS`

**7. If Any FAIL: Iterate Until ALL PASS**

- Present failing items with judge feedback to implementation agent
- Re-implement only failing items with feedback incorporated (preserve user's changes if in refine mode)
- Re-verify failing items with judge
- **Iterate until ALL PASS** - continue fix → verify cycle until all items meet quality threshold or max iterations reached
- If `MAX_ITERATIONS` reached (default 3):
  - Log warning: "Step [N] has {X} items that did not pass after {MAX_ITERATIONS} iterations"
  - Proceed to next step (do not block indefinitely)

**8. On ALL PASS: Mark Step Complete**

- Update task file:
  - Mark step title with `[DONE]` (e.g., `### Step 3: Create Items [DONE]`)
  - Mark step's subtasks as `[X]` complete
- Update todo to `completed`
- Record pass rate in tracking

**9. Human-in-the-Loop Checkpoint (if applicable):**

**Only after ALL items PASS**, if step number is in `HUMAN_IN_THE_LOOP_STEPS` (or `HUMAN_IN_THE_LOOP_STEPS == "*"`):

```markdown
---
## 🔍 Human Review Checkpoint - Step [N]

**Step:** [Step Title]
**Items Passed:** X/Y
// ... (8 lines trimmed)

> Continue? [Y/n/feedback]:
---
```

- If user provides feedback: Store for next step or re-implement items with feedback
- If user says "n": Pause workflow, report current progress
- If user says "Y" or continues: Proceed to next step
