---
name: handoff-check
description: Audits an active handoff for unchecked checklist items, empty PASTE blocks, unresolved clarification markers, missing residual-work dispositions, and missing verification evidence before completion claims. Use when working from `.handoffs/*.md` or before saying a handoff is done.
origin: lamella
---

# Handoff Check

Announce at start: "I'm using the handoff-check skill to audit the active handoff."

## Use It When

- You are executing a handoff from `.handoffs/`
- You are about to mark checklist items complete
- You are about to claim the handoff is finished

## Audit Flow

1. Identify the active handoff path. If more than one handoff is in play, ask which file to audit.
2. Read the handoff and list every unchecked checklist item with its line number.
3. Find every `<!-- PASTE START -->` / `<!-- PASTE END -->` block that contains no non-empty content. Report the start-line number for each empty block.
4. Scan the Problem, What exists, What needs doing, and Scope sections for unresolved markers: `[NEEDS CLARIFICATION]`, `[TBD]`, `[OPEN QUESTION]`, `[UNCLEAR]`, `[UNRESOLVED]`. Report each with its line number.
5. Check the `## Residual Work` section. If it is present and the table has no entries beyond the placeholder row, flag it — an empty Residual Work section is only valid when Stage 2 review confirmed zero open findings. If it is absent, that is valid only when all findings were fixed.
6. Check whether the handoff names a verification script. If it exists, run it before confirming completion.
7. Treat an empty verification output block as missing evidence, even if the command was described above it.

## Completion Gate

Do not confirm completion if any of these remain:

- Unchecked checklist items such as `- [ ]`
- Empty paste blocks between `PASTE START` and `PASTE END`
- Missing or failing verification script output
- Unresolved clarification markers (`[NEEDS CLARIFICATION]`, `[TBD]`, `[OPEN QUESTION]`) in plan-body sections
- Empty `## Residual Work` table when Stage 2 review reported open findings that were accepted rather than fixed

If issues exist, say the handoff is not complete, list the blockers, and tell the agent to fix the handoff evidence before claiming success.

## Pass Condition

Only confirm the handoff is complete when:

- Every checklist item is checked
- Every paste block contains verification evidence
- The verification script exists and passes, or the handoff explicitly says no verifier exists
- No unresolved clarification markers remain in plan-body sections
- The Residual Work section is either absent (all findings fixed) or contains a disposition row for every accepted-but-unfixed finding from Stage 1 and Stage 2 review
