# PR Review Workflow Examples and Helper Scripts

## Workflow Examples

### Example 1: Quick Single Comment

```bash
#!/bin/bash
OWNER="NeoLabHQ"
REPO="learning-platform-app"
PR=4

# Get latest commit
COMMIT=$(gh api repos/$OWNER/$REPO/pulls/$PR --jq '.head.sha')

# Add comment
gh api repos/$OWNER/$REPO/pulls/$PR/comments \
  -f body='Consider extracting this into a separate function for better testability' \
  -f commit_id="$COMMIT" \
  -f path='src/utils/validation.ts' \
  -F line=45 \
  -f side='RIGHT'
```

### Example 2: Comprehensive Review

```bash
#!/bin/bash
OWNER="NeoLabHQ"
REPO="learning-platform-app"
PR=4

// ... (24 lines trimmed)
  ]
}
EOF
```

### Example 3: Multi-line Comment

```bash
# Comment on a range of lines (e.g., lines 10-15)
gh api repos/$OWNER/$REPO/pulls/$PR/comments \
  -f body='This entire block could be simplified using array destructuring' \
  -f commit_id="$COMMIT" \
  -f path='src/utils/parser.ts' \
  -F start_line=10 \
  -f start_side='RIGHT' \
  -F line=15 \
  -f side='RIGHT'
```

## Helper Scripts

### Get PR Files and Lines

```bash
#!/bin/bash
# pr-files.sh - List all files changed in a PR with line counts

OWNER="$1"
REPO="$2"
PR="$3"

gh api repos/$OWNER/$REPO/pulls/$PR/files --jq '.[] | "\(.filename): +\(.additions)/-\(.deletions)"'
```

### Check Review Status

```bash
#!/bin/bash
# check-reviews.sh - Check review status for a PR

OWNER="$1"
REPO="$2"
PR="$3"

echo "=== Reviews ==="
gh api repos/$OWNER/$REPO/pulls/$PR/reviews --jq '.[] | "\(.user.login): \(.state) at \(.submitted_at)"'

echo -e "\n=== Pending Reviews ==="
gh api repos/$OWNER/$REPO/pulls/$PR/reviews --jq '.[] | select(.state=="PENDING") | "\(.user.login): \(.state)"'
```

## API Reference

### POST /repos/{owner}/{repo}/pulls/{pull_number}/comments

Creates a review comment on a specific line.

**Parameters:**

- `body` (string, required): Comment text
- `commit_id` (string, required): SHA of commit
- `path` (string, required): Relative file path
- `line` (integer, required): Line number in diff
- `side` (string, required): "LEFT" or "RIGHT"
- `start_line` (integer, optional): Start line for multi-line
- `start_side` (string, optional): Start side for multi-line

### POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews

Creates a review with optional line-specific comments.

**Parameters:**

- `event` (string, required): "APPROVE", "REQUEST_CHANGES", or "COMMENT"
- `body` (string, optional): Overall review comment
- `comments` (array, optional): Array of comment objects
- `commit_id` (string, optional): SHA of commit to review

**Comment Object:**

- `path` (string, required): Relative file path
- `body` (string, required): Comment text
- `line` (integer, required): Line number in diff
- `side` (string, required): "LEFT" or "RIGHT"
- `start_line` (integer, optional): Start line for multi-line
- `start_side` (string, optional): Start side for multi-line
