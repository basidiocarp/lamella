---
name: systematic-debugging
description: "Run this when debugging to apply structured methodology — uses investigation, hypotheses, testing, and validation framework."
origin: lamella
---

# Systematic Debugging


## Contents

- [The Iron Law](#the-iron-law)
- [When to Use](#when-to-use)
- [The Four Phases](#the-four-phases)
  - [Phase 1: Root Cause Investigation](#phase-1-root-cause-investigation)
  - [Phase 2: Pattern Analysis](#phase-2-pattern-analysis)
  - [Phase 3: Hypothesis and Testing](#phase-3-hypothesis-and-testing)
  - [Phase 4: Implementation](#phase-4-implementation)
- [Red Flags - STOP and Follow Process](#red-flags---stop-and-follow-process)
- [User Signals You're Doing It Wrong](#user-signals-youre-doing-it-wrong)
- [Common Rationalizations](#common-rationalizations)
- [Quick Reference](#quick-reference)
- [When Process Reveals "No Root Cause"](#when-process-reveals-no-root-cause)
- [Supporting Techniques](#supporting-techniques)
- [Real-World Impact](#real-world-impact)


Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

**Violating the letter of this process is violating the spirit of debugging.**

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

Use for ANY technical issue:
- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures
- Integration issues

**Use this ESPECIALLY when:**
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Previous fix didn't work
- You don't fully understand the issue

**Don't skip when:**
- Issue seems simple (simple bugs have root causes too)
- You're in a hurry (rushing guarantees rework)
- Manager wants it fixed NOW (systematic is faster than thrashing)

If the user wants an issue-ready fix plan after debugging, package the findings
using the behavior-level template in `references/issue-triage.md`.

## Model Selection for Debugging

Match model to bug complexity. Escalate models alongside abstraction levels.

| Bug Type | Model | Why |
|----------|-------|-----|
| Typos, missing imports, syntax errors | **Haiku** | Obvious fixes, cheap verification |
| Stack traces, logic bugs, test failures | **Sonnet** | Best coding model, traces data flow |
| Race conditions, architectural bugs, subtle concurrency | **Opus** | Deep reasoning across multiple files |

Map to the 3-strike escalation:

```
Strike 1-2 (Implementation): Sonnet — fix at code level
Strike 3   (Design/Requirements): Escalate to Opus — rethink the approach
Post-fix   (Validation): Haiku — run tests, confirm green
```

When orchestrating multi-agent debugging:

```
Sonnet debugger → fix attempt → Haiku validator (run tests)
  ├── passes → done
  └── fails 3x → Opus for root cause analysis → back to Sonnet
```

## The Four Phases

complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully**
   - Don't skip past errors or warnings
   - They often contain the exact solution
   - Read stack traces completely
   - Note line numbers, file paths, error codes

2. **Reproduce Consistently**
   - Can you trigger it reliably?
   - What are the exact steps?
   - Does it happen every time?
   - If not reproducible → gather more data, don't guess

3. **Check Recent Changes**
   - What changed that could cause this?
   - Git diff, recent commits
   - New dependencies, config changes
   - Environmental differences

4. **Gather Evidence in Multi-Component Systems**

   **WHEN system has multiple components (CI → build → signing, API → service → database):**

   **BEFORE proposing fixes, add diagnostic instrumentation:**
   ```
   For EACH component boundary:
     - Log what data enters component
     - Log what data exits component
     - Verify environment/config propagation
     - Check state at each layer

   Run once to gather evidence showing WHERE it breaks
   THEN analyze evidence to identify failing component
   THEN investigate that specific component
   ```

   **Example (multi-layer system):**
   ```bash
   # Layer 1: Workflow
   echo "=== Secrets available in workflow: ==="
   echo "IDENTITY: ${IDENTITY:+SET}${IDENTITY:-UNSET}"

   # Layer 2: Build environment
   xcodebuild -showBuildSettings | rg "CODE_SIGN|PROVISIONING"

   # Layer 3: Built artifact
   codesign --display --verbose=4 "$APP" || true
   security find-identity -p codesigning -v

   # Layer 4: Actual signing
   codesign --sign "$IDENTITY" --verbose=4 "$APP"
   ```

   **This reveals:** Which layer fails (secrets → workflow ✓, workflow → build ✗)

5. **Trace Data Flow**

   **WHEN error is deep in call stack:**

   See `root-cause-tracing.md` in this directory for the complete backward tracing technique.

   **Quick version:**
   - Where does bad value originate?
   - What called this with bad value?
   - Keep tracing up until you find the source
   - Fix at source, not at symptom

6. **Bisect to Narrow Scope**

   When the failure surface is large, cut it in half repeatedly:

   - **Git bisect** — find the commit that introduced the bug:
     ```bash
     git bisect start
     git bisect bad              # current commit is broken
     git bisect good <known-good-sha>
     # Git checks out midpoint — test and mark good/bad — repeat
     ```
   - **Code path bisect** — add logging at the midpoint of a call chain. If data is correct there, bug is downstream. If wrong, bug is upstream. Repeat.
   - **Test pollution bisect** — use `find-polluter.sh` in this directory to find which test creates unwanted state:
     ```bash
     ./find-polluter.sh '.git' 'src/**/*.test.ts'
     ```

7. **Diff Environments**

   **WHEN it works locally but fails in CI/staging/prod:**

   - Compare Node/Python/runtime versions
   - Compare env vars: `env | sort` on both, diff the output
   - Compare installed dependencies: lockfile differences, native module versions
   - Check filesystem differences: paths, permissions, case sensitivity
   - Check network: DNS resolution, firewall rules, proxy settings
   - Check resource limits: memory, CPU, file descriptors, disk space

   **Don't assume environments are identical.** Explicitly verify each layer.

### Phase 2: Pattern Analysis

**Find the pattern before fixing:**

1. **Find Working Examples**
   - Locate similar working code in same codebase
   - What works that's similar to what's broken?

2. **Compare Against References**
   - If implementing pattern, read reference implementation COMPLETELY
   - Don't skim - read every line
   - Understand the pattern fully before applying

3. **Identify Differences**
   - What's different between working and broken?
   - List every difference, however small
   - Don't assume "that can't matter"

4. **Understand Dependencies**
   - What other components does this need?
   - What settings, config, environment?
   - What assumptions does it make?

### Phase 3: Hypothesis and Testing

**Scientific method:**

1. **Form Single Hypothesis**
   - State clearly: "I think X is the root cause because Y"
   - Write it down
   - Be specific, not vague

2. **Test Minimally**
   - Make the SMALLEST possible change to test hypothesis
   - One variable at a time
   - Don't fix multiple things at once

3. **Verify Before Continuing**
   - Did it work? Yes → Phase 4
   - Didn't work? Form NEW hypothesis
   - DON'T add more fixes on top

4. **When You Don't Know**
   - Say "I don't understand X"
   - Don't pretend to know
   - Ask for help
   - Research more

### Phase 4: Implementation

**Fix the root cause, not the symptom:**

1. **Create Failing Test Case**
   - Simplest possible reproduction
   - Automated test if possible
   - One-off test script if no framework
   - MUST have before fixing
   - Write a proper failing test that reproduces the bug

2. **Implement Single Fix**
   - Address the root cause identified
   - ONE change at a time
   - No "while I'm here" improvements
   - No bundled refactoring

3. **Verify Fix**
   - Test passes now?
   - No other tests broken?
   - Issue actually resolved?

4. **If Fix Doesn't Work**
   - STOP
   - Count: How many fixes have you tried?
   - If < 3: Return to Phase 1, re-analyze with new information
   - **If ≥ 3: STOP and question the architecture (step 5 below)**
   - DON'T attempt Fix #4 without architectural discussion

5. **If 3+ Fixes Failed: Question Architecture**

   **Pattern indicating architectural problem:**
   - Each fix reveals new shared state/coupling/problem in different place
   - Fixes require "massive refactoring" to implement
   - Each fix creates new symptoms elsewhere

   **STOP and question fundamentals:**
   - Is this pattern fundamentally sound?
   - Are we "sticking with it through sheer inertia"?
   - Should we refactor architecture vs. continue fixing symptoms?

   **Discuss with your human partner before attempting more fixes**

   This is NOT a failed hypothesis - this is a wrong architecture.

## Red Flags - STOP and Follow Process

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "Pattern says X but I'll adapt it differently"
- "Here are the main problems: [lists fixes without investigation]"
- Proposing solutions before tracing data flow
- **"One more fix attempt" (when already tried 2+)**
- **Each fix reveals new problem in different place**

**ALL of these mean: STOP. Return to Phase 1.**

**If 3+ fixes failed:** Question the architecture (see Phase 4.5)

## User Signals You're Doing It Wrong

**Watch for these redirections:**
- "Is that not happening?" — you assumed without verifying
- "Will it show us...?" — have added evidence gathering
- "Stop guessing" — you're proposing fixes without understanding
- "Ultrathink this" — question fundamentals, not just symptoms
- "We're stuck?" (frustrated) — your approach isn't working

**When you see these:** STOP. Return to Phase 1.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "I'll write test after confirming fix works" | Untested fixes don't stick. Test first proves it. |
| "Multiple fixes at once saves time" | Can't isolate what worked. Causes new bugs. |
| "Reference too long, I'll adapt the pattern" | Partial understanding guarantees bugs. Read it completely. |
| "I see the problem, let me fix it" | Seeing symptoms ≠ understanding root cause. |
| "One more fix attempt" (after 2+ failures) | 3+ failures = architectural problem. Question pattern, don't fix again. |

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| **1. Root Cause** | Read errors, reproduce, check changes, gather evidence | Understand WHAT and WHY |
| **2. Pattern** | Find working examples, compare | Identify differences |
| **3. Hypothesis** | Form theory, test minimally | Confirmed or new hypothesis |
| **4. Implementation** | Create test, fix, verify | Bug resolved, tests pass |

## When Process Reveals "No Root Cause"

If systematic investigation reveals issue is truly environmental, timing-dependent, or external:

1. You've completed the process
2. Document what you investigated
3. Implement appropriate handling (retry, timeout, error message)
4. Add monitoring/logging for future investigation

**But:** 95% of "no root cause" cases are incomplete investigation.

## Supporting Techniques

These techniques are part of systematic debugging and available in this directory:

- **`root-cause-tracing.md`** — Trace bugs backward through call stack to find original trigger
- **`defense-in-depth.md`** — Add validation at multiple layers after finding root cause
- **`condition-based-waiting.md`** — Replace arbitrary timeouts with condition polling
- **`find-polluter.sh`** — Bisection script to find which test creates unwanted files/state
- **`three-strike-escalation.md`** — When 3 fix attempts fail, escalate to the next abstraction level

## Real-World Impact

From debugging sessions:
- Systematic approach: 15-30 minutes to fix
- Random fixes approach: 2-3 hours of thrashing
- First-time fix rate: 95% vs 40%
- New bugs introduced: Near zero vs common

## Reference Files


| File | Path |
|------|------|
| [Creation Log](references/CREATION-LOG.md) | `references/CREATION-LOG.md` |
| [Test Academic](references/test-academic.md) | `references/test-academic.md` |
| [Test Pressure 1](references/test-pressure-1.md) | `references/test-pressure-1.md` |
| [Test Pressure 2](references/test-pressure-2.md) | `references/test-pressure-2.md` |
| [Test Pressure 3](references/test-pressure-3.md) | `references/test-pressure-3.md` |
- [Condition Based Waiting Example](scripts/condition-based-waiting-example.ts)
