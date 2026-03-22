# Audit Methodology

Detailed methodology for the audit scoring system.

## Why These Criteria?

The 16-criteria framework is derived from:
1. **Claude Code Best Practices** (Ultimate Guide line 4921: Agent Validation Checklist)
2. **Industry Data** (LangChain Agent Report 2026: evaluation gaps)
3. **Production Failures** (Community feedback on hardcoded paths, missing error handling)
4. **Composition Patterns** (Skills should reference other skills, agents should be modular)

## Scoring Philosophy

### Weight Rationale

- **Identity (3x)**: If users can't find/invoke the agent, quality is irrelevant (discoverability > quality)
- **Prompt (2x)**: Determines reliability and accuracy of outputs
- **Validation (1x)**: Improves robustness but is secondary to core functionality
- **Design (2x)**: Impacts long-term maintainability and scalability

### Grade Standards

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 90-100% | Production-ready, minimal risk |
| B | 80-89% | Good, meets production threshold |
| C | 70-79% | Needs improvement before production |
| D | 60-69% | Significant gaps, not production-ready |
| F | <60% | Critical issues, requires major refactoring |

**Industry Alignment**: The 80% threshold aligns with software engineering best practices for production deployment (e.g., code coverage >80%, security scan pass rates).

## Industry Context

**Source**: LangChain Agent Report 2026 (public report, page 14-22)

**Key Findings**:
- **29.5%** of organizations deploy agents without systematic evaluation
- **18%** cite "agent bugs" as their primary challenge
- **Only 12%** use automated quality checks (88% manual or none)
- **43%** report difficulty maintaining agent quality over time
- **Top issues**: Hallucinations (31%), poor error handling (28%), unclear triggers (22%)

**Implications**:
1. **Automation gap**: Most teams rely on manual checklists (error-prone at scale)
2. **Quality debt**: Agents deployed without validation accumulate technical debt
3. **Maintenance burden**: 43% struggle with quality over time (no tracking system)

**This skill addresses**:
- Automation: Replaces manual checklists with quantitative scoring
- Tracking: JSON output enables trend analysis over time
- Standards: 80% threshold provides clear production gate

## Scoring Criteria Details

### Agents (32 points max)

| Category | Weight | Criteria Count | Max Points |
|----------|--------|----------------|------------|
| Identity | 3x | 4 | 12 |
| Prompt Quality | 2x | 4 | 8 |
| Validation | 1x | 4 | 4 |
| Design | 2x | 4 | 8 |

**Key Criteria**:
- Clear name (3 pts): Not generic like "agent1"
- Description with triggers (3 pts): Contains "when"/"use"
- Role defined (2 pts): "You are..." statement
- 3+ examples (1 pt): Usage scenarios documented
- Single responsibility (2 pts): Focused, not "general purpose"

### Skills (32 points max)

| Category | Weight | Criteria Count | Max Points |
|----------|--------|----------------|------------|
| Structure | 3x | 4 | 12 |
| Content | 2x | 4 | 8 |
| Technical | 1x | 4 | 4 |
| Design | 2x | 4 | 8 |

**Key Criteria**:
- Valid SKILL.md (3 pts): Proper naming
- Name valid (3 pts): Lowercase, 1-64 chars, no spaces
- Methodology described (2 pts): Workflow section exists
- No hardcoded paths (1 pt): No `/Users/`, `/home/`
- Clear triggers (2 pts): "When to use" section

### Commands (20 points max)

| Category | Weight | Criteria Count | Max Points |
|----------|--------|----------------|------------|
| Structure | 3x | 4 | 12 |
| Quality | 2x | 4 | 8 |

**Key Criteria**:
- Valid frontmatter (3 pts): name + description
- Argument hint (3 pts): If uses `$ARGUMENTS`
- Step-by-step workflow (3 pts): Numbered sections
- Error handling (2 pts): Mentions failure modes
