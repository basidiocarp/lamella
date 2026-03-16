---
name: git-create-pr
description: Create pull requests using GitHub CLI with proper templates and formatting. Use when ready to submit changes for review, preparing code for merge, or creating PRs programmatically.
---

## Contents

- [Prerequisites](#prerequisites)
- [Pre-flight Checks](#pre-flight-checks)
- [Creating a New Pull Request](#creating-a-new-pull-request)
- [Best Practices](#best-practices)
- [Additional GitHub CLI PR Commands](#additional-github-cli-pr-commands)
- [Using Templates for PR Creation](#using-templates-for-pr-creation)
- [Related Documentation](#related-documentation)

---
name: git-create-pr
description: Create pull requests using GitHub CLI with proper templates and formatting. Use when ready to submit changes for review, preparing code for merge, or creating PRs programmatically.
---# How to Create a Pull Request Using GitHub CLI

This guide explains how to create pull requests using GitHub CLI in our project.

**Important**: All PR titles and descriptions should be written in English.

## Prerequisites

Check if `gh` is installed, if not follow this instruction to install it:

1. Install GitHub CLI if you haven't already:

   ```bash
   # macOS
   brew install gh

   # Windows
   winget install --id GitHub.cli

   # Linux
   # Follow instructions at https://github.com/cli/cli/blob/trunk/docs/install_linux.md
   ```

2. Authenticate with GitHub:
   ```bash
   gh auth login
   ```

## Pre-flight Checks

Before creating a PR, check for uncommitted changes:

1. Run `git status` to check for uncommitted changes (staged, unstaged, or untracked files)
2. If uncommitted changes exist, use the Skill tool to run the `git:commit` command first:
   ```
   Skill: git:commit
   ```
3. This ensures all your work is committed before creating the PR

## Creating a New Pull Request

1. First, prepare your PR description following your project's `.github/pull_request_template.md` template (if one exists)

2. Use the `gh pr create --draft` command to create a new pull request:

   ```bash
   # Basic command structure
   gh pr create --draft --title "✨(scope): Your descriptive title" --body "Your PR description" --base main
   ```

   For more complex PR descriptions with proper formatting, use the `--body-file` option with the exact PR template structure:

   ```bash
   # Create PR with proper template structure
   gh pr create --draft --title "✨(scope): Your descriptive title" --body-file .github/pull_request_template.md --base main
   ```

## Best Practices

1. **Language**: Always use English for PR titles and descriptions

2. **PR Title Format**: Use conventional commit format with emojis

   - Always include an appropriate emoji at the beginning of the title
   - Use the actual emoji character (not the code representation like `:sparkles:`)
   - Examples:
     - `✨(supabase): Add staging remote configuration`
     - `🐛(auth): Fix login redirect issue`
     - `📝(readme): Update installation instructions`

3. **Description Template**: Always use your project's PR template structure (`.github/pull_request_template.md`):

4. **Template Accuracy**: Ensure your PR description precisely follows the template structure:

   - Don't modify or rename the PR-Agent sections (`pr_agent:summary` and `pr_agent:walkthrough`)
   - Keep all section headers exactly as they appear in the template
   - Don't add custom sections that aren't in the template

5. **Draft PRs**: Start as draft when the work is in progress
   - Use `--draft` flag in the command
   - Convert to ready for review when complete using `gh pr ready`

### Common Mistakes to Avoid

1. **Using Non-English Text**: All PR content must be in English
2. **Incorrect Section Headers**: Always use the exact section headers from the template
3. **Adding Custom Sections**: Stick to the sections defined in the template
4. **Using Outdated Templates**: Always refer to the current `.github/pull_request_template.md` file in your project

### Missing Sections

Always include all template sections, even if some are marked as "N/A" or "None"

## Additional GitHub CLI PR Commands

Here are some additional useful GitHub CLI commands for managing PRs:

```bash
# List your open pull requests
gh pr list --author "@me"

# Check PR status
gh pr status
// ... (12 lines trimmed)

# Merge a PR
gh pr merge <PR-NUMBER> --squash
```

## Using Templates for PR Creation

To simplify PR creation with consistent descriptions, create a template file:

1. Create a file named `pr-template.md` with your PR template
2. Use it when creating PRs:

```bash
gh pr create --draft --title "feat(scope): Your title" --body-file pr-template.md --base main
```


## Attaching Reviews to PRs

Use `gh` CLI to add review comments programmatically:

```bash
# Approve a PR
gh pr review <number> --approve

# Request changes
gh pr review <number> --request-changes --body "Please fix..."
// ... (11 lines trimmed)
  -f "comments[][path]=src/file.ts" \
  -f "comments[][line]=42" \
  -f "comments[][body]=Suggestion: consider using const here"
```

See [references/review-multi-comment.md](references/review-multi-comment.md),
[references/review-troubleshooting.md](references/review-troubleshooting.md), and
[references/review-workflow-examples.md](references/review-workflow-examples.md) for details.

## Related Documentation

- PR Template: Use your project's `.github/pull_request_template.md`
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI documentation](https://cli.github.com/manual/)
