# Codex CLI Invocation

## Default Configuration

- Model: `gpt-5.3-codex`
- Reasoning effort: `xhigh`

## Approach

Use `codex exec` in headless mode with a structured prompt and `-o` (`--output-last-message`) so the command writes only the final review result. This avoids the verbose `thinking` and execution stream that is noisy to parse.

## Review Prompt

Use a review prompt that:
- focuses on correctness, performance, security, maintainability, and developer experience
- flags only actionable issues introduced by the change
- requires precise file and line citations
- ends with an overall correctness verdict and confidence score

## Prompt Assembly

Create temporary files for the prompt and output:

```bash
prompt_file="$(mktemp)"
output_file="$(mktemp)"
stderr_log="$(mktemp)"
```

Write the prompt with these sections in order:

```text
<review prompt>

<optional project conventions from CLAUDE.md or AGENTS.md>

<optional focus instructions>

Diff to review:
---
<git diff output>
---
```

### Generating the diff

| Scope | Command |
|-------|---------|
| Uncommitted tracked files | `git diff HEAD` |
| Uncommitted untracked files | `git diff --no-index /dev/null <file>` per file |
| Branch diff | `git diff <branch>...HEAD` |
| Specific commit | `git diff <sha>~1..<sha>` |

For full uncommitted review, include both tracked and untracked files.

## Base Command

```bash
codex exec \
  -c model='"gpt-5.3-codex"' \
  -c model_reasoning_effort='"xhigh"' \
  --sandbox read-only \
  --ephemeral \
  --output-schema {baseDir}/references/codex-review-schema.json \
  -o "$output_file" \
  - < "$prompt_file" \
  > /dev/null 2>"$stderr_log"
```

Then read `$output_file`. If it is empty or missing, inspect `$stderr_log`.

## Output Format

The output should match `codex-review-schema.json`:

```json
{
  "findings": [
    {
      "title": "Short description",
      "body": "Detailed explanation",
      "priority": 3,
      "file": "src/example.ts",
      "line_start": 10,
      "line_end": 18,
      "confidence_score": 0.92
    }
  ],
  "overall_correctness": "patch is incorrect",
  "overall_explanation": "Summary of the review",
  "overall_confidence_score": 0.9
}
```

Priority levels: `0` informational, `1` low, `2` medium, `3` high.

### Presenting Results

- group findings by priority, highest first
- show title with file and line reference
- include the body explanation
- include confidence as a percentage
- end with the overall verdict and confidence

## Model Fallback

If `gpt-5.3-codex` fails with an auth or account-support error, retry with `gpt-5.2-codex` and log the fallback.

## Error Handling

| Error | Action |
|-------|--------|
| `codex: command not found` | Tell the user to install Codex CLI |
| Model auth error | Retry with `gpt-5.2-codex` |
| Timeout | Suggest narrowing the diff scope |
| `EPERM` or sandbox noise | Treat as expected unless review output is missing |
| Empty or missing output file | Read `$stderr_log` |
