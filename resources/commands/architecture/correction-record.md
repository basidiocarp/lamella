---
description: "Record a correction as a generalizable pattern to prevent repeating the same mistake. Triggers on 'correction record', 'record this correction', 'log this mistake'."
argument-hint: "[description of what went wrong, or blank to infer from conversation]"
---

# Correction Record

Extract a reusable lesson from a mistake or correction.

## Context

Correction input: `$ARGUMENTS`

If no arguments are given, scan the recent conversation for the most recent correction the user made (explicit feedback, a reverted change, or a "no, do it this way" instruction).

## Workflow

### 1. Identify the Correction

Determine exactly what went wrong:
- What action was taken (the mistake)
- What the user expected instead
- The gap between the two

If inferring from conversation, quote the relevant exchange so the user can confirm the right moment was captured.

### 2. Diagnose the Cause

Classify why the mistake happened:

Assumption error: acted on an unstated assumption that turned out wrong.
Pattern mismatch: applied a general pattern that doesn't fit this project's conventions.
Missing context: lacked information that was available but not loaded (a config file, a README, a prior decision).
Scope creep: did more than asked, or modified something outside the request.
Tool misuse: used the wrong tool or used the right tool incorrectly.

### 3. Extract the Learning

Write the correction as a rule:
- State the rule in imperative voice ("Always X when Y" or "Never X in context Y")
- Scope it precisely (which project, language, framework, or situation)
- Include the counter-example (what not to do) alongside the correct behavior

### 4. Define Verification

Describe how to check compliance with this rule in the future:
- A grep pattern, lint rule, or test assertion if the rule is mechanical
- A review checkpoint if the rule requires judgment
- A trigger condition that should remind Claude to apply this rule

## Output Modes

Choose the format based on the user's context:

Full record (default when the correction is non-trivial):

```
Correction: [what went wrong, one sentence]
Cause: [classification from step 2]
Rule: [imperative statement]
Scope: [where this applies]
Counter-example: [the wrong behavior]
Correct behavior: [the right behavior]
Verification: [how to check compliance]
```

Quick format (when the user asks for something brief, or the correction is small):

```
Correction: [what happened]
Rule: [what to do instead]
Scope: [where this applies]
```

After outputting the record, suggest where to store it: a CLAUDE.md rule, a memory file, or a project-specific instructions file. Offer to write it there.
