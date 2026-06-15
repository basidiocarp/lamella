---
name: config-curator
description: "Curates insights from reflections and critiques into `CLAUDE.md` using Agentic Context Engineering."
metadata:
  argument-hint: "Optional source specification (last, selection, chat:<id>) or --dry-run for preview"
origin: lamella
---
# Memory Consolidation: Curate and Update CLAUDE.md


## Contents

- [Memory Consolidation Workflow](#memory-consolidation-workflow)
  - [Phase 1: Context Harvesting](#phase-1-context-harvesting)
  - [Phase 2: Memory Curation Process](#phase-2-memory-curation-process)
  - [Phase 3: CLAUDE.md Updates](#phase-3-claudemd-updates)
- [[Domain/Pattern Category]](#domainpattern-category)
  - [[Specific Context or Pattern Name]](#specific-context-or-pattern-name)
  - [Phase 4: Memory Validation](#phase-4-memory-validation)
- [Usage](#usage)
- [Output](#output)
- [Notes](#notes)


Consolidate insights from reflection and debate processes. Curate and organize learnings into CLAUDE.md using Agentic Context Engineering (ACE) principles to build an evolving context playbook that improves future agent performance.

<task>
Transform reflections, critiques, verification outcomes, and execution feedback into durable, reusable guidance by updating `CLAUDE.md`. Use Agentic Context Engineering (ACE) principles to grow-and-refine a living playbook that improves over time without collapsing into vague summaries.
</task>

<context>
This command implements the **Curation** phase of the Agentic Context Engineering framework:
- **Generation**: Initial solutions and approaches (handled by main conversation)
- **Reflection**: Analysis and critique of solutions (handled by /reflexion:reflect and /reflexion:critique)
- **Curation**: Memory consolidation and context evolution (this command)

Output must add precise, actionable bullets that future tasks can immediately apply.
</context>

## Memory Consolidation Workflow

### Phase 1: Context Harvesting

First, gather insights from recent reflection and work:

1. **Identify Learning Sources**:
   - Recent conversation history and decisions
   - Reflection outputs from `/reflexion:reflect`
   - Critique findings from `/reflexion:critique`
   - Problem-solving patterns that emerged
   - Failed approaches and why they didn't work

If scope is unclear, ask: “What output(s) should I memorize? (last message, selection, specific files, critique report, etc.)”

2. **Extract Key Insights (Grow)**:
   - **Domain Knowledge**: Specific facts about the codebase, business logic, or problem domain
   - **Solution Patterns**: Effective approaches that could be reused
   - **Anti-Patterns**: Approaches to avoid and why
   - **Context Clues**: Information that helps understand requirements better
   - **Quality Gates**: Standards and criteria that led to better outcomes

Extract only high‑value, generalizable insights:

- Errors and Gaps
  - Error identification → one line
  - Root cause → one line
  - Correct approach → imperative rule
  - Key insight → decision rule or checklist item
- Repeatable Success Patterns
  - When to apply, minimal preconditions, limits, quick example
- API/Tool Usage Rules
  - Auth, pagination, rate limits, idempotency, error handling
- Verification Items
  - Concrete checks/questions to catch regressions next time
- Pitfalls/Anti‑patterns
  - What to avoid and why (evidence‑based)

Prefer specifics over generalities. If you cannot back a claim with either code evidence, docs, or repeated observations, don’t memorize it.

3. **Categorize by Impact**:
   - **Critical**: Insights that prevent major issues or unlock significant improvements
   - **High**: Patterns that consistently improve quality or efficiency
   - **Medium**: Useful context that aids understanding
   - **Low**: Minor optimizations or preferences

### Phase 2: Memory Curation Process

#### Step 1: Analyze Current CLAUDE.md Context

```bash
# Read current context file
@CLAUDE.md
```

Assess what's already documented:

- What domain knowledge exists?
- Which patterns are already captured?
- Are there conflicting or outdated entries?
- What gaps exist that new insights could fill?

#### Step 2: Curation Rules (Refine)

For each insight identified in Phase 1 apply ACE’s “grow‑and‑refine” principle:

- Relevance: Only include items helpful for recurring tasks in this repo/org
- Non‑redundancy: Do not duplicate existing bullets; merge or skip if similar
- Atomicity: One idea per bullet; short, imperative, self‑contained
- Verifiability: Avoid speculative claims; link docs when stating external facts
- Safety: No secrets, tokens, internal URLs, or private PII
- Stability: Prefer strategies that remain valid over time; call out version‑specifics

#### Step 3: Apply Curation Transformation

**Generation → Curation Mapping**:

- Raw insight: [What was learned]
- Context category: [Where it fits in CLAUDE.md structure]
- Actionable format: [How to phrase it for future use]
- Validation criteria: [How to know if it's being applied correctly]

**Example Transformation**:

```
Raw insight: "Using Map instead of Object for this lookup caused performance issues because the dataset was small (<100 items)"

Curated memory: "For dataset lookups <100 items, prefer Object over Map for better performance. Map is optimal for 10K+ items. Use performance testing to validate choice."
```

#### Step 4: Prevent Context Collapse

Ensure new memories don't dilute existing quality context:

1. **Consolidation Check**:
   - Can this insight be merged with existing knowledge?
   - Does it contradict something already documented?
   - Is it specific enough to be actionable?

2. **Specificity Preservation**:
   - Keep concrete examples and code snippets
   - Maintain specific metrics and thresholds where available
   - Include failure conditions alongside success patterns

3. **Organization Integrity**:
   - Place insights in appropriate sections
   - Maintain consistent formatting
   - Update related cross-references

If a potential bullet conflicts with an existing one, prefer the more specific, evidence‑backed rule and mark the older one for future consolidation (but do not auto‑delete).

### Phase 3: CLAUDE.md Updates

Update the context file with curated insights:

#### Where to Write in `CLAUDE.md`

Create the file if missing with these sections (top‑level headings):

1. **Project Context**
   - Domain Knowledge: Business domain insights
   - Technical constraints discovered
   - User behavior patterns

2. **Code Quality Standards**
   - Performance criteria that matter
   - Security considerations
   - Maintainability patterns

3. **Architecture Decisions**
   - Patterns that worked well
   - Integration approaches
   - Scalability considerations

4. **Testing Strategies**
   - Effective test patterns
   - Edge cases to always consider
   - Quality gates that catch issues

5. **Development Guidelines**
   - APIs to Use for Specific Information
   - Formulas and Calculations
   - Checklists for Common Tasks
   - Review criteria that help
   - Documentation standards
   - Debugging techniques

7. **Strategies and Hard Rules**
   - Verification Checklist
   - Patterns and Playbooks
   - Anti‑patterns and Pitfalls

Place each new bullet under the best‑fit section. Keep bullets concise and actionable.

#### Memory Update Template

For each significant insight, add structured entries:

```markdown
## [Domain/Pattern Category]

### [Specific Context or Pattern Name]

**Context**: [When this applies]

**Pattern**: [What to do]
```yaml
approach: [specific approach]
validation: [how to verify it's working]
examples:
  - case: [specific scenario]
    implementation: [code or approach snippet]
  - case: [another scenario]
    implementation: [different implementation]
```

**Avoid**: [Anti-patterns or common mistakes]

- [mistake 1]: [why it's problematic]
- [mistake 2]: [specific issues caused]

**Output format**
- Add short, durable bullets to `CLAUDE.md`
- Prefer principles and repeatable workflows over one-off anecdotes
- Cite the trigger or failure mode that justified the update

**Keep**
- Things the agent should reliably do next time
- Constraints, guardrails, and repo-specific conventions
- Concise examples only when they clarify a rule

**Do not keep**
- Temporary debugging notes
- User-specific preferences that conflict with established docs
- Redundant restatements of existing guidance

**Update discipline**
1. Deduplicate against existing bullets first.
2. Merge related lessons instead of appending noise.
3. Prefer rewriting a stale bullet over adding a near-duplicate.

## Usage

```bash
# Memorize from most recent reflections and outputs
/reflexion:memorize

# Dry‑run: show proposed bullets without writing to CLAUDE.md
/reflexion:memorize --dry-run

# Limit number of bullets
/reflexion:memorize --max=5

# Target a specific section
/reflexion:memorize --section="Verification Checklist"

# Choose source
/reflexion:memorize --source=last|selection|chat:<id>
```

## Output

1) Short summary of additions (counts by section)
2) Confirmation that `CLAUDE.md` was created/updated

## Notes

- This command is the counterpart to `/reflexion:reflect`: reflect → curate → memorize.
- The design follows ACE to avoid brevity bias and context collapse by accumulating granular, organized knowledge over time (`https://arxiv.org/pdf/2510.04618`).
- Do not overwrite or compress existing context; only add high‑signal bullets.

---

**Remember**: The goal is not to memorize everything, but to curate high-impact insights that consistently improve future agent performance. Quality over quantity - each memory should make future work measurably better.
