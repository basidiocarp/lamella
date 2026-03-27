# Usage Examples

## Basic Usage

```bash
# Implement a specific task
/implement add-validation.feature.md

# Auto-select a task when only one active task exists
/implement

# Resume a partially completed task
/implement add-validation.feature.md --continue

# Verify after manual user edits
/implement add-validation.feature.md --refine

# Tighten the judge threshold
/implement critical-api.feature.md --target-quality 4.5

# Require explicit user checkpoints
/implement add-validation.feature.md --human-in-the-loop

# Combined: resume with user checkpoints
/implement add-validation.feature.md --continue --human-in-the-loop
```

---

## Example 1: Implementing a Feature

```
User: /implement add-validation.feature.md

Phase 0: Task Selection...
Found task in: .specs/tasks/todo/add-validation.feature.md
Moving to in-progress: .specs/tasks/in-progress/add-validation.feature.md

Phase 1: Context Build...
- Loaded the task spec and Definition of Done
- Reviewed existing validation utilities
- Confirmed 4 required outcomes

Phase 2: Implementation...
- Added request validator
- Added service-level schema checks
- Updated API error responses

Phase 3: Verification...
- Tests: PASS
- Lint: PASS
- Judge panel: 4.2 / 5.0 PASS

- All passed first try
- Definition of Done: 4/4 PASS
- Task location: .specs/tasks/done/add-validation.feature.md ✅
```

---

## Example 2: Handling DoD Item Failure

```
[All steps complete...]

Phase 3: Final Verification...
Launching DoD verification agent...
  Agent: "Verify all Definition of Done items..."

Verification Results:
- DoD 1: PASS
- DoD 2: FAIL - ESLint errors in validation service
- DoD 3: PASS
- DoD 4: PASS

Refinement pass:
- Fixed lint errors
- Re-ran lint and tests

- All DoD items now PASS
- 1 issue fixed (ESLint errors)
- Task location: .specs/tasks/done/ ✅
```

---

## Example 3: Handling Verification Failure

```
Step 3 Implementation complete.
Launching judge agents...

Judge 1: 3.5/5.0 - FAIL (threshold 4.0)
Judge 2: 3.2/5.0 - FAIL

Feedback:
- Missing negative-path tests
- Error handling inconsistent with the service contract

Revision:
- Added failure-path coverage
- Normalized error mapping

Judge 1: 4.2/5.0 - PASS
Judge 2: 4.4/5.0 - PASS
Panel Result: 4.3/5.0 ✅
Status: ✅ COMPLETE (Judge Confirmed)
```

---

## Example 4: Continue from Interruption

```
User: /implement add-validation.feature.md --continue

Phase 0: Parsing flags...
Configuration:
- Continue Mode: true
- Target task: add-validation.feature.md

Resume state:
- Step 1 complete
- Step 2 complete
- Last checkpoint: before verification

Step 3: Launching sdd:developer agent...
[continues normally from Step 4]
```

---

## Example 5: Refine After User Fixes

```
# User manually fixed src/validation/validation.service.ts
# (This file was created in Step 2: Create ValidationService)

User: /implement add-validation.feature.md --refine

Refine mode:
- Preserve user's manual changes
- Re-read touched files
- Re-run remaining checks only

Pending work:
- Re-verify error paths
- Re-run judge panel

[continues verifying remaining steps...]

All steps verified with user's changes incorporated ✅
```

---

## Example 6: Human-in-the-Loop Review

```
User: /implement add-validation.feature.md --human-in-the-loop

Configuration:
- Human Checkpoints: All steps

Checkpoint after Step 1:
- Summary shared with user
- Awaiting approval to continue

User feedback:
- "Keep validation rules framework-agnostic"

Checkpoint after Step 2:
- Implementation diff reviewed
- User requested clearer error messages

Incorporating feedback: "error messages could be more descriptive"
Re-launching sdd:developer agent with feedback...
[iteration continues]
```

---

## Example 7: Strict Quality Threshold

```
User: /implement critical-api.feature.md --target-quality 4.5

Configuration:
- Target Quality: 4.5/5.0

Judge Round 1:
- Correctness: 4.3
- Test depth: 4.6
- Operational readiness: 4.4

Revision:
- Added rollback notes
- Tightened timeout handling

Panel Result: 4.55/5.0 ✅

Status: ✅ COMPLETE (passed on iteration 2)
```
