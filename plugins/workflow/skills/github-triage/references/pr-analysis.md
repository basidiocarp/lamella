# PR Analysis

Analyze an open GitHub pull request for scope, risk, and linked issues.

## Input

- Pull request URL or number
- PR title, description, commit messages
- Diff summary (file count, lines changed)
- Linked issues or related PRs

## Analysis Logic

1. Extract scope: files changed, components affected, feature or fix classification
2. Assess risk: size (lines changed), complexity (file count), cross-subsystem impact
3. Identify linked issues: `Fixes #123`, `Related to #456`, issue tags
4. Check status: draft, ready, blocked, approved
5. Return structured analysis with permalinks

## Output Schema

```json
{
  "pr_number": 123,
  "pr_permalink": "https://github.com/owner/repo/pull/123",
  "scope": {
    "classification": "feature|fix|refactor|test|docs|chore",
    "files_changed": 5,
    "components": ["api", "database"],
    "description": "Adds caching layer to reduce API latency"
  },
  "risk_assessment": {
    "size": "small|medium|large",
    "complexity": "low|medium|high",
    "cross_subsystem": true,
    "reasoning": "Modifies core request handling and cache layer"
  },
  "linked_issues": [
    {
      "issue_number": 42,
      "relationship": "fixes|related",
      "issue_permalink": "https://github.com/owner/repo/issues/42"
    }
  ],
  "status": "draft|ready|blocked|approved",
  "overall_assessment": "one-sentence summary of PR scope and risk"
}
```

## Evidence Rule

All `*_permalink` fields MUST link to the actual GitHub PR or linked issue. Citations:

- `pr_permalink` — the PR itself
- `issue_permalink` — the linked issue (use `gh pr view` or the PR description to find linked issues)

Do not use bare issue numbers — include full GitHub URLs.

## Example

```json
{
  "pr_number": 78,
  "pr_permalink": "https://github.com/example/repo/pull/78",
  "scope": {
    "classification": "feature",
    "files_changed": 3,
    "components": ["cache", "api"],
    "description": "Adds Redis caching for expensive API calls"
  },
  "risk_assessment": {
    "size": "medium",
    "complexity": "medium",
    "cross_subsystem": true,
    "reasoning": "Introduces new external dependency (Redis) and modifies request path"
  },
  "linked_issues": [
    {
      "issue_number": 42,
      "relationship": "fixes",
      "issue_permalink": "https://github.com/example/repo/issues/42"
    }
  ],
  "status": "ready",
  "overall_assessment": "Medium-risk feature adding caching infrastructure; fixes performance issue #42"
}
```
