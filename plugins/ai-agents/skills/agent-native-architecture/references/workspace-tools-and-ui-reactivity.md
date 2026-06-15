# Workspace Tools and UI Reactivity

The agent should use the same storage surface the UI reads from.

## Required Primitives

- `read_file`
- `write_file`
- `list_files`
- `move_file` or `rename_file`
- `delete_file` when the user can delete through the UI

Those tools should operate relative to the workspace root.

## Reactivity Patterns

Choose one of these patterns and use it consistently:

1. File watching: UI reacts when files change on disk.
2. Shared service: agent tools and UI call the same data service.
3. Files plus index: files hold content, a database or index accelerates
   discovery.

## Rule of Thumb

If the UI cannot reflect an agent write without a refresh workaround, the
workspace integration is incomplete.
