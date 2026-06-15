# Model Selection

Use model selection to match cost and capability to the actual subtask.

## Core Factors

Evaluate each step on:
- complexity
- scope
- risk
- whether a specialized agent would help

## Practical Defaults

| Task shape | Better default |
|---|---|
| high-risk or architectural | strongest model |
| medium-complexity implementation | balanced model |
| short mechanical update | fast model |

When in doubt, spend more capability on early dependency-setting steps than on
late mechanical cleanup.

## Specialized Agents

Use a specialized agent only when:
- the task clearly matches that specialization
- the added context and startup cost are justified

Otherwise use the general implementation path.

## Selection Rule

Upgrade for:
- breaking changes
- interface design
- high-blast-radius steps

Downgrade for:
- repetitive renames
- small content edits
- narrow mechanical updates

Model choice should follow risk and ambiguity, not habit.
