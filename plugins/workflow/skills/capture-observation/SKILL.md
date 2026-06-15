---
name: capture-observation
description: "Formats raw ecosystem notes from `.notes/intake/` into numbered observation records and saves them under `.notes/formatted/`. Use when agent behavior, ownership gaps, workflow problems, or ecosystem notes need to become structured OBS entries."
origin: lamella
---

# Capture Observation

Use this skill when raw notes need to become durable observation records that can drive planning later.

## Workflow

1. Read raw note files in `.notes/intake/`. Ignore `.notes/formatted/`.
2. Split each file into discrete observations. One source file may produce several OBS entries.
3. Find the highest existing `OBS-NNN` number in `.notes/formatted/` and continue from there.
4. Extract the problem, any concrete example, any suggested solutions, and the likely owning component.
5. Default missing fields conservatively:
   - `Status`: `Open`
   - `Priority`: `Medium` unless the note clearly describes a blocker, incorrect behavior, or data loss
6. Ask for clarification only when the note is too fragmentary to format usefully or ownership is genuinely ambiguous in a way that changes the next step.
7. Append the new entries to `.notes/formatted/YYYY-MM-DD-observations.md` and report what was created plus any assumptions.

## Rules

- Lead with the observed gap, not the surrounding story.
- Keep the observation grounded in the raw notes. Do not invent examples or solutions.
- If the note already contains a structured OBS entry, skip it and report that it appears pre-formatted.
- If the note duplicates an existing observation, reference the existing OBS number instead of creating another one.
- If `.notes/intake/` does not exist, stop and ask the user to confirm the correct path.

## Clarification Threshold

Ask only when one of these is true:

- The note has no usable subject, component, or situation.
- Two components are plausible owners and that distinction changes where follow-up work belongs.
- The note is too short or vague to produce a useful observation block.

Batch questions into one prompt. Do not ask about fields that can be defaulted.

## Output

Write to `.notes/formatted/YYYY-MM-DD-observations.md`. If the file already exists for today, append to it.

Report:

- how many observations were formatted
- the OBS numbers and titles created
- the output path
- any assumptions or defaults that should be reviewed

## References

- [references/observation-format.md](references/observation-format.md)
