---
description: Audit a skill, slash command, or subagent for compliance and best practices
argument-hint: <path-to-component>
---

<objective>
Audit a Claude Code component (skill, slash command, or subagent) at $ARGUMENTS for compliance with best practices.

Auto-detects component type from path/content and invokes the appropriate auditor subagent.
</objective>

<process>
1. Determine component type from $ARGUMENTS:
   - Path contains `/skills/` or file has SKILL.md → **skill** (invoke skill-auditor)
   - Path contains `/commands/` → **slash command** (invoke slash-command-auditor)
   - Path contains `/agents/` → **subagent** (invoke subagent-auditor)
   - Otherwise: inspect file content to infer type
2. Invoke the appropriate auditor subagent with $ARGUMENTS
3. Subagent reads best practices and evaluates the component
4. Review detailed findings with file:line locations, compliance scores, and recommendations
</process>

<success_criteria>
- Component type correctly identified
- Appropriate auditor subagent invoked successfully
- Arguments passed correctly to subagent
- Audit includes structure evaluation and compliance scoring
</success_criteria>
