# Command Composition

Use composition when several simple commands are easier to maintain than one oversized command.

## Sequential Workflow

```markdown
---
description: Complete PR review workflow
argument-hint: [pr-number]
allowed-tools: Bash(gh:*), Read, Grep
---

# Review Pull Request

1. Load PR metadata
2. Show diff summary
3. Ask whether to:
   - draft review comments
   - prepare merge readiness notes
   - leave comments only
```

Why it works:
- each stage is visible
- decision points are explicit
- the command can stop safely between steps

## Composition Command

```markdown
---
description: Prepare code review package
---

Run in order:
1. /format-code
2. /lint-code
3. /test-all
4. summarize results
```

Use a composition command when:
- the subcommands are already useful on their own
- the orchestrator mainly sequences and summarizes

## Pipeline Pattern

```markdown
---
description: Analyze test failures
---

1. collect failing tests
2. cluster by root cause
3. offer next actions:
   - fix highest priority failure
   - draft fix plans
   - create issues
```

Pipeline commands work best when each stage transforms the previous output into a narrower, more actionable artifact.

## Parallel Validation Pattern

```markdown
---
description: Run comprehensive validation
allowed-tools: Bash(*), Read
---

Run:
- lint
- tests
- build
- security scan

Then collate the results into one summary.
```

Use this when checks are independent and the user wants one verdict, not four separate command runs.
