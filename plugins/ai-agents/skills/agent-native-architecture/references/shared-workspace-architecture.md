# Shared Workspace Architecture

Use this page as the routing layer for workspace design in agent-native apps.

## Load Order

| Need | Reference |
| --- | --- |
| directory layout, naming, and metadata conventions | `workspace-layout-and-metadata.md` |
| file primitives, shared services, and UI reactivity | `workspace-tools-and-ui-reactivity.md` |
| collaboration flow, overwrite discipline, and workspace scoping | `workspace-collaboration-and-safety.md` |

## Core Rules

- The agent and user should work in the same data space whenever possible.
- Organize by domain object or workflow, not by actor.
- Let the UI observe the same files or services the agent updates.
- Treat overwrite safety as a first-class concern.
- Scope file access to the app workspace; do not expose the whole filesystem.

## Architecture Smells

- separate `user_space` and `agent_space` folders with a sync layer between
  them
- agent writes that the UI only sees after manual refresh or polling hacks
- path handling that allows escaping the workspace root
- content ownership rules that prevent the agent from building on user edits

If one of those smells is present, load the focused reference that matches the
design gap before you proceed.
