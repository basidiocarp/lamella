# Workflow Phases

Detailed execution phases for the audit process.

## Phase 1: Discovery

1. **Scan directories**:
   ```
   .claude/agents/
   .claude/skills/
   .claude/commands/
   examples/agents/      (if exists)
   examples/skills/      (if exists)
   examples/commands/    (if exists)
   ```

2. **Classify files** by type (agent/skill/command)

3. **Load reference templates** (for Comparative mode):
   ```
   guide/examples/agents/     (benchmark files)
   guide/examples/skills/     (benchmark files)
   guide/examples/commands/   (benchmark files)
   ```

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
        # ... (16 total criteria)
```

For each file:
1. Parse frontmatter (YAML)
2. Extract content sections
3. Run detection patterns (regex, keyword search)
4. Calculate score: `(points / max_points) × 100`
5. Assign grade (A-F)

## Phase 3: Comparative Analysis (Comparative Mode Only)

For each project file:
1. Find closest matching template (by description similarity)
2. Compare scores per criterion
3. Identify gaps: `template_score - project_score`
4. Flag significant gaps (>10 points difference)

**Example**:
```
Project file: .claude/agents/debugging-specialist.md (Score: 78%, Grade C)
Closest template: examples/agents/debugging-specialist.md (Score: 94%, Grade A)

Gaps:
- Anti-hallucination measures: -2 points (template has, project missing)
- Edge cases documented: -1 point (template has 5 examples, project has 1)
- Integration documented: -1 point (template references 3 skills, project none)

Total gap: 16 points (explains C vs A difference)
```

## Phase 4: Report Generation

**Markdown Report** (`audit-report.md`):
- Summary table (overall + by type)
- Individual scores with top issues
- Detailed breakdown per file (collapsible)
- Prioritized recommendations

**JSON Output** (`audit-report.json`):
```json
{
  "metadata": {
    "project_path": "/path/to/project",
    "audit_date": "2026-02-07",
    "mode": "full",
// ... (38 lines trimmed)
    }
  ]
}
```

## Phase 5: Fix Suggestions (Optional)

For each failing criterion, generate **actionable fix**:

```markdown
### File: .claude/agents/debugging-specialist.md
**Issue**: Missing anti-hallucination measures (2 points lost)

**Fix**:
Add this section after "Methodology":

## Source Verification

- Always cite sources for technical claims
- Use phrases: "According to [documentation]...", "Based on [tool output]..."
- If uncertain, state: "I don't have verified information on..."
- Never invent: statistics, version numbers, API signatures, stack traces

**Detection**: Grep for keywords: "verify", "cite", "source", "evidence"
```
