# Quality Assessment

Use this reference after a CodeQL database build succeeds. A successful build is
not automatically a good database.

## What to Check

Focus on:
- baseline lines of code
- project-relative source coverage
- extractor error rate
- finalized database status
- presence of the expected source directories

For compiled languages, total archive file count can be misleading because system
headers and SDK material may be bundled too.

## Good vs Poor Signals

Good signs:
- baseline LoC is non-zero and plausible
- project files are present at roughly expected scale
- extractor errors are low
- the database is finalized

Poor signs:
- empty or tiny baseline
- missing project sources
- many extractor failures
- build succeeded but clearly traced the wrong thing

## Improvement Order

If quality is poor, try:
1. correcting the source root
2. forcing a real rebuild if the build was cached
3. installing missing dependencies or stubs
4. adjusting extractor options only when the language actually needs it

## Rule

Do not trust a database just because `database create` returned success. Check
coverage and extraction quality before running expensive analysis.
