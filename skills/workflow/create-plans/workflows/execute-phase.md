# Workflow: Execute Phase

<purpose>
Execute a phase prompt (PLAN.md) and create the outcome summary (SUMMARY.md).
</purpose>

<process>

<step name="identify_plan">
Find the next plan to execute:
- Check roadmap.md for "In progress" phase
- Find plans in that phase directory
- Identify first plan without corresponding SUMMARY

```bash
cat .planning/roadmap.md
# Look for phase with "In progress" status
# Then find plans in that phase
ls .planning/phases/XX-name/*-PLAN.md 2>/dev/null | sort
ls .planning/phases/XX-name/*-SUMMARY.md 2>/dev/null | sort
```

**Logic:**
- If `01-01-PLAN.md` exists but `01-01-SUMMARY.md` doesn't → execute 01-01
- If `01-01-SUMMARY.md` exists but `01-02-SUMMARY.md` doesn't → execute 01-02
- Pattern: Find first PLAN file without matching SUMMARY file

Confirm with user if ambiguous.

Present:
```
Found plan to execute: {phase}-{plan}-PLAN.md
[Plan X of Y for Phase Z]

Proceed with execution?
```
</step>

<step name="parse_segments">
**Intelligent segmentation: Parse plan into execution segments.**

Plans are divided into segments by checkpoints. Each segment is routed to optimal execution context (subagent or main).

**1. Check for checkpoints:**
```bash
# Find all checkpoints and their types
grep -n "type=\"checkpoint" .planning/phases/XX-name/{phase}-{plan}-PLAN.md
```

**2. Analyze execution strategy:**

**If NO checkpoints found:**
- **Fully autonomous plan** - spawn single subagent for entire plan
- Subagent gets fresh 200k context, executes all tasks, creates SUMMARY, commits
- Main context: Just orchestration (~5% usage)

**If checkpoints found, parse into segments:**

Segment = tasks between checkpoints (or start→first checkpoint, or last checkpoint→end)

**For each segment, determine routing:**

```
Segment routing rules:

IF segment has no prior checkpoint:
  → SUBAGENT (first segment, nothing to depend on)

IF segment follows checkpoint:human-verify:
  → SUBAGENT (verification is just confirmation, doesn't affect next work)

IF segment follows checkpoint:decision OR checkpoint:human-action:
  → MAIN CONTEXT (next tasks need the decision/result)
```

**3. Execution pattern:**

**Pattern A: Fully autonomous (no checkpoints)**
```
Spawn subagent → execute all tasks → SUMMARY → commit → report back
```

**Pattern B: Segmented with verify-only checkpoints**
```
Segment 1 (tasks 1-3): Spawn subagent → execute → report back
Checkpoint 4 (human-verify): Main context → you verify → continue
Segment 2 (tasks 5-6): Spawn NEW subagent → execute → report back
Checkpoint 7 (human-verify): Main context → you verify → continue
Aggregate results → SUMMARY → commit
```

**Pattern C: Decision-dependent (must stay in main)**
```
Checkpoint 1 (decision): Main context → you decide → continue in main
Tasks 2-5: Main context (need decision from checkpoint 1)
No segmentation benefit - execute entirely in main
```

**4. Why this works:**

**Segmentation benefits:**
- Fresh context for each autonomous segment (0% start every time)
- Main context only for checkpoints (~10-20% total)
- Can handle 10+ task plans if properly segmented
- Quality impossible to degrade in autonomous segments

**When segmentation provides no benefit:**
- Checkpoint is decision/human-action and following tasks depend on outcome
- Better to execute sequentially in main than break flow

**5. Implementation:**

**For fully autonomous plans:**
```
Use Task tool with subagent_type="general-purpose":

Prompt: "Execute plan at .planning/phases/{phase}-{plan}-PLAN.md

This is an autonomous plan (no checkpoints). Execute all tasks, create SUMMARY.md in phase directory, commit with message following plan's commit guidance.

Follow all deviation rules and authentication gate protocols from the plan.

When complete, report: plan name, tasks completed, SUMMARY path, commit hash."
```

**For segmented plans (has verify-only checkpoints):**
```
Execute segment-by-segment:

For each autonomous segment:
  Spawn subagent with prompt: "Execute tasks [X-Y] from plan at .planning/phases/{phase}-{plan}-PLAN.md. Read the plan for full context and deviation rules. Do NOT create SUMMARY or commit - just execute these tasks and report results."

// ... (8 lines trimmed)
  Aggregate all results
  Create SUMMARY.md
  Commit with all changes
```

**For decision-dependent plans:**
```
Execute in main context (standard flow below)
No subagent routing
Quality maintained through small scope (2-3 tasks per plan)
```

