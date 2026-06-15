<overview>
Self-modification is an advanced agent-native pattern: the agent can evolve its own code, prompts, or behavior. It is powerful, but it should be added only when the system truly benefits from adaptation.
</overview>

<why_self_modification>
## Why Self-Modification?

Self-modifying agents can:
- fix their own bugs
- add new capabilities
- refine prompts from feedback
- deploy updated behavior

The trade-off is governance: once an agent can change itself, approval, rollback, and verification become mandatory.
</why_self_modification>

<capabilities>
## What Self-Modification Enables

**Code modification**
- read and understand source files
- write fixes or new features
- commit changes
- run verification before rollout

**Prompt evolution**
- refine the system prompt
- add new sections based on repeated feedback
- tighten evaluation criteria

**Infrastructure control**
- pull updates
- merge from trusted branches
- restart after changes
- roll back on failure
</capabilities>

<guardrails>
## Required Guardrails

**Approval gate for code changes**
```typescript
tool("write_file", async ({ path, content }) => {
  if (isCodeFile(path)) {
    pendingChanges.set(path, content);
    return { text: "Code changes require approval before apply." };
  }
  writeFileSync(path, content);
  return { text: `Wrote ${path}` };
});
```

**Auto-save state before self-update**
```typescript
tool("self_deploy", async () => {
  runGit("stash");
  runGit("fetch origin");
  runGit("merge origin/main --no-edit");
  runCommand("npm run build");
  scheduleRestart();
});
```

**Build verification before restart**
```typescript
try {
  runCommand("npm run build", { timeout: 120000 });
} catch {
  runGit("merge --abort");
  return { text: "Build failed, aborting deploy", isError: true };
}
```
</guardrails>

<when_to_use>
## When to Implement Self-Modification

**Good candidates**
- long-running autonomous agents
- agents that repeatedly adapt to feedback
- internal systems with strong verification loops

**Poor candidates**
- simple task-specific agents
- heavily regulated environments
- systems that require strict static review

Start with a non-self-modifying agent. Add self-modification only when the operational value is clear.
</when_to_use>
