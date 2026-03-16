# CI/CD Integration

Integration patterns for audit automation.

## Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run quick audit on changed agent/skill/command files
changed_files=$(git diff --cached --name-only | grep -E "^\.claude/(agents|skills|commands)/")
// ... (15 lines trimmed)

    echo "✅ Audit passed: Score $score%"
fi
```

## GitHub Actions

```yaml
name: Audit Agents/Skills
on:
  pull_request:
    paths:
      - '.claude/agents/**'
// ... (59 lines trimmed)
              repo: context.repo.repo,
              body: body
            });
```

## GitLab CI

```yaml
audit:
  stage: lint
  image: node:20
  script:
    - npm install -g @anthropic/claude-code-cli
// ... (14 lines trimmed)
      - .claude/agents/**/*
      - .claude/skills/**/*
      - .claude/commands/**/*
```

## Scheduled Quality Tracking

```yaml
# GitHub Actions: Weekly quality report
name: Weekly Quality Report
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9am
// ... (20 lines trimmed)
        run: |
          # Compare with previous weeks
          python scripts/generate-trend-report.py
```

## Local Development Workflow

```bash
# Quick check before commit
claude-code audit --mode=quick

# Full audit before PR
claude-code audit --mode=full

# Compare against templates
claude-code audit --mode=comparative

# Output JSON for scripting
claude-code audit --format=json > report.json
jq '.summary' report.json
```
