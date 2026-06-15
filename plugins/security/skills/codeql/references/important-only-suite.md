# Important-Only Query Suite

Use this mode when you want a smaller, higher-signal CodeQL run across official
and third-party packs.

## Why a Custom Suite

Built-in pack defaults do not apply the same filtering across all packs. A
custom `.qls` file lets you:
- load official and third-party packs consistently
- keep security-focused queries
- suppress lower-value medium-precision results later in the pipeline

## Filtering Model

Think of important-only mode as two stages:

1. suite selection decides which queries run
2. post-analysis filtering decides which SARIF results are reported

The practical goal is:
- always keep high or very-high precision security findings
- keep medium-precision findings only when their security impact is meaningful

## When to Use It

Use important-only mode when:
- the full run is too noisy
- you need a review-friendly output set
- third-party packs are installed and you still want one consistent threshold

Do not use it when the goal is exhaustive exploration. Use the broader run-all
mode for that.

## Operational Rule

Generate the suite dynamically from the installed packs, then apply the
post-analysis SARIF filter. The suite alone is not the whole important-only
behavior.
