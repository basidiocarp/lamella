# tmux Backend

Use this backend when you want visible, durable workers.

## Characteristics

- Separate worker processes in tmux panes or sessions
- Easy to inspect or reattach
- More startup overhead than `in-process`
- Good default for long-running interactive work

## Useful Commands

```bash
tmux list-panes
tmux attach -t claude-swarm
tmux select-layout tiled
```
