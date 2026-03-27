# Refactoring to Prompt-Native

Use this page as the routing layer for moving behavior out of code-heavy tools
and back into prompts plus primitives.

## Load Order

| Need | Reference |
| --- | --- |
| diagnosing non-prompt-native code | `diagnosing-non-prompt-native.md` |
| refactor workflow and before/after moves | `prompt-native-refactor-workflow.md` |
| common objections and iteration guidance | `prompt-native-challenges.md` |

## Core Rules

- tools should not decide what the agent should judge
- prompts should define outcomes and judgment boundaries
- refactoring should preserve capability while reducing embedded workflow logic