See step name="segment_execution" for detailed segment execution loop.
</step>

<step name="segment_execution">
**Detailed segment execution loop for segmented plans.**

**This step applies ONLY to segmented plans (Pattern B: has checkpoints, but they're verify-only).**

For Pattern A (fully autonomous) and Pattern C (decision-dependent), skip this step.

**Execution flow:**

```
1. Parse plan to identify segments:
   - Read plan file
   - Find checkpoint locations: grep -n "type=\"checkpoint" PLAN.md
   - Identify checkpoint types: grep "type=\"checkpoint" PLAN.md | grep -o 'checkpoint:[^"]*'
   - Build segment map:
// ... (11 lines trimmed)
      - Prior checkpoint was decision/human-action? → Main context

   B. If routing = Subagent:
      ```
      Spawn Task tool with subagent_type="general-purpose":

      Prompt: "Execute tasks [task numbers/names] from plan at [plan path].

      **Context:**
      - Read the full plan for objective, context files, and deviation rules
      - You are executing a SEGMENT of this plan (not the full plan)
      - Other segments will be executed separately

      **Your responsibilities:**
      - Execute only the tasks assigned to you
      - Follow all deviation rules and authentication gate protocols
      - Track deviations for later Summary
      - DO NOT create SUMMARY.md (will be created after all segments complete)
      - DO NOT commit (will be done after all segments complete)

      **Report back:**
      - Tasks completed
      - Files created/modified
      - Deviations encountered
      - Any issues or blockers"

      Wait for subagent to complete
      Capture results (files changed, deviations, etc.)
      ```

   C. If routing = Main context:
      Execute tasks in main using standard execution flow (step name="execute")
      Track results locally

// ... (24 lines trimmed)

**Example execution trace:**

```
Plan: 01-02-PLAN.md (8 tasks, 2 verify checkpoints)

Parsing segments...
- Segment 1: Tasks 1-3 (autonomous)
- Checkpoint 4: human-verify
- Segment 2: Tasks 5-6 (autonomous)
- Checkpoint 7: human-verify
- Segment 3: Task 8 (autonomous)

Routing analysis:
- Segment 1: No prior checkpoint → SUBAGENT ✓
- Checkpoint 4: Verify only → MAIN (required)
- Segment 2: After verify → SUBAGENT ✓
- Checkpoint 7: Verify only → MAIN (required)
- Segment 3: After verify → SUBAGENT ✓

Execution:
[1] Spawning subagent for tasks 1-3...
    → Subagent completes: 3 files modified, 0 deviations
[2] Executing checkpoint 4 (human-verify)...
    ════════════════════════════════════════
    CHECKPOINT: Verification Required
    Task 4 of 8: Verify database schema
    I built: User and Session tables with relations
    How to verify: Check src/db/schema.ts for correct types
    ════════════════════════════════════════
    User: "approved"
[3] Spawning subagent for tasks 5-6...
    → Subagent completes: 2 files modified, 1 deviation (added error handling)
[4] Executing checkpoint 7 (human-verify)...
    User: "approved"
[5] Spawning subagent for task 8...
    → Subagent completes: 1 file modified, 0 deviations

Aggregating results...
- Total files: 6 modified
- Total deviations: 1
- Segmented execution: 3 subagents, 2 checkpoints

Creating SUMMARY.md...
Committing...
✓ Complete
```

**Benefits of this pattern:**
- Main context usage: ~20% (just orchestration + checkpoints)
- Subagent 1: Fresh 0-30% (tasks 1-3)
- Subagent 2: Fresh 0-30% (tasks 5-6)
// ... (9 lines trimmed)

<step name="load_prompt">
Read the plan prompt:
```bash
cat .planning/phases/XX-name/{phase}-{plan}-PLAN.md
```

This IS the execution instructions. Follow it exactly.
</step>

<step name="previous_phase_check">
Before executing, check if previous phase had issues:

```bash
# Find previous phase summary
ls .planning/phases/*/SUMMARY.md 2>/dev/null | sort -r | head -2 | tail -1
```

If previous phase SUMMARY.md has "Issues Encountered" != "None" or "Next Phase Readiness" mentions blockers:

Use AskUserQuestion:
- header: "Previous Issues"
// ... (58 lines trimmed)

**Example: Vercel deployment hits auth error**

```
Task 3: Deploy to Vercel
Running: vercel --yes

Error: Not authenticated. Please run 'vercel login'

[Create checkpoint dynamically]

════════════════════════════════════════
CHECKPOINT: Authentication Required
════════════════════════════════════════

Task 3 of 8: Authenticate Vercel CLI

I tried to deploy but got authentication error.

What you need to do:
Run: vercel login

This will open your browser - complete the authentication flow.

I'll verify after: vercel whoami returns your account

Type "done" when authenticated
════════════════════════════════════════

[Wait for user response]

[User types "done"]

Verifying authentication...
Running: vercel whoami
✓ Authenticated as: user@example.com

Retrying deployment...
Running: vercel --yes
✓ Deployed to: https://myapp-abc123.vercel.app

Task 3 complete. Continuing to task 4...
```

**Example: Stripe API needs key**

```
Task 5: Create Stripe webhook endpoint
Using Stripe API...

Error: 401 Unauthorized - No API key provided

[Create checkpoint dynamically]

════════════════════════════════════════
CHECKPOINT: Credentials Required
════════════════════════════════════════

Task 5 of 8: Provide Stripe API key

I tried to create webhook but need your Stripe API key.

What you need to do:
1. Visit dashboard.stripe.com/apikeys
2. Copy your "Secret key" (starts with sk_test_ or sk_live_)
3. Paste it here, or run: export STRIPE_SECRET_KEY=sk_...

I'll verify after: Stripe API call succeeds

Type "done" when ready, or paste the key
════════════════════════════════════════

[Wait for user response]

[User pastes key or exports env var]

Saving key to .env...
Verifying Stripe API access...
✓ Stripe API authenticated

Retrying webhook creation...
✓ Webhook endpoint created: whsec_abc123

Task 5 complete. Continuing to task 6...
```

**In Summary documentation:**

Document authentication gates as normal flow, not deviations:

```markdown
## Authentication Gates

During execution, I encountered authentication requirements:

1. Task 3: Vercel CLI required authentication
   - Paused for `vercel login`
   - Resumed after authentication
   - Deployed successfully

2. Task 5: Stripe API required API key
   - Paused for API key input
   - Saved to .env
   - Resumed webhook creation

These are normal gates, not errors.
```

**Key principles:**
- Authentication gates are NOT failures or bugs
- They're expected interaction points during first-time setup
- Handle them gracefully and continue automation after unblocked
// ... (114 lines trimmed)
**Process:**
1. STOP current task
2. Present clearly:
```
⚠️ Architectural Decision Needed

Current task: [task name]
Discovery: [what you found that prompted this]
Proposed change: [architectural modification]
Why needed: [rationale]
Impact: [what this affects - APIs, deployment, dependencies, etc.]
Alternatives: [other approaches, or "none apparent"]

Proceed with proposed change? (yes / different approach / defer)
```
3. WAIT for user response
4. If approved: implement, track as `[Rule 4 - Architectural] [description]`
5. If different approach: discuss and implement
6. If deferred: log to ISSUES.md, continue without change

// ... (24 lines trimmed)
4. Continue task without implementing

**Template for ISSUES.md:**
```markdown
# Project Issues Log

Enhancements discovered during execution. Not critical - address in future phases.

## Open Enhancements

### ISS-001: [Brief description]
- **Discovered:** Phase [X] Plan [Y] Task [Z] (YYYY-MM-DD)
- **Type:** [Performance / Refactoring / UX / Testing / Documentation / Accessibility]
- **Description:** [What could be improved and why it would help]
- **Impact:** Low (works correctly, this would enhance)
- **Effort:** [Quick / Medium / Substantial]
- **Suggested phase:** [Phase number or "Future"]

## Closed Enhancements

[Moved here when addressed]
```

**No user permission needed.** Logging for future consideration.

---

// ... (25 lines trimmed)
After all tasks complete, Summary MUST include deviations section.

**If no deviations:**
```markdown
## Deviations from Plan

None - plan executed exactly as written.
```

**If deviations occurred:**
```markdown
## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed case-sensitive email uniqueness constraint**
- **Found during:** Task 4 (Follow/unfollow API implementation)
- **Issue:** User.email unique constraint was case-sensitive - Test@example.com and test@example.com were both allowed, causing duplicate accounts
- **Fix:** Changed to `CREATE UNIQUE INDEX users_email_unique ON users (LOWER(email))`
- **Files modified:** src/models/User.ts, migrations/003_fix_email_unique.sql
- **Verification:** Unique constraint test passes - duplicate emails properly rejected
- **Commit:** abc123f

**2. [Rule 2 - Missing Critical] Added JWT expiry validation to auth middleware**
- **Found during:** Task 3 (Protected route implementation)
- **Issue:** Auth middleware wasn't checking token expiry - expired tokens were being accepted
- **Fix:** Added exp claim validation in middleware, reject with 401 if expired
- **Files modified:** src/middleware/auth.ts, src/middleware/auth.test.ts
- **Verification:** Expired token test passes - properly rejects with 401
- **Commit:** def456g

**3. [Rule 3 - Blocking] Fixed broken import path for UserService**
- **Found during:** Task 5 (Profile endpoint)
- **Issue:** Import path referenced old location (src/services/User.ts) but file was moved to src/services/users/UserService.ts in previous plan
- **Fix:** Updated import path
- **Files modified:** src/api/profile.ts
- **Verification:** Build succeeds, imports resolve
- **Commit:** ghi789h

**4. [Rule 4 - Architectural] Added Redis caching layer (APPROVED BY USER)**
- **Found during:** Task 6 (Feed endpoint)
- **Issue:** Feed queries hitting database on every request, causing 2-3 second response times under load
- **Proposed:** Add Redis cache with 5-minute TTL for feed data
- **User decision:** Approved
- **Fix:** Implemented Redis caching with ioredis client, cache invalidation on new posts
- **Files created:** src/cache/RedisCache.ts, src/cache/CacheKeys.ts, docker-compose.yml (added Redis)
- **Verification:** Feed response time reduced to <200ms, cache hit rate >80% in testing
- **Commit:** jkl012m

### Deferred Enhancements

Logged to .planning/ISSUES.md for future consideration:
- ISS-001: Refactor UserService into smaller modules (discovered in Task 3)
- ISS-002: Add connection pooling for Redis (discovered in Task 6)
- ISS-003: Improve error messages for validation failures (discovered in Task 2)

---

**Total deviations:** 4 auto-fixed (1 bug, 1 missing critical, 1 blocking, 1 architectural with approval), 3 deferred
**Impact on plan:** All auto-fixes necessary for correctness/security/performance. No scope creep.
```

**This provides complete transparency:**
- Every deviation documented
- Why it was needed
- What rule applied
// ... (8 lines trimmed)
**Critical: Claude automates everything with CLI/API before checkpoints.** Checkpoints are for verification and decisions, not manual work.

**Display checkpoint clearly:**
```
════════════════════════════════════════
CHECKPOINT: [Type]
════════════════════════════════════════

Task [X] of [Y]: [Action/What-Built/Decision]

[Display task-specific content based on type]

[Resume signal instruction]
════════════════════════════════════════
```

**For checkpoint:human-verify (90% of checkpoints):**
```
I automated: [what was automated - deployed, built, configured]

How to verify:
1. [Step 1 - exact command/URL]
2. [Step 2 - what to check]
3. [Step 3 - expected behavior]

[Resume signal - e.g., "Type 'approved' or describe issues"]
```

**For checkpoint:decision (9% of checkpoints):**
```
Decision needed: [decision]

Context: [why this matters]

Options:
1. [option-id]: [name]
   Pros: [pros]
   Cons: [cons]

2. [option-id]: [name]
   Pros: [pros]
   Cons: [cons]

[Resume signal - e.g., "Select: option-id"]
```

**For checkpoint:human-action (1% - rare, only for truly unavoidable manual steps):**
```
I automated: [what Claude already did via CLI/API]

Need your help with: [the ONE thing with no CLI/API - email link, 2FA code]

Instructions:
[Single unavoidable step]

I'll verify after: [verification]

[Resume signal - e.g., "Type 'done' when complete"]
```

**After displaying:** WAIT for user response. Do NOT hallucinate completion. Do NOT continue to next task.

**After user responds:**
- Run verification if specified (file exists, env var set, tests pass, etc.)
// ... (80 lines trimmed)
<step name="git_commit_plan">
Commit plan completion (PLAN + SUMMARY + code):

```bash
git add .planning/phases/XX-name/{phase}-{plan}-PLAN.md
git add .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md
git add .planning/roadmap.md
git add src/  # or relevant code directories
git commit -m "$(cat <<'EOF'
feat({phase}-{plan}): [one-liner from SUMMARY.md]

- [Key accomplishment 1]
- [Key accomplishment 2]
- [Key accomplishment 3]
EOF
)"
```

Confirm: "Committed: feat({phase}-{plan}): [what shipped]"

**Commit scope pattern:**
// ... (5 lines trimmed)
<step name="offer_next">
**If more plans in this phase:**
```
Plan {phase}-{plan} complete.
Summary: .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md

[X] of [Y] plans complete for Phase Z.

What's next?
1. Execute next plan ({phase}-{next-plan})
2. Review what was built
3. Done for now
```

**If phase complete (last plan done):**
```
Plan {phase}-{plan} complete.
Summary: .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md

Phase [Z]: [Name] COMPLETE - all [Y] plans finished.

What's next?
1. Transition to next phase
2. Review phase accomplishments
3. Done for now
```
</step>

</process>

<success_criteria>
- All tasks from PLAN.md completed
- All verifications pass
- SUMMARY.md created with substantive content
- roadmap.md updated
</success_criteria>
