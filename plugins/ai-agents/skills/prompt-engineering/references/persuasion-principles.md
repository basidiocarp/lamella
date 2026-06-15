# Persuasion Principles for Agent Communication

## Overview

LLMs respond to the same persuasion principles as humans. Understanding this helps design more effective skills.

**Research foundation:** Meincke et al. (2025) tested 7 persuasion principles with N=28,000 AI conversations. Persuasion techniques more than doubled compliance rates (33% → 72%, p < .001).

## The Seven Principles

### 1. Authority

**What it is:** Deference to expertise, credentials, or official sources.

**How it works in prompts:**

- Imperative language: "YOU MUST", "Never", "Always"
- Non-negotiable framing: "No exceptions"
- Eliminates decision fatigue and rationalization

**Example:**

```
✅ Write code before test? Delete it. Start over. No exceptions.
❌ Consider writing tests first when feasible.
```

### 2. Commitment

**What it is:** Consistency with prior actions or statements.

**How it works:**

- Require announcements: "Announce skill usage"
- Force explicit choices: "Choose A, B, or C"
- Use tracking: TodoWrite for checklists

**Example:**

```
✅ When you find a skill, announce: "I'm using [Skill Name]"
❌ Consider letting your partner know which skill you're using.
```

### 3. Scarcity

**What it is:** Urgency from time limits or limited availability.

**How it works:**

- Time-bound requirements: "Before proceeding"
- Sequential dependencies: "Immediately after X"

**Example:**

```
✅ After completing a task, IMMEDIATELY request code review before proceeding.
❌ Review code when convenient.
```

### 4. Social Proof

**What it is:** Conformity to what others do or what's normal.

**How it works:**

- Universal patterns: "Every time", "Always"
- Failure modes: "X without Y = failure"

**Example:**

```
✅ Checklists without TodoWrite tracking = steps get skipped. Every time.
❌ Some people find TodoWrite helpful for checklists.
```

### 5. Unity

**What it is:** Shared identity, "we-ness", in-group belonging.

**How it works:**

- Collaborative language: "our codebase", "we're colleagues"
- Shared goals: "we both want quality"

**Example:**

```
✅ We're colleagues working together. I need your honest technical judgment.
❌ Probably tell me if I'm wrong.
```

### 6. Reciprocity

**What it is:** Obligation to return benefits received.

**When to use:** Rarely needed - other principles more effective.

### 7. Liking

**What it is:** Preference for cooperating with those we like.

**When to avoid:** Always for discipline enforcement - creates sycophancy.

## Principle Combinations by Prompt Type

| Prompt Type | Use | Avoid |
|------------|-----|-------|
| Discipline-enforcing | Authority + Commitment + Social Proof | Liking, Reciprocity |
| Guidance/technique | Moderate Authority + Unity | Heavy authority |
| Collaborative | Unity + Commitment | Authority, Liking |
| Reference | Clarity only | All persuasion |

## Why This Works

**Bright-line rules reduce rationalization:**

- "YOU MUST" removes decision fatigue
- Absolute language eliminates "is this an exception?" questions

**Implementation intentions create automatic behavior:**

- Clear triggers + required actions = automatic execution
- "When X, do Y" more effective than "generally do Y"

## Ethical Use

**Legitimate:**

- Ensuring critical practices are followed
- Creating effective documentation
- Preventing predictable failures

**The test:** Would this technique serve the user's genuine interests if they fully understood it?

## Quick Reference

When designing a prompt, ask:

1. **What type is it?** (Discipline vs. guidance vs. reference)
2. **What behavior am I trying to change?**
3. **Which principle(s) apply?**
4. **Am I combining too many?**
5. **Is this ethical?**
