# Adding Multiple Line-Specific Comments Together

Use the PR reviews endpoint when you want multiple line comments to arrive as one review.

## Why

- One review record instead of many separate comments
- One notification instead of a burst
- Easier to approve, comment, or request changes atomically

## Shape

```bash
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls/{pr}/reviews --input -
{
  "event": "COMMENT",
  "body": "Overall review summary",
  "comments": [
    {
      "path": "src/file.ts",
      "line": 42,
      "side": "RIGHT",
      "body": "Specific feedback"
    }
  ]
}
EOF
```

## Event Types

- `COMMENT`
- `APPROVE`
- `REQUEST_CHANGES`
