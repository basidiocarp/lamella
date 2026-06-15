# Workflow Phases

Detailed execution phases for the audit process.

## Phase 1: Discovery

1. **Scan directories**:
   ```text
   .claude/agents/
   .claude/skills/
   .claude/commands/
   examples/agents/      (if exists)
   examples/skills/      (if exists)
   examples/commands/    (if exists)
   ```
2. **Classify files** by type: agent, skill, or command.
3. **Load reference templates** for comparative mode.

## Phase 2: Scoring Engine

Load scoring criteria from `scoring/criteria.yaml`:

```yaml
agents:
  max_points: 32
  categories:
    identity:
      weight: 3
      criteria:
        - id: A1.1
          name: "Clear name"
          points: 3
          detection: "frontmatter.name exists and is descriptive"
```

For each file:
1. Parse frontmatter.
2. Extract relevant sections.
3. Run detection patterns.
4. Calculate score: `(points / max_points) × 100`.
5. Assign grade.

## Phase 3: Comparative Analysis

For each project file:
1. Find the closest matching template.
2. Compare scores per criterion.
3. Identify gaps between template and project file.
4. Flag large gaps for review.

## Phase 4: Report Generation

**Markdown report**:
- summary table
- individual scores
- top issues
- prioritized recommendations

**JSON output**:
```json
{
  "metadata": {
    "project_path": "/path/to/project",
    "audit_date": "2026-02-07",
    "mode": "full"
  },
  "results": [
    {
      "file": ".claude/agents/debugging-specialist.md",
      "type": "agent",
      "score": 78,
      "grade": "C",
      "top_issues": [
        "Missing anti-hallucination measures",
        "Examples too sparse"
      ]
    }
  ]
}
```

## Phase 5: Fix Suggestions

For each failing criterion, generate an actionable fix:

```markdown
### File: .claude/agents/debugging-specialist.md
**Issue**: Missing anti-hallucination measures

**Fix**:
Add a source-verification section that requires evidence, citations, and explicit uncertainty handling.

**Detection**:
Grep for keywords such as `verify`, `source`, `evidence`, or `uncertain`.
```
