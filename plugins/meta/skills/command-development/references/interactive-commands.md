# Interactive Command Patterns

Use this reference when a command needs structured user input during
execution, especially through `AskUserQuestion`.

## Use Interaction When

- the user must choose between a small set of trade-off-heavy options
- a workflow needs clarification that would be awkward as positional arguments
- the command should branch based on preferences collected in-session

Do not use interaction for simple, scriptable inputs such as filenames, single
numbers, or obvious flags.

## Good Question Design

- keep headers short and readable
- prefer 2 to 4 meaningful options
- explain the decision, not just the label
- use multi-select only when more than one choice can be valid together

## Common Patterns

- confirmation before a risky action
- multi-question setup wizard
- conditional follow-up based on the first answer
- feature selection with multi-select

## Guardrails

- keep the flow centered on `AskUserQuestion`, not general workflow logic
- fall back to command arguments when the invocation should stay automatable
- summarize the chosen path before writing files or running risky tools
