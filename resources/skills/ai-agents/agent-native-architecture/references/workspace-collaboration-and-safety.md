# Workspace Collaboration and Safety

Shared workspace design only works if both parties can collaborate without
clobbering each other.

## Collaboration Rules

- Read before update. Assume the user may have changed the file.
- Prefer append or targeted edits over full rewrites when files are shared.
- Ask before destructive changes unless the request already made deletion
  explicit.

## Safe Workspace Scoping

```text
workspace_root/
  relative path only
  no absolute filesystem reads
  no path traversal above root
```

## Good Prompts

Tell the agent:

- where the shared workspace lives
- which directories hold durable product data
- which areas are generated and safe to rewrite
- which areas need explicit user approval

## Anti-Patterns

- unrestricted `read_file` on the whole machine
- hidden agent-only caches that duplicate user-visible state
- full-file overwrites for content the user frequently edits
