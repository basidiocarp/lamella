<overview>
Files are often the simplest shared interface for agent-native systems. They are
inspectable, portable, and easy for both agents and users to reason about.
</overview>

<why_files>
## Why Files Work Well

- agents already understand read, write, move, and search operations
- users can inspect and edit the state directly
- directory structure doubles as information architecture
- export and backup are straightforward
</why_files>

<file_organization>
## File Organization Patterns

Prefer entity- or task-scoped directories over actor- or file-type sprawl.

Typical split:
- human-readable content in markdown or text
- structured machine state in JSON
- ephemeral logs or checkpoints separated from durable user content

Keep naming predictable and boring. Files should explain themselves.
</file_organization>

<context_md_pattern>
## The `context.md` Pattern

Use a context file when the agent needs a durable, editable summary of:
- identity or role
- current state
- user preferences
- recent activity
- guidelines learned over time

Treat it as persistent working context, not as a dumping ground.
</context_md_pattern>

<files_vs_database>
## Files vs Database

Use files when transparency and legibility matter. Use databases when query
shape, indexing, or scale dominate.

A hybrid model is often best:
- files for the agent-facing source of truth
- database or index for fast UI queries
</files_vs_database>

<conflict_model>
## Conflict Model

If users and agents both edit the same files, define the write strategy up
front:
- last-write-wins for low-risk ephemeral files
- explicit reread-before-write for user-edited content
- separate agent and user spaces when conflict risk is high

The key rule is to make the conflict model explicit. Silent assumptions cause
data loss.
</conflict_model>
