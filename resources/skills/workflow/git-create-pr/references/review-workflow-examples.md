# PR Review Workflow Examples and Helper Scripts

Use these examples when you need one-off `gh api` review helpers.

## Quick Single Comment

```bash
gh api repos/$OWNER/$REPO/pulls/$PR/comments \
  -f body='Consider extracting this for testability' \
  -f commit_id="$COMMIT" \
  -f path='src/utils/validation.ts' \
  -F line=45 \
  -f side='RIGHT'
```

## Multi-Line Comment

```bash
gh api repos/$OWNER/$REPO/pulls/$PR/comments \
  -f body='This whole block can be simplified' \
  -f commit_id="$COMMIT" \
  -f path='src/utils/parser.ts' \
  -F start_line=10 \
  -f start_side='RIGHT' \
  -F line=15 \
  -f side='RIGHT'
```

## Helper Script Rule

Keep review helpers parameterized by owner, repo, PR, commit, and path so they can be reused instead of rewritten.
