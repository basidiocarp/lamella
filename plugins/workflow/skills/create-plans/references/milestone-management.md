# Milestone Management

Milestones are the planning boundary between initial delivery and continued
brownfield evolution.

## Planning Modes

## Greenfield

Use when the project has no shipped code or historical roadmap.

- start with the initial brief
- number phases from `01`
- optimize for first delivery, not backward compatibility

## Brownfield Extension

Use when the same repo already shipped and you are adding more work.

- update the brief with current state
- extend phase numbering instead of restarting it
- reference existing code and regression expectations directly in plans

## Major Iteration

Use when the codebase stays the same, but the next milestone is large enough to
span many phases.

- keep the same planning history
- group phases under a new milestone heading
- treat it as a large brownfield evolution, not a fresh project

## Archive and Restart Only When

- the new work is in a different repo or codebase
- the product is unrelated
- the rewrite is so separate that the old planning context becomes misleading

## Rules

- shipped milestones belong in historical records, not hidden folders
- new plans should become brownfield-aware as soon as the first milestone ships
- milestone completion should update current-state context before more planning
