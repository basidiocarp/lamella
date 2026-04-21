---
name: stress-test-design
description: "Stress-tests a plan or design through sequential challenge questions and recommended answers."
origin: lamella
---

# Stress Test Design

Interrogate a plan until the unresolved branches are visible.

## Scope

Use this skill for a sequential interview format.

For structured adversarial modes, use `devils-advocate`.
For broad idea exploration before narrowing, use `brainstorming`.

## When to Use

- A design sounds plausible but still feels under-specified
- The user explicitly wants to be grilled
- A plan has hidden dependencies or branching decisions
- The team needs stronger confidence before implementation

## Workflow

1. **Restate the plan**: Summarize the proposal in one tight paragraph and confirm the target.
2. **Find the open branches**: Identify decisions that depend on assumptions, sequencing, ownership, or constraints.
3. **Question one branch at a time**: Ask one sharp question, then provide the answer you would recommend.
4. **Resolve or escalate**: Either lock the branch down or mark it as an explicit open question.
5. **Repeat until stable**: Continue until the plan can be executed without hidden forks.
6. **Summarize the state**: List confirmed decisions, unresolved risks, and the next decision the user should make.

## Question Rules

- Prefer specific questions over broad prompts.
- Ask about failure modes, ownership, sequencing, and migration costs.
- Stop when questions stop changing the decision surface.
- Do not ask five questions at once.

## Output Format

- **Plan under review**
- **Resolved decisions**
- **Open branches**
- **Recommended next answers**
- **Confidence note**
