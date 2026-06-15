# Label Suggester

Suggest GitHub labels for an issue based on its content. **Read-only — the skill never applies labels.**

## Input

- Issue URL or number
- Issue title, description, and classification
- (Optional) list of available labels in the repository

## Suggestion Logic

1. Extract signals from issue content: type (bug/feature), component, severity, status
2. Map signals to repository labels: `type/bug`, `severity/high`, `area/api`, `status/triage`
3. Return only suggestions with high confidence (found explicit match or strong contextual signal)
4. Do NOT apply labels — return suggestions only

## Output Schema

```json
{
  "suggested_labels": [
    {
      "label": "type/bug",
      "confidence": "high|medium",
      "reasoning": "Issue reports broken behavior",
      "evidence_permalink": "https://github.com/owner/repo/issues/NUMBER"
    }
  ],
  "recommendation": "one-sentence summary of suggested labels"
}
```

## Evidence Rule

Each suggested label MUST cite the GitHub issue (or specific comment) where the signal came from. The `evidence_permalink` should point to the issue URL. If the label suggestion is based on a specific detail, you may cite that detail's location.

**Zero-mutation rule:** This template suggests labels. It DOES NOT apply them. The skill is read-only.

## Example

```json
{
  "suggested_labels": [
    {
      "label": "type/bug",
      "confidence": "high",
      "reasoning": "Reports 'service crashes on startup' — clear bug report",
      "evidence_permalink": "https://github.com/example/repo/issues/42"
    },
    {
      "label": "severity/high",
      "confidence": "high",
      "reasoning": "Affects all users; blocker for core functionality",
      "evidence_permalink": "https://github.com/example/repo/issues/42"
    },
    {
      "label": "area/auth",
      "confidence": "medium",
      "reasoning": "Issue mentions authentication service startup",
      "evidence_permalink": "https://github.com/example/repo/issues/42"
    }
  ],
  "recommendation": "Suggested labels: type/bug, severity/high, area/auth (suggestions only — not applied)"
}
```
