# Duplicate Detector

Find probable duplicates of a GitHub issue by searching existing issues and PRs for similar title, description, or reported symptoms.

## Input

- Issue URL or number
- Issue title and body
- (Optional) Repository context (for multi-repo searches)

## Detection Logic

1. Extract key terms from the issue title and body (problem keywords, error messages, component names)
2. Search existing issues/PRs with `gh issue list --search` or `gh api GET` for matches (read-only — never a write method)
3. Compare title, labels, and symptom similarity
4. Score each candidate (high confidence: identical error message or identical title; medium: overlapping keywords)
5. Return only candidates with medium or higher confidence

## Output Schema

```json
{
  "verdict": "has_duplicates|no_duplicates",
  "candidates": [
    {
      "issue_number": 42,
      "title": "Service crashes on startup",
      "similarity": "high|medium",
      "reasoning": "Same error message in issue body",
      "evidence_permalink": "https://github.com/owner/repo/issues/42"
    }
  ],
  "search_summary": "searched by error message and symptom keywords"
}
```

## Evidence Rule

Each duplicate candidate MUST include its GitHub issue/PR URL as `evidence_permalink`. Do not list candidates without a link to the source.

## Example

```json
{
  "verdict": "has_duplicates",
  "candidates": [
    {
      "issue_number": 15,
      "title": "Service crashes on startup",
      "similarity": "high",
      "reasoning": "Identical error message: 'failed to bind port 8080'",
      "evidence_permalink": "https://github.com/example/repo/issues/15"
    },
    {
      "issue_number": 28,
      "title": "Startup failure on Windows",
      "similarity": "medium",
      "reasoning": "Same component failure pattern",
      "evidence_permalink": "https://github.com/example/repo/issues/28"
    }
  ],
  "search_summary": "searched by error message and symptom keywords"
}
```
