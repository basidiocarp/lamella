# Agent Types Reference

Use this reference to choose the simplest agent type that fits the task.

## Built-In Agent Roles

| Agent type | Best for |
|---|---|
| `Bash` | shell commands and operational tasks |
| `Explore` | read-only codebase search and analysis |
| `Plan` | architecture or implementation planning |
| `general-purpose` | mixed research and execution work |

The default rule is: do not use a more powerful agent than the task requires.

## Specialized or Plugin Agents

Plugin-defined agents usually exist for one of four purposes:
- review
- research
- design
- workflow validation

Examples:
- security or performance review agents
- framework-docs researchers
- design sync helpers
- bug reproduction or deployment verification agents

Choose them when their specialization materially narrows the task, not just
because they sound impressive.

## Selection Heuristics

### Use `Explore`

For:
- finding symbols or endpoints
- inventorying files
- understanding a codebase slice without edits

### Use `Plan`

For:
- breaking down implementation work
- comparing architectural approaches
- producing a plan another worker will execute

### Use `general-purpose`

For:
- small implementation tasks
- research plus code change in one pass
- self-contained work that does not need a specialized reviewer

### Use specialized review agents

For:
- security
- performance
- framework-specific review
- deployment or migration checks

## Coordination Rule

Use agent types to enforce separation of concerns:
- explorers gather facts
- planners structure work
- implementers change code
- reviewers critique the result

If one agent is trying to do all four, the task is probably underspecified.
