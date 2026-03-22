# Usage Examples

## Basic Usage

```bash
# Implement a specific task
/implement add-validation.feature.md

# Auto-select task from todo/ or in-progress/ (if only 1 task)
/implement
// ... (27 lines trimmed)

# Combined: continue with human review
/implement add-validation.feature.md --continue --human-in-the-loop
```

---

## Example 1: Implementing a Feature

```
User: /implement add-validation.feature.md

Phase 0: Task Selection...
Found task in: .specs/tasks/todo/add-validation.feature.md
Moving to in-progress: .specs/tasks/in-progress/add-validation.feature.md
// ... (43 lines trimmed)
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
// ... (22 lines trimmed)
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
// ... (19 lines trimmed)
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
// ... (12 lines trimmed)

Step 3: Launching sdd:developer agent...
[continues normally from Step 4]
```

---

## Example 5: Refine After User Fixes

```
# User manually fixed src/validation/validation.service.ts
# (This file was created in Step 2: Create ValidationService)

User: /implement add-validation.feature.md --refine

// ... (26 lines trimmed)
[continues verifying remaining steps...]

All steps verified with user's changes incorporated ✅
```

---

## Example 6: Human-in-the-Loop Review

```
User: /implement add-validation.feature.md --human-in-the-loop

Configuration:
- Human Checkpoints: All steps

// ... (47 lines trimmed)
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

// ... (20 lines trimmed)
Panel Result: 4.55/5.0 ✅

Status: ✅ COMPLETE (passed on iteration 2)
```
