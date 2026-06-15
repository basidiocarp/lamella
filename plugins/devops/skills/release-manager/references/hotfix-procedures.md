# Hotfix Procedures

Use this reference when the release is driven by an active production issue.

## Hotfix Rules

- Scope the fix narrowly.
- Add the smallest regression test that proves the issue is fixed.
- Keep rollback steps ready before deployment.
- Document the customer impact and the follow-up work that will happen later.

## Severity Guide

- `P0`: Production down, data loss, or active security issue
- `P1`: Major user-facing breakage with no acceptable workaround
- `P2`: Important but non-critical issue that can wait for the next normal release

## Minimal Hotfix Flow

1. Create the hotfix branch from the production branch the repo actually uses.
2. Implement the smallest safe fix.
3. Run focused validation for the affected area.
4. Document the rollback path.
5. Merge, tag, and deploy using the repo's existing release workflow.
6. Follow up with a postmortem or root-cause writeup if the impact warrants it.
