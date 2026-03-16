# Phase 4.5: Adaptive Strategy Selection

**The orchestrator** (not a subagent) analyzes judge outputs to determine the optimal strategy.

## Decision Logic

### Step 1: Parse structured headers from judge reply

Parse the judges reply.
CRITICAL: Do not read report files themselves, as they can overflow your context.

### Step 2: Check for unanimous winner

Compare all three VOTE values:
- If Judge 1 VOTE = Judge 2 VOTE = Judge 3 VOTE (same solution):
  - **Strategy: SELECT_AND_POLISH**
  - **Reason:** Clear consensus - all three judges prefer same solution

### Step 3: Check if all solutions are fundamentally flawed

If no unanimous vote, calculate average scores:
1. Average Solution A scores: (Judge1_A + Judge2_A + Judge3_A) / 3
2. Average Solution B scores: (Judge1_B + Judge2_B + Judge3_B) / 3
3. Average Solution C scores: (Judge1_C + Judge2_C + Judge3_C) / 3

If (avg_A < 3.0) AND (avg_B < 3.0) AND (avg_C < 3.0):
- **Strategy: REDESIGN**
- **Reason:** All solutions below quality threshold, fundamental approach issues

### Step 4: Default to full synthesis

If none of the above conditions met:
- **Strategy: FULL_SYNTHESIS**
- **Reason:** Split decision with merit, synthesis needed to combine best elements

---

## Strategy 1: SELECT_AND_POLISH

**When:** Clear winner (unanimous votes)

**Process:**
1. Select the winning solution as the base
2. Launch subagent to apply specific improvements from judge feedback
3. Cherry-pick 1-2 best elements from runner-up solutions
4. Document what was added and why

**Benefits:**
- Saves synthesis cost (simpler than full synthesis)
- Preserves proven quality of winning solution
- Focused improvements rather than full reconstruction

### Prompt Template

```markdown
You are polishing the winning solution based on judge feedback.

<task>
{task_description}
</task>
// ... (59 lines trimmed)
- What was intentionally left unchanged

CRITICAL: Preserve the winning solution's core approach. Make targeted improvements only.
```

---

## Strategy 2: REDESIGN

**When:** All solutions scored <3.0/5.0 (fundamental issues across the board)

**Process:**
1. Launch new agent to analyze the failure modes and lessons learned
2. **Return to Phase 3** (Expansion), provide to new implementation agents the lessons learned and new constraints

**Note:** If redesign fails twice, escalate to user for guidance.

### Prompt Template for Redesign

```markdown
You are analyzing why all solutions failed to meet quality standards, to inform a redesign. And implement new solution based on it.


<task>
{task_description}
// ... (50 lines trimmed)
11. Revise solution:
   - Fix identified issues
12. Explain what was changed and why
```

---

## Strategy 3: FULL_SYNTHESIS (Default)

**When:** No clear winner AND solutions have merit (scores ≥3.0)

**Process:** Proceed to Phase 5 (Evidence-Based Synthesis)
