# Dynamic Context Injection

Use this page as the routing layer for runtime context injection into agent
prompts.

## Load Order

| Need | Reference |
| --- | --- |
| the main injection pattern and implementation styles | `context-injection-pattern.md` |
| what runtime state to inject | `what-context-to-inject.md` |
| freshness and refresh strategies | `context-freshness.md` |

## Core Rules

- static prompts describe capabilities; runtime context describes current state
- inject context at agent start
- refresh only when long-running sessions need it
