<overview>
Standard SUMMARY.md structure for prompt outputs. Every executed prompt creates this file for quick human scanning.
</overview>

<template>
```markdown
# {Topic} {Purpose} Summary

**{Substantive one-liner describing outcome}**

## Version
- Version: {n}
- Date: {YYYY-MM-DD}

## Key Findings
- {finding 1}
- {finding 2}
- {finding 3}

## Decisions Needed
- {decision or "None"}

## Blockers
- {blocker or "None"}

## Next Step
- {concrete next action}

*Confidence: {High|Medium|Low}*
*Iterations: {n}*
*Full output: {filename.md}*
```
</template>

<field_requirements>

<one_liner>
The one-liner must describe the real outcome, not just completion status.
</one_liner>

<key_findings>
Tailor findings by prompt type:
- research: recommendations and discoveries
- plan: phases and assumptions
- do: implemented changes and verification
- refine: what improved
</key_findings>

<decisions_needed>
List only concrete user judgments such as trade-offs, approvals, or assumption checks.
</decisions_needed>

<blockers>
Use only for real external impediments. Most summaries should say `None`.
</blockers>

</field_requirements>
