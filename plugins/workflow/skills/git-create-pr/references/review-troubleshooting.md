# PR Review Comments - Troubleshooting and Best Practices

## Common Issues and Solutions

### Issue 1: "user_id can only have one pending review per pull request"

**Error Message:**

```
gh: Validation Failed (HTTP 422)
{"message":"Validation Failed","errors":[{"resource":"PullRequestReview","code":"custom","field":"user_id","message":"user_id can only have one pending review per pull request"}]}
```

**Cause:** GitHub only allows one pending (unsubmitted) review per user per PR.

**Solution 1: Submit the pending review**

```bash
# Check for pending reviews
gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews | jq '.[] | select(.state=="PENDING")'

# Submit it through the UI or ask the user to submit it
```

**Solution 2: Use the single comment endpoint instead**

```bash
# Add individual comments without creating a review
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments \
  -f body='Comment text' \
  -f commit_id='<sha>' \
  -f path='file.tsx' \
  -F line=26 \
  -f side='RIGHT'
```

### Issue 2: Array syntax not working with --raw-field

**Failed Attempt:**

```bash
# This does NOT work - GitHub API receives an object, not an array
gh api repos/{owner}/{repo}/pulls/{pr}/reviews \
  --raw-field 'comments[0][path]=file1.tsx' \
  --raw-field 'comments[0][line]=15'
```

**Error:**

```
Invalid request. For 'properties/comments', {"0" => {...}, "1" => {...}} is not an array.
```

**Solution:** Use JSON input via heredoc:

```bash
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls/{pr}/reviews --input -
{
  "comments": [...]
}
EOF
```

### Issue 3: Invalid line number

**Error Message:**

```
Pull request review thread line must be part of the diff
```

**Cause:** The line number doesn't exist in the diff for this file.

**Solutions:**

- Verify the file was actually changed in this PR
- Check the "Files changed" tab to see actual line numbers in the diff
- Ensure you're using the correct `commit_id` (the latest commit in the PR)

### Issue 4: Wrong commit_id

**Error Message:**

```
commit_sha is not part of the pull request
```

**Solution:** Get the latest commit SHA:

```bash
gh api repos/{owner}/{repo}/pulls/{pr_number} --jq '.head.sha'
```

## Best Practices

### 1. Get PR Information First

```bash
# Get PR details
gh pr view {pr_number} --json headRefOid,files

# Or use the API
gh api repos/{owner}/{repo}/pulls/{pr_number} --jq '{commit: .head.sha, files: [.changed_files]}'

# List files changed
gh api repos/{owner}/{repo}/pulls/{pr_number}/files --jq '.[] | {filename: .filename, additions: .additions, deletions: .deletions}'
```

### 2. Check for Pending Reviews

```bash
# Check if you have a pending review
gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews \
  --jq '.[] | select(.state=="PENDING" and .user.login=="YOUR_USERNAME")'
```

### 3. Use Meaningful Comment Text

- Be specific and constructive
- Reference documentation or best practices
- Suggest alternatives when requesting changes

### 4. Batch Related Comments

Use the review endpoint to group related comments:

- All comments for a single file/area
- All comments for a specific concern (security, performance, etc.)
- Complete review session

### 5. Choose the Right Event Type

```bash
# For feedback during development
"event": "COMMENT"

# When approving
"event": "APPROVE"

# When blocking merge
"event": "REQUEST_CHANGES"
```
