# Phase 5: Synthesis (Evidence-Based Combination)

**Only executed when Strategy 3 (FULL_SYNTHESIS) selected in Phase 4.5**

Launch **1 synthesis agent** (recommended: Opus for quality):

1. Agent receives:
   - **All solutions** (from specified output location)
   - **All evaluation reports** (from `.specs/reports/`)
   - **Selection rationale** from pruning phase (from `.specs/research/`)
2. Agent analyzes:
   - **Consensus strengths** (what multiple judges praised)
   - **Consensus weaknesses** (what multiple judges criticized)
   - **Complementary elements** where solutions took different approaches
3. Agent produces **final solution** by:
   - **Copying superior sections** when one solution clearly wins
   - **Combining approaches** when hybrid is better
   - **Fixing identified issues** that judges caught
   - **Documenting decisions** (what was taken from where and why)

**Key principle:** Evidence-based synthesis leverages collective intelligence from exploration and evaluation.

## Prompt Template for Synthesizer

```markdown
You are synthesizing the best solution from explored, pruned, and evaluated implementations.

<task>
{task_description}
</task>
// ... (88 lines trimmed)
- Cite your sources (which solution, which section)
- Explain every major decision
- Address all consensus weaknesses identified by judges
```
