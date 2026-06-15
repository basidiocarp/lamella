# Command Arguments Reference

Use this reference to understand the main execution switches for the verified
implementer workflow.

## Core Arguments

| Argument | Purpose |
|---|---|
| `task-file` | choose the task file explicitly or allow auto-detection |
| `--continue` | resume from the last incomplete verified step |
| `--refine` | re-verify from the earliest affected step after user edits |
| `--human-in-the-loop` | pause at selected steps for manual review |
| `--target-quality` | set the minimum acceptable judge score |
| `--max-iterations` | cap fix-and-verify retries |
| `--skip-judges` | bypass judge gates entirely |

## `--continue`

Resume mode should:
- inspect the task file for completed steps
- verify the last incomplete step before moving forward
- recover state from existing artifacts when possible

If the last incomplete step fails verification, re-implement it before
continuing.

## `--refine`

Refine mode is for user-modified project files, not task-file edits.

Basic flow:
1. detect changed project files
2. map those files back to the earliest affected step
3. re-verify from that step onward
4. preserve valid user changes and build on them

The key rule is dependency safety: later steps may need re-verification even if
the user only touched one earlier file.

## Human-in-the-Loop

Use manual checkpoints when:
- a step is risky
- generated artifacts need a human acceptance check
- you want a pause before continuing a long chain

If no step list is supplied, treat it as “pause after every step.”

## Quality Thresholds

Use `--target-quality` to define what “good enough” means before the workflow
advances. Higher thresholds are appropriate for critical or externally visible
work.

## Iteration Limits

Use `--max-iterations` to prevent endless fix-and-judge loops. Unlimited retries
should be rare and deliberate.

## Operational Rule

These arguments exist to control workflow safety:
- `--continue` restores state
- `--refine` protects user edits
- human checkpoints gate risky steps
- judge controls keep quality explicit

If a run needs many flags to be understandable, the task breakdown probably
needs work.
