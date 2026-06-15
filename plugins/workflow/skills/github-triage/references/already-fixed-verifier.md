# Already-Fixed Verifier

Determine whether a reported GitHub issue has already been fixed in a released or development version.

## Input

- Issue URL or number
- Issue title, description, and symptoms
- (Optional) target version or branch

## Verification Logic

1. Extract the reported bug symptoms and affected component
2. Search closed issues, merged PRs, and recent commits for fixes
3. If a fix is found, verify the commit date, merge status, and whether it is in a released version
4. Return a verdict: ALREADY_FIXED (with commit), PARTIALLY_FIXED, or NOT_FIXED

## Output Schema

```json
{
  "verdict": "ALREADY_FIXED|PARTIALLY_FIXED|NOT_FIXED",
  "fix_commit": "abc1234",
  "fix_commit_permalink": "https://github.com/owner/repo/commit/abc1234",
  "fix_date": "2026-05-15",
  "merged_pr": "#123",
  "merged_pr_permalink": "https://github.com/owner/repo/pull/123",
  "released_version": "v1.2.3",
  "reasoning": "one-line explanation of verdict"
}
```

## Evidence Rule (CRITICAL)

When the verdict is ALREADY_FIXED, the `fix_commit_permalink` MUST link directly to the fixing commit on GitHub. This is the load-bearing evidence:

- Do NOT return a bare commit hash without the permalink
- Do NOT cite an issue number instead of the fix commit
- Do NOT assume a fix exists without verifying the actual merged PR and commit
- DO verify the commit is merged to `main` or a released version

When the verdict is `PARTIALLY_FIXED`, the same requirement applies to the resolved portion: populate `fix_commit_permalink` with the fixing commit's permalink and state in `reasoning` what remains unfixed. Only `NOT_FIXED` may leave the permalink fields `null`.

## Example

```json
{
  "verdict": "ALREADY_FIXED",
  "fix_commit": "caf1234d7e",
  "fix_commit_permalink": "https://github.com/example/repo/commit/caf1234d7e",
  "fix_date": "2026-05-20",
  "merged_pr": "#156",
  "merged_pr_permalink": "https://github.com/example/repo/pull/156",
  "released_version": "v2.1.0",
  "reasoning": "Bug fixed by PR #156 merged 2026-05-20, released in v2.1.0"
}
```

### NOT_FIXED Example

```json
{
  "verdict": "NOT_FIXED",
  "fix_commit": null,
  "fix_commit_permalink": null,
  "reasoning": "No merged fix found in main or released versions"
}
```
