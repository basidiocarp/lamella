# Design Patterns Output Formats

Use output formats that match the mode of analysis.

## Detection Mode

- structured JSON
- easy to diff or post-process
- includes scope, findings, and summary counts

## Suggestion Mode

- short markdown report
- top recommendations first
- concrete file references and expected impact

## Evaluation Mode

- machine-readable scores
- one record per pattern candidate
- include the reason a pattern fits or does not fit
