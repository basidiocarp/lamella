# Output Examples

Sample outputs from different audit modes.

## Quick Audit (Top-5 Criteria)

```markdown
# Quick Audit: Agents/Skills/Commands

**Files**: 15 (5 agents, 8 skills, 2 commands)
**Critical Issues**: 3 files fail top-5 criteria

// ... (10 lines trimmed)
1. **Add error handling**: 5 files
2. **Remove hardcoded paths**: 3 files
3. **Add usage examples**: 4 files
```

## Full Audit Report

```markdown
# Full Audit Report

**Generated**: 2026-02-07
**Mode**: Full
**Project**: /path/to/project
// ... (51 lines trimmed)
### Priority 3 (Nice to Have)
- [ ] Add integration documentation to 4 files
- [ ] Expand examples in 2 skills
```

## Comparative Audit Report

```markdown
# Comparative Audit Report

**Generated**: 2026-02-07
**Mode**: Comparative
**Project**: /path/to/project
// ... (23 lines trimmed)
  - Project: No skill references

**Suggested additions:**
```markdown
## Source Verification

- Always cite sources for technical claims
- Use phrases: "According to [documentation]..."
- If uncertain, state: "I don't have verified information on..."
```

## Recommendations

To match template quality:

// ... (8 lines trimmed)
3. **Integration documentation** (4 files): List compatible agents/skills
   - Impact: +1 pt per file
   - Effort: Low
```

## JSON Output Format

```json
{
  "metadata": {
    "project_path": "/path/to/project",
    "audit_date": "2026-02-07",
    "mode": "full",
// ... (69 lines trimmed)
    }
  ]
}
```
