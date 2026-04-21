---
name: iterative-retrieval
description: "Refines context retrieval iteratively to solve the subagent context problem."
origin: lamella
---

# Iterative Retrieval Pattern

Use this skill when a subagent cannot know the right context on the first pass.

## When to Use

- the initial context guess is likely incomplete
- the codebase uses terminology or structure you do not fully know yet
- sending all candidate files would waste tokens or exceed context limits

## Four-Step Loop

1. `DISPATCH` — start with a broad but bounded retrieval query
2. `EVALUATE` — score what came back and identify gaps
3. `REFINE` — add or remove terms and patterns based on what you learned
4. `LOOP` — repeat until the context is good enough

## Core Rules

- start broad, then narrow
- track missing context explicitly
- stop once a small high-relevance set is sufficient
- prefer three strong files over ten weak ones

## Output Contract

Return:
- selected files
- why they are relevant
- what context remains missing, if anything
