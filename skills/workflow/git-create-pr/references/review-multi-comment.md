# Adding Multiple Line-Specific Comments Together

To add multiple comments across different files in a single review, use the `/reviews` endpoint with JSON input.

## Why Use Reviews for Multiple Comments?

- **Atomic operation** - All comments are added together
- **Single notification** - Doesn't spam with multiple notifications
- **Better UX** - Appears as one cohesive review
- **Same mechanism as GitHub UI** - "Start a review" → "Finish review"

## Basic Syntax

```bash
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews --input -
{
  "event": "COMMENT",
  "body": "Overall review summary (optional)",
  "comments": [
// ... (12 lines trimmed)
  ]
}
EOF
```

## Review Event Types

| Event | Description | When to Use |
|-------|-------------|-------------|
| `COMMENT` | General review comment | Just leaving feedback without approval |
| `APPROVE` | Approve the PR | Changes look good, ready to merge |
| `REQUEST_CHANGES` | Request changes | Issues that must be fixed before merge |

## Complete Example

```bash
cat <<'EOF' | gh api repos/NeoLabHQ/learning-platform-app/pulls/4/reviews --input -
{
  "event": "COMMENT",
  "body": "Testing multiple line-specific comments via gh api",
  "comments": [
// ... (18 lines trimmed)
  ]
}
EOF
```

## Response

```json
{
  "id": 3470546747,
  "state": "COMMENTED",
  "html_url": "https://github.com/NeoLabHQ/learning-platform-app/pull/4#pullrequestreview-3470546747",
  "submitted_at": "2025-11-16T22:42:43Z",
  "commit_id": "e152d0dd6cf498467eadbeb638bf05abe11c64d4"
}
```
