# Critique Workflow

Comprehensive multi-perspective review using specialized judges with debate and consensus building.

## Trigger

Use when:
- Review of completed work is needed
- Multi-perspective quality assessment required
- Before shipping significant features

## Overview

This workflow implements a sophisticated review pattern combining:
- **Multi-Agent Debate**: Multiple specialized judges provide independent perspectives
- **LLM-as-a-Judge**: Structured evaluation framework for consistent assessment
- **Chain-of-Verification (CoVe)**: Each judge validates their own critique before submission
- **Consensus Building**: Judges debate findings to reach agreement on recommendations

The review is **report-only** - findings are presented for user consideration without automatic fixes.

## Workflow Phases

### Phase 1: Context Gathering

1. **Identify the scope of work to review**:
   - If arguments provided: Use them to identify specific files, commits, or context
   - If no arguments: Review recent conversation history and file changes

2. **Capture relevant context**:
   - Original requirements or user request
   - Files that were modified or created
   - Decisions made during implementation

3. **Summarize scope for confirmation**

### Phase 2: Independent Judge Reviews (Parallel)

Spawn three specialized judge agents in parallel:

#### Judge 1: Requirements Validator
- List all requirements from original request
- Check each requirement against implementation
- Identify gaps, over-delivery, or misalignments
- Score: Requirements Alignment X/10

#### Judge 2: Solution Architect
- Analyze the chosen approach
- Consider alternative approaches
- Evaluate trade-offs and design decisions
- Score: Solution Optimality X/10

#### Judge 3: Code Quality Reviewer
- Assess code readability and clarity
- Check for code smells and complexity
- Identify refactoring opportunities
- Score: Code Quality X/10

### Phase 3: Cross-Review & Debate

1. **Synthesize the findings**:
   - Identify areas of agreement
   - Identify contradictions or disagreements

2. **Conduct debate session** (if significant disagreements exist):
   - Present conflicting viewpoints to judges
   - Ask each judge to review others' findings

3. **Reach consensus**:
   - Synthesize debate outcomes
   - Document unresolved disagreements

### Phase 4: Generate Consensus Report

Compile all findings into comprehensive report.

## Agent Chain

```
┌─────────────────────────────────────────────────┐
│  1. Context Gathering                           │
│     - Identify scope                            │
│     - Capture context                           │
│     - Summarize for confirmation                │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  2. Independent Judge Reviews (PARALLEL)        │
│     ┌──────────────┐                            │
│     │ Requirements │                            │
│     │  Validator   │                            │
│     └──────────────┘                            │
│     ┌──────────────┐                            │
│     │  Solution    │                            │
│     │  Architect   │                            │
│     └──────────────┘                            │
│     ┌──────────────┐                            │
│     │ Code Quality │                            │
│     │  Reviewer    │                            │
│     └──────────────┘                            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  3. Cross-Review & Debate                       │
│     - Synthesize findings                       │
│     - Conduct debate if disagreements           │
│     - Reach consensus                           │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  4. Generate Consensus Report                   │
│     - Overall score                             │
│     - Strengths & issues                        │
│     - Action items                              │
└─────────────────────────────────────────────────┘
```

## Output Format

```markdown
# 🔍 Work Critique Report

## Executive Summary
[2-3 sentences summarizing overall assessment]

**Overall Quality Score**: X/10

---

## 📊 Judge Scores

| Judge | Score | Key Finding |
|-------|-------|-------------|
| Requirements Validator | X/10 | [summary] |
| Solution Architect | X/10 | [summary] |
| Code Quality Reviewer | X/10 | [summary] |

---

## ✅ Strengths
[Synthesized list of what was done well]

## ⚠️ Issues & Gaps

### Critical Issues
[Issues that need immediate attention]

### High Priority
[Important but not blocking]

### Medium Priority
[Nice to have improvements]

---

## 📋 Action Items (Prioritized)

**Must Do**:
- [ ] Critical action 1
- [ ] Critical action 2

**Should Do**:
- [ ] High priority action 1

**Could Do**:
- [ ] Medium priority action 1

---

**Verdict**: ✅ Ready to ship | ⚠️ Needs improvements | ❌ Requires rework
```

## Important Guidelines

1. **Be Objective**: Base assessments on evidence, not preferences
2. **Be Specific**: Cite file locations, line numbers, code examples
3. **Be Constructive**: Frame criticism as opportunities for improvement
4. **Be Balanced**: Acknowledge both strengths and weaknesses
5. **Be Actionable**: Provide concrete recommendations
6. **Consider Context**: Account for project constraints, team size, timelines

## Usage Examples

```bash
# Review recent work from conversation
/critique

# Review specific files
/critique src/feature.ts src/feature.test.ts

# Review with specific focus
/critique --focus=security

# Review a git commit
/critique HEAD~1..HEAD
```

## Notes

- This is a **report-only** workflow - it does not make changes
- The review may take 2-5 minutes due to multi-agent coordination
- Scores are relative to professional development standards
- Disagreements between judges are valuable insights, not failures
