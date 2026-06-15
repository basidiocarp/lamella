---
name: git-create-pr
description: "Creates pull requests with GitHub CLI using proper templates and formatting."
origin: lamella
---

# How to Create a Pull Request Using GitHub CLI

Use this skill when preparing a pull request with `gh`.

## Core Workflow

1. confirm the work is committed and the branch is ready
2. inspect the repository PR template, if present
3. create the PR as draft unless it is genuinely review-ready
4. keep title and body in English and aligned with repo conventions
5. use the review references for comment-heavy workflows

## Quick Commands

```shell
gh pr create --draft --title "feat(scope): short title" --body-file .github/pull_request_template.md --base main
gh pr status
gh pr ready <number>
```

```powershell
gh pr create --draft --title "feat(scope): short title" --body-file .github/pull_request_template.md --base main
gh pr status
gh pr ready <number>
```

## Guardrails

- check `git status` first
- use the current project template exactly
- avoid custom sections unless the repo explicitly uses them
- keep PR descriptions in English

## References

- [references/review-multi-comment.md](references/review-multi-comment.md)
- [references/review-troubleshooting.md](references/review-troubleshooting.md)
- [references/review-workflow-examples.md](references/review-workflow-examples.md)
