# Run-All Query Suite

Use run-all mode when the goal is breadth rather than noise reduction.

## Why a Custom Suite

Passing packs directly to `codeql database analyze` can silently apply each
pack’s default suite behavior. A custom run-all `.qls` file makes the execution
surface explicit and broader.

## What Run-All Means

Run-all mode is for:
- broad security and quality coverage
- exploratory audits
- validating what installed packs can actually surface

It is the opposite of important-only mode:
- broader query set
- no severity-based post-filter
- more noise, but fewer silent omissions

## When to Use It

Use run-all when:
- the codebase is small enough to review more output
- you want to compare pack behavior
- you suspect default suites are hiding relevant queries

Use important-only mode when the review surface must stay tighter.

## Operational Rule

Generate the suite from the installed packs and treat it as an explicit
“maximize coverage” mode. Expect more findings and more triage work.
