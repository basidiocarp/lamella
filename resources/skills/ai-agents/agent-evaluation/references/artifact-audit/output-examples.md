# Output Examples

Sample outputs from different audit modes.

## Quick Audit

```markdown
# Quick Audit: Agents / Skills / Commands

**Files scanned**: 15
**Critical issues**: 3
**Warnings**: 6

## Top Findings

1. `resources/subagents/code-quality/code-reviewer/SUBAGENT.md`
   - Missing explicit output format
   - No boundary section for when not to use the agent
2. `resources/skills/test-writing/SKILL.md`
   - Example paths are stale
   - Validation section does not match repo tooling
3. `resources/commands/review.md`
   - Prompt asks for praise before findings

## Highest-Value Fixes

1. Add error handling guidance to 5 files
2. Remove hardcoded paths from 3 files
3. Add usage examples to 4 files
```

## Full Audit Report

```markdown
# Full Audit Report

**Generated**: 2026-02-07
**Mode**: Full
**Project**: /path/to/project

## Summary

- Agents reviewed: 5
- Skills reviewed: 8
- Commands reviewed: 2
- Files needing changes: 7

## Priority 1

- [ ] Fix stale file references in 3 resources
- [ ] Add missing boundaries to 2 agents

## Priority 2

- [ ] Normalize output format sections in 4 files
- [ ] Replace promotional language in 2 descriptions

## Priority 3

- [ ] Add integration documentation to 4 files
- [ ] Expand examples in 2 skills
```

## JSON Output Shape

```json
{
  "metadata": {
    "project_path": "/path/to/project",
    "audit_date": "2026-02-07",
    "mode": "full"
  },
  "summary": {
    "files_scanned": 15,
    "files_needing_changes": 7,
    "critical_issues": 3,
    "warnings": 6
  },
  "findings": [
    {
      "path": "resources/subagents/code-quality/code-reviewer/SUBAGENT.md",
      "severity": "high",
      "issue": "Missing output format",
      "recommendation": "Add a short required response structure section"
    }
  ]
}
```
