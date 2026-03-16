# GitHub Automation Scripts

Scripts for GitHub issue management and automation.

## Scripts

| Script | Description |
|--------|-------------|
| `gh.sh` | GitHub CLI wrapper utilities |
| `edit-issue-labels.sh` | Batch edit issue labels |
| `comment-on-duplicates.sh` | Add comments to duplicate issues |
| `auto-close-duplicates.ts` | Automatically close duplicate issues |
| `issue-lifecycle.ts` | Manage issue lifecycle states |
| `lifecycle-comment.ts` | Add lifecycle comments to issues |
| `sweep.ts` | Clean up stale issues |
| `backfill-duplicate-comments.ts` | Backfill comments on existing duplicates |

## Dependencies

- GitHub CLI (`gh`)
- Node.js/TypeScript (for `.ts` scripts)

## Usage

```bash
# Run TypeScript scripts with tsx or ts-node
npx tsx scripts/github/auto-close-duplicates.ts
npx tsx scripts/github/sweep.ts
```
