---
name: confidence-check
type: pipeline
user-invocable: true
description: >
  Run this before writing any code when key unknowns remain unresolved — goal clarity,
  file seams, regression risk, or verification coverage — to gate whether to proceed,
  present alternatives, or ask clarifying questions first.
origin: lamella
---

# Confidence Check

## Contents

- [When to Activate](#when-to-activate)
- [Workflow](#workflow)
- [Why This Matters](#why-this-matters)
- [Four Confidence Axes](#four-confidence-axes)
- [Scoring and Thresholds](#scoring-and-thresholds)
- [Output Format](#output-format)
- [Gotchas](#gotchas)

## When to Activate

Run this skill before starting implementation when key unknowns remain unresolved:

- Before writing any code on a non-trivial task
- Before spawning an implementer agent
- When you realize you're guessing about file locations or approach
- When a previous attempt failed and you're about to try again

---

## Workflow

1. Score each of the four axes (Goal Clarity, Seam Knowledge, Regression Safety, Verification Coverage) from 1 to 10.
2. Compute the average of all four scores.
3. Apply the threshold gate: below 7 → LOW (ask clarifying questions); 7.0–8.9 → MEDIUM (present alternatives); 9.0–10 → HIGH (proceed).
4. Output the structured confidence block with scores, average, level, and next action.

---

## Why This Matters

**Token ROI:** Spending 100–200 tokens on a confidence check before starting implementation prevents 5,000–50,000 tokens on wrong-direction work.

When you're about to begin implementation:
- Stopping early to clarify saves the cost of rework, context compaction, and restart.
- Choosing the right alternative direction up front prevents thrashing between approaches.
- Knowing the verification strategy in advance means tests and checks work on the first pass, not the third.

**One clear check upfront** beats **three or four false starts**.

---

## Four Confidence Axes

Score each axis from 1 to 10. A score of 1 means you are guessing; a score of 10 means it is locked in.

### 1. Goal Clarity (1–10)

**Question:** Is the success criterion understood?

- **1–3**: Vague request, multiple interpretations, unclear what "done" means
- **4–6**: Mostly clear, but some edge cases or scope edges are undefined
- **7–8**: Clear success criterion; minor details TBD
- **9–10**: Exact success criterion and scope locked in; no ambiguity

**Examples:**
- Score 2: "Fix the bug" (which bug? how verify?)
- Score 7: "Fix the test failure in core/authentication/router-auth.test.ts when deployed to staging"
- Score 9: "Rename `useFetch` to `useQuery` across 5 files in the API layer; update 3 existing call sites; verify via existing tests pass"

### 2. Seam Knowledge (1–10)

**Question:** Are the owning files and entry points known?

- **1–3**: No idea where to start; don't know which files to touch
- **4–6**: General area known, but exact file boundaries unclear; may need to search/explore
- **7–8**: Know the primary files; might discover 1–2 others during work
- **9–10**: Exact file list and entry points already identified; ready to edit

**Examples:**
- Score 2: "Refactor the auth system" (which files own it?)
- Score 7: "Add a new option to the CLI parser in `mycelium/src/cli.rs`; update the help text in `cli.rs` and Config in `config.rs`"
- Score 9: "`lamella/resources/skills/core/error-memory/SKILL.md` lines 42–68; `lamella/resources/skills/SKILL_TEMPLATE.md` lines 1–8; test with `make validate`"

### 3. Regression Safety (1–10)

**Question:** Confidence the approach won't break existing behavior?

- **1–3**: High risk; approach might silently break existing code; no clear recovery plan
- **4–6**: Moderate risk; some existing behavior may break; partial mitigation strategy
- **7–8**: Low risk; approach is isolated; existing tests still pass
- **9–10**: Safe; approach is additive or in a sandbox; no impact on existing code

**Examples:**
- Score 2: Refactoring a shared utility used in 20 places without understanding all call sites
- Score 7: Adding a new command-line flag to the CLI; existing commands unaffected
- Score 9: Adding a new file in a new directory; no existing code imports from it

### 4. Verification Coverage (1–10)

**Question:** Will the verification commands actually prove the claim?

- **1–3**: No clear verification method; don't know how to prove success
- **4–6**: Basic verification possible; may not cover all cases
- **7–8**: Good verification path exists; covers most scenarios
- **9–10**: Exact verification commands identified; will definitively prove success

**Examples:**
- Score 2: "I'll manually test this" (which scenarios? how often?)
- Score 7: "`cargo test` passes and `cargo clippy` shows no errors"
- Score 9: "Run `cd lamella && make validate` → must show no errors; also run `cd lamella && ./lamella build && diff dist/ expected-dist/`"

---

## Scoring and Thresholds

Calculate the average of the four scores:

```
Average = (Goal Clarity + Seam Knowledge + Regression Safety + Verification Coverage) / 4
```

### Average Below 7 → **LOW Confidence**

**Action:** Stop. Do not proceed to implementation.

Ask 1–3 focused clarifying questions **about the lowest-scoring axis only**. Do not ask everything. Focus on the axis that will unlock the other three.

**Example:** If Goal Clarity is 3 but the others are 7+:
> "Is success 'rename the function AND update all call sites' or just 'rename and update the 5 call sites in the API layer'?"

Do not ask: "What files? What tests? What edge cases?" — ask only the one question that clarifies the scope.

### Average 7.0–8.9 → **MEDIUM Confidence**

**Action:** Present 2–3 alternative approaches with tradeoffs. Ask which to pursue.

Do not pick one approach. Lay out the options:

1. **Approach A**: [Description] — Pros: [fast/simple]. Cons: [risk/scope]. Best when: [scenario]
2. **Approach B**: [Description] — Pros: [safe/complete]. Cons: [slower]. Best when: [scenario]
3. **Approach C (optional)**: [Description] — Pros: [innovative]. Cons: [unknown]. Best when: [scenario]

**Example:**
- **Approach 1 (Strict refactor)**: Rename in all 12 files today. Pros: complete scope. Cons: risky, high regression surface.
- **Approach 2 (Staged refactor)**: Rename in 3 hotspot files this week, 9 others next sprint. Pros: lower risk per pass. Cons: longer.
- **Approach 3 (Wrapper)**: Create an alias, deprecate old name, rename later. Pros: zero risk now. Cons: adds indirection.

Then ask: "Which approach fits your timeline and risk tolerance?"

### Average 9.0–10 → **HIGH Confidence**

**Action:** Proceed to implementation. State the chosen approach in one sentence.

Example: "Rename `useFetch` to `useQuery` in the hook API by updating the function definition in `hooks/useFetch.ts`, the 3 call sites in `components/`, and verifying via `npm test`."

---

## Output Format

Use this block to report confidence:

```
CONFIDENCE CHECK
═══════════════════════════════════════

Goal Clarity:       [score]/10  [brief note]
Seam Knowledge:     [score]/10  [brief note]
Regression Safety:  [score]/10  [brief note]
Verification:       [score]/10  [brief note]

Average:            [x.x]/10

Level:              [LOW | MEDIUM | HIGH]

───────────────────────────────────────

NEXT ACTION:

[If LOW]:
  Clarifying question(s):
  - [Single focused question]

[If MEDIUM]:
  Alternative approaches:
  
  1. [Approach name] — [1 line] — Best when: [scenario]
  2. [Approach name] — [1 line] — Best when: [scenario]
  
  Which approach would you like?

[If HIGH]:
  Proceeding with: [1-sentence approach summary]
```

---

## Gotchas

### 1. Treating a Guess as 9+ When Seams Aren't Confirmed

**Failure mode:** You think "I know exactly what to do" because you have high goal clarity and a clear verification path — but you haven't actually looked at the files yet. Once you open them, you discover they're organized differently than you assumed.

**Catch it:** Always score Seam Knowledge separately. If goal clarity is 10 but seam knowledge is 4, the average is 7 — **MEDIUM**, not HIGH. Visually inspect the files before scoring Seams as 9+. Say: "I've looked at the files and they match my mental model."

### 2. Skipping the Check Under Time Pressure

**Failure mode:** "We don't have time for this check — just tell me what to do." Then you start implementation with half-understood scope, discover a blocking question at hour 2, and waste more time than the check would have cost.

**Catch it:** The check takes 5 minutes. Wrong direction takes hours. When time pressure increases, confidence check becomes more important, not less. Use it as a forcing function to say "We need to clarify first."

### 3. Asking Too Many Questions on a Low Score

**Failure mode:** You score LOW, so you ask 7 clarifying questions instead of the 1–3 required. The user gets overwhelmed, gives vague answers, and you're still stuck.

**Catch it:** When average is below 7, **identify which single axis is lowest**. Ask 1–3 questions about ONLY that axis. If Goal Clarity is the problem, clarify goal — don't ask about seams. Seams will clarify once goal is clear.

### 4. Not Distinguishing Between MEDIUM Alternatives and LOW Clarifications

**Failure mode:** You score MEDIUM, so you present alternatives. But you're actually still confused about the core goal. The "alternatives" are all solving different versions of the problem, not different ways to solve the same problem.

**Catch it:** Before presenting alternatives, verify goal clarity is 7+. If it's below 7, ask clarifying questions first, then re-score. Alternatives only make sense when the goal is locked in.

### 5. Forgetting That HIGH Score Requires All Four Axes

**Failure mode:** You score goal clarity as 9 and verification as 10, so you declare HIGH confidence overall — ignoring that seam knowledge is 4 and regression risk is 6.

**Catch it:** Use **average**, not "most axes are high." The four axes are interdependent. One weak axis weakens the whole plan.

### 6. Verifying After the Fact Instead of Before

**Failure mode:** You score verification as 9 because "we have tests" — but you haven't actually run them locally. Once implementation starts, you discover the tests are outdated or don't cover the changed code path.

**Catch it:** Before scoring verification as 7+, **actually run the verification command locally**. Say: "I ran `cargo test` and it passes" — not "I assume tests pass." Same for build, lint, and any other verification.

---

## Reference

For decision framing when MEDIUM confidence reveals tradeoffs, see `development-workflow.md` in the project rules.

For handling LOW confidence when the user wants to proceed anyway, document your assumptions clearly: state the specific guesses you're making and what would break if they're wrong.
