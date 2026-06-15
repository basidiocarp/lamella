# System Prompt Design Patterns

Use this page for the structure of an agent system prompt, not for trigger
examples.

## Core Sections

- role and domain
- core responsibilities
- process steps
- output format
- edge-case handling

## Prompt Rules

- write in second person to the agent
- make responsibilities specific and observable
- define a concrete process, not just a goal
- give an explicit output format when consistency matters

## Good Design Signals

- another developer could predict the agent's behavior from the prompt alone
- process steps are actionable
- quality standards are measurable
- edge cases are handled without making the prompt encyclopedic
