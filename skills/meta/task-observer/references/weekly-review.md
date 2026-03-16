# Weekly Review Process

The weekly review is the primary mechanism for turning observations into
skill improvements. It runs when 7+ days have passed since the last review.

## Trigger

Check whether a review is due at the beginning of each session by inspecting
the `last_weekly_review` field in the log. If more than 7 days have elapsed,
run the review before task work begins.

## Steps

### Step 0 — Scheduler Check

Read the log header for the `last_weekly_review` timestamp. If fewer than
7 days have passed, skip the review and move to task work.

### Step 1 — Load Observations

Read the full log file. Collect every entry with status `OPEN`.

### Step 2 — Inventory Skills

Gather the current skill inventory — all skills in the workspace, their
SKILL.md frontmatter, and high-level purpose. This provides the baseline
for evaluating observations.

### Step 3 — Cross-Check Observations Against Skills

For each OPEN observation:

1. **Does an existing skill already cover this?**
   - If yes → mark DECLINED with reason "already covered by [skill-name]"
2. **Can an existing skill absorb this improvement?**
   - If yes → prepare a targeted edit to that skill
3. **Does this observation warrant a new skill?**
   - If yes → draft a new skill following the project's SKILL.md template
4. **Is the observation stale or low-value?**
   - If yes → mark DECLINED with reason

### Step 4 — Cross-Check Cross-Cutting Principles

Review the principles file. For each active principle, check whether it
should propagate to any skills identified in Step 3. Add propagation notes
where applicable.

### Step 5 — Apply Updates

Execute the prepared edits and new skill drafts. For each change:

- Open the target file
- Apply the modification
- Verify the file is valid after editing

**Routing for system skills:** If a skill is read-only or managed externally,
identify the closest user-owned skill and apply the improvement there as a
complementary extension.

### Step 6 — Mark ACTIONED

Update each processed observation from `OPEN` → `ACTIONED` with a reference
to the skill that was updated or created. Do NOT archive in this session —
archival happens on the next session's log write.

### Step 7 — Update Timestamp

Set `last_weekly_review` in the log header to the current date.

### Step 8 — Present Summary

Show the user a concise summary:

```markdown
## Weekly Review Summary

**Period:** [start] → [end]
**Observations reviewed:** [count]

// ... (8 lines trimmed)

### Principles Propagated
- [principle] → [skill-name]
```

## Constraints

- **Do not modify observations** beyond changing their status and adding
  action references. The original text is the record of what was observed.
- **Do not create new skills** without user approval during the summary
  presentation. Draft them, present them, and wait for confirmation.
- **Handle uncertainty explicitly.** If an observation is ambiguous, flag it
  in the summary and let the user decide rather than guessing.
