# Spawn Backends Reference

Use this page to choose the teammate runtime backend. The backend-specific details now live in focused refs instead of one large mixed guide.

## Backend Comparison

| Backend | Visibility | Persistence | Best For |
|---------|------------|-------------|----------|
| `in-process` | Hidden | Ends with leader | Fast local or CI work |
| `tmux` | Visible in panes/session | Can outlive leader | Long-running visible work |
| `iterm2` | Visible side-by-side | Ends with window | macOS interactive sessions |

## Reference Map

| Need | Load |
|------|------|
| Same-process execution model | [in-process-backend.md](in-process-backend.md) |
| tmux-backed workers and pane/session behavior | [tmux-backend.md](tmux-backend.md) |
| iTerm2-backed workers on macOS | [iterm2-backend.md](iterm2-backend.md) |

## Auto-Detection Summary

1. If already inside `tmux`, prefer `tmux`.
2. Otherwise, if running in iTerm2 and its CLI is available, prefer `iterm2`.
3. Otherwise, use `in-process` unless the environment requires visible external workers.

## Practical Rule

- Choose `in-process` for speed.
- Choose `tmux` for durable, inspectable workers.
- Choose `iterm2` only when visible pane-based macOS work is the actual goal.
