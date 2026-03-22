# Error Handling

## Implementation Failure

If sdd:developer agent reports failure:

1. Present the failure details to user
2. Ask clarification questions that could help resolve
3. Launch sdd:developer agent again with clarifications

## Judge Disagreement

If judges disagree significantly (difference > 2.0):

1. Present both perspectives with evidence
2. Ask user to resolve: "Judges disagree. Your decision?"
3. Proceed based on user decision

## Refine Mode: No Changes Detected

If `--refine` mode finds no git changes in the project:

1. Report: "No project file changes detected since last commit."
2. Suggest: "Make edits to project files first, then run --refine again."
3. Alternatively: "Run without --refine to re-implement all steps."

## Refine Mode: Changes Don't Map to Steps

If `--refine` mode finds changed files but none map to implementation steps:

1. Report: "Changed files don't match any implementation step's expected outputs."
2. List the changed files detected
3. Suggest: "Verify manually or run without --refine to re-verify all steps."
