---
name: handoff-check
description: Audits an active handoff for unchecked checklist items, empty PASTE blocks, and missing verification evidence before completion claims. Use when working from `.handoffs/*.md` or before saying a handoff is done.
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
4. Check whether the handoff names a verification script. If it exists, run it before confirming completion.
5. Treat an empty verification output block as missing evidence, even if the command was described above it.

## Completion Gate

Do not confirm completion if any of these remain:

- Unchecked checklist items such as `- [ ]`
- Empty paste blocks between `PASTE START` and `PASTE END`
- Missing or failing verification script output

If issues exist, say the handoff is not complete, list the blockers, and tell the agent to fix the handoff evidence before claiming success.

## Pass Condition

Only confirm the handoff is complete when:

- Every checklist item is checked
- Every paste block contains verification evidence
- The verification script exists and passes, or the handoff explicitly says no verifier exists
