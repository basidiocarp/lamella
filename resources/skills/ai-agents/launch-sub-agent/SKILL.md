---
name: launch-sub-agent
description: "Launches an intelligent sub-agent with automatic model selection, specialized agent matching, and self-critique verification."
argument-hint: "Task description (e.g., \"Implement user authentication\" or \"Research caching strategies\") [--model opus|sonnet|haiku] [--agent <agent-name>] [--output <path>]"
origin: lamella
---
# launch-sub-agent


## Contents

- [Process](#process)
  - [Phase 1: Task Analysis with Zero-shot CoT](#phase-1-task-analysis-with-zero-shot-cot)
  - [Phase 2: Model Selection](#phase-2-model-selection)
  - [Phase 3: Specialized Agent Matching](#phase-3-specialized-agent-matching)
  - [Phase 4: Construct Sub-Agent Prompt](#phase-4-construct-sub-agent-prompt)
- [Reasoning Approach](#reasoning-approach)
- [Self-Critique Loop (MANDATORY)](#self-critique-loop-mandatory)
  - [1. Generate 5 Verification Questions](#1-generate-5-verification-questions)
  - [2. Answer Each Question with Evidence](#2-answer-each-question-with-evidence)
  - [3. Revise If Needed](#3-revise-if-needed)
  - [Phase 5: Dispatch Sub-Agent](#phase-5-dispatch-sub-agent)
- [Examples](#examples)
  - [Example 1: Complex Architecture Task (Opus)](#example-1-complex-architecture-task-opus)
  - [Example 2: Simple Documentation Update (Haiku)](#example-2-simple-documentation-update-haiku)
  - [Example 3: Moderate Implementation (Sonnet + Developer)](#example-3-moderate-implementation-sonnet-developer)
  - [Example 4: Research Task (Opus + Researcher)](#example-4-research-task-opus-researcher)
- [Best Practices](#best-practices)
  - [Context Isolation](#context-isolation)
  - [Model Selection](#model-selection)
  - [Specialized Agents](#specialized-agents)
  - [Quality Gates](#quality-gates)


<task>
Launch a focused sub-agent to execute the provided task. Analyze the task to intelligently select the optimal model and agent configuration, then dispatch a sub-agent with Zero-shot Chain-of-Thought reasoning at the beginning and mandatory self-critique verification at the end.
</task>

<context>
This command implements the **Supervisor/Orchestrator pattern** from multi-agent architectures where you (the orchestrator) dispatch focused sub-agents with isolated context. The primary benefit is **context isolation** - each sub-agent operates in a clean context window focused on its specific task without accumulated context pollution.
</context>

## Process

### Phase 1: Task Analysis with Zero-shot CoT

Before dispatching, analyze the task systematically. Think through step by step:

```
Let me analyze this task step by step to determine the optimal configuration:

1. **Task Type Identification**
   "What type of work is being requested?"
   - Code implementation / feature development
   - Bug fixing / debugging
   - Testing / verification
   - Documentation: document, README, guide, explain, tutorial
   - Architecture: design, system, structure, scalability
   - Research / comparison / recommendation
   - Exploration / pattern discovery

2. **Complexity Assessment**
   - Is the task novel, risky, or ambiguous?
   - Does it require tradeoff analysis or architecture judgment?
   - Does it affect multiple files, services, or user-facing behavior?

3. **Output Expectations**
   - Is the deliverable code, prose, plan, or analysis?
   - Is there a required file path, structure, or response format?
   - Does the user need a concise answer or a detailed artifact?

4. **Context Requirements**
   - Which files or references are essential?
   - What can be summarized instead of pasted?
   - What should stay out to preserve context isolation?

5. **Risk Check**
   - Could this affect production behavior, security, data, or releases?
   - If yes, bias toward stronger models and stricter verification.
   - Documentation: document, README, guide, explain, tutorial
   - Architecture: design, system, structure, scalability
   - Exploration: understand, navigate, find, codebase patterns
```

### Phase 2: Model Selection

Select the optimal model based on task analysis:

| Task Profile | Recommended Model | Rationale |
|--------------|-------------------|-----------|
| **Complex reasoning** (architecture, design, critical decisions) | `opus` | Maximum reasoning capability |
| **Specialized domain** (matches agent profile) | Opus + Specialized Agent | Domain expertise + reasoning power |
| **Non-complex but long** (extensive docs, verbose output) | `sonnet[1m]` | Good capability, cost-efficient for length |
| **Simple and short** (trivial tasks, quick lookups) | `haiku` | Fast, cost-effective for easy tasks |
| **Default** (when uncertain) | `opus` | Optimize for quality over cost |

**Decision Tree:**

```
Is task COMPLEX (architecture, design, novel problem, critical decision)?
|
+-- YES --> Use Opus (highest capability)
|           |
|           +-- Does it match a specialized domain?
|                 |
|                 +-- YES --> Use Opus + specialized agent
|                 |
|                 +-- NO --> Use Opus only
|
+-- NO --> Is task simple and short?
            |
            +-- YES --> Use Haiku
            |
            +-- NO --> Does it match a specialized domain?
                      +-- YES --> Use Sonnet (balanced)
                      |
                      +-- NO --> Use Opus (default)
```

### Phase 3: Specialized Agent Matching

If the task matches a specialized domain, incorporate the relevant agent prompt. Specialized agents provide domain-specific best practices, quality standards, and structured approaches that improve output quality.

**Decision:** Use specialized agent when task clearly benefits from domain expertise. Skip for trivial tasks where specialization adds unnecessary overhead.

**Agents:** Available specialized agents depends on project and plugins installed. Common agents from the `sdd` plugin include: `sdd:developer`, `sdd:researcher`, `sdd:software-architect`, `sdd:tech-lead`, `sdd:team-lead`, `sdd:qa-engineer`, `sdd:code-explorer`, `sdd:business-analyst`. If the appropriate specialized agent is not available, fallback to a general agent without specialization.

**Integration with Model Selection:**

- Specialized agents are combined WITH model selection, not instead of
- Complex task + specialized domain = Opus + Specialized Agent
- Simple task matching domain = Haiku without specialization (overhead not justified)

**Usage:**

1. Read the agent definition
2. Include the agent's instructions in the sub-agent prompt AFTER the CoT prefix
3. Combine with Zero-shot CoT prefix and Critique suffix

### Phase 4: Construct Sub-Agent Prompt

Build the sub-agent prompt with these mandatory components:

#### 4.1 Zero-shot Chain-of-Thought Prefix (REQUIRED - MUST BE FIRST)

```markdown
## Reasoning Approach

Before taking any action, think through the problem systematically.

Let's approach this step by step:
1. Clarify the task objective and the exact deliverable.
2. Identify the files, systems, or documents that matter.
3. Check for constraints, risks, and validation requirements.
4. Decide whether a specialized agent will materially improve quality.
5. Choose the lightest model that still fits the task's risk and complexity.
6. Pass only the minimum context needed for the task.
7. Define success before acting:
   - What must change?
   - What evidence will prove it worked?
   - What should the final output contain?
8. Sanity check:
   - Am I solving the user's actual request?
   - Am I preserving context isolation?
   - Am I following existing patterns?

Work through each step explicitly before implementing.
```

#### 4.2 Task Body

```markdown
<task>
{Task description from $ARGUMENTS}
</task>

<context>
{Essential files, summaries, constraints, and known risks only}
</context>

<output>
{Expected deliverable: format, location, structure}
</output>
```

#### 4.3 Self-Critique Suffix (REQUIRED - MUST BE LAST)

```markdown
## Self-Critique Loop (MANDATORY)

Before completing, verify your work. Submitting unverified work is UNACCEPTABLE.

### 1. Generate 5 Verification Questions
Create five task-specific questions that test correctness, completeness, and risk.
Cover:
1. Did I solve the requested task rather than a nearby one?
2. Did I use the right files, patterns, and constraints?
3. Is the output technically correct and internally consistent?
4. What could still fail in integration, testing, or handoff?
5. Does the final response include the evidence the orchestrator needs?

### 2. Answer Each Question with Evidence

For each question:
- Answer `Yes`, `No`, or `Partially`
- Cite concrete evidence: file paths, commands run, outputs observed, or reasoning
- Treat weak evidence as a failure, not a pass

### 3. Revise If Needed

If any answer is `No` or `Partially`:
- Fix the issue
- Re-run the relevant checks
- Update the output before completing

### 4. Final Submission Checklist

- **VERIFY** - The task is complete and aligned with the brief
- **CITE** - Include files, commands, or evidence that matter
- **FLAG** - Note any remaining uncertainty or follow-up work
- **DOCUMENT** - Note what was changed and why

CRITICAL: Do not submit until ALL verification questions have satisfactory answers with evidence.
```

### Phase 5: Dispatch Sub-Agent

Use the Task tool to dispatch with the selected configuration:

```
Use Task tool:
- description: "Sub-agent: {brief task summary}"
- prompt: {constructed prompt with CoT prefix + task + critique suffix}
- model: {selected model - opus/sonnet/haiku}
```

**Context isolation reminder:** Pass only context relevant to this specific task. Do not pass entire conversation history.

## Examples

### Example 1: Complex Architecture Task (Opus)

**Input:** `/launch-sub-agent Design a caching strategy for our API that handles 10k requests/second`

**Analysis:**

- Task type: Architecture / design
- Complexity: High (performance requirements, system design)
- Output size: Medium (design document)
- Domain match: sdd:software-architect

**Selection:** Opus + sdd:software-architect agent

**Dispatch:** Task tool with Opus model, sdd:software-architect prompt, CoT prefix, critique suffix

---

### Example 2: Simple Documentation Update (Haiku)

**Input:** `/launch-sub-agent Update the README to add --verbose flag to CLI options`

**Analysis:**

- Task type: Documentation (simple edit)
- Complexity: Low (single file, well-defined)
- Output size: Small (one section)
- Domain match: None needed (too simple)

**Selection:** Haiku (fast, cheap, sufficient for task)

**Dispatch:** Task tool with Haiku model, basic CoT prefix, basic critique suffix

---

### Example 3: Moderate Implementation (Sonnet + Developer)

**Input:** `/launch-sub-agent Implement pagination for /users endpoint following patterns in /products`

**Analysis:**

- Task type: Code implementation
- Complexity: Medium (follow existing patterns)
- Output size: Medium (implementation + tests)
- Domain match: sdd:developer

**Selection:** Sonnet + sdd:developer agent (non-complex but needs domain expertise)

**Dispatch:** Task tool with Sonnet model, sdd:developer prompt, CoT prefix, critique suffix

---

### Example 4: Research Task (Opus + Researcher)

**Input:** `/launch-sub-agent Research authentication options for mobile app - evaluate OAuth2, SAML, passwordless`

**Analysis:**

- Task type: Research / comparison
- Complexity: High (comparative analysis, recommendations)
- Output size: Large (comprehensive research)
- Domain match: sdd:researcher

**Selection:** Opus + sdd:researcher agent

**Dispatch:** Task tool with Opus model, sdd:researcher prompt, CoT prefix, critique suffix

## Best Practices

### Context Isolation

- Pass only context relevant to the specific task
- Avoid passing entire conversation history
- Let sub-agent discover codebase patterns through tools
- Use file paths and references rather than embedding large content

### Model Selection

- When in doubt, use Opus (quality over cost)
- Use Haiku only for truly trivial tasks
- Use Sonnet for "grunt work" - needs capability but not genius
- Production code always deserves Opus

### Specialized Agents

- Use when domain expertise clearly improves quality
- Combine with CoT and critique patterns
- Don't force specialization on general tasks

### Quality Gates

- Self-critique loop is non-negotiable
- Sub-agents must answer verification questions before completing
- Review sub-agent output before accepting

## Batch Parallel Dispatch

When applying the same operation across multiple files or targets, launch all sub-agents simultaneously rather than sequentially.

### Independence Checks (Required Before Parallel Dispatch)

- [ ] No target reads output from another target
- [ ] No target modifies files another target reads
- [ ] Order of completion doesn't matter
- [ ] No shared mutable state

If ANY check fails: use sequential execution instead.

### Dispatch Pattern

Launch ALL agents in a single response. Each gets the same task template with different target:

```markdown
[Task 1] description: "Parallel: {task} for {target1}"
[Task 2] description: "Parallel: {task} for {target2}"
...
```

### Model Selection for Batch

| Task Profile | Model | Rationale |
|--------------|-------|-----------|
| Complex (architecture, security) | opus | Maximum reasoning |
| Medium complexity, large output | sonnet | Balanced |
| Simple transformations | haiku | Fast, sufficient |

### Result Summary

```markdown
| Target | Model | Status | Summary |
|--------|-------|--------|---------|
| target1 | sonnet | SUCCESS | brief outcome |
| target2 | sonnet | FAILED | error detail |
```

**Limits:** 10-15 targets max per batch. Run tests after — parallel changes may have subtle interactions.

See [references/parallel/](references/parallel/) for task analysis, prompt construction, and examples.

## Reference Files


| File | Path |
|------|------|
| [Examples](references/parallel/examples.md) | `references/parallel/examples.md` |
| [Model Selection](references/parallel/model-selection.md) | `references/parallel/model-selection.md` |
| [Prompt Construction](references/parallel/prompt-construction.md) | `references/parallel/prompt-construction.md` |
| [Task Analysis](references/parallel/task-analysis.md) | `references/parallel/task-analysis.md` |
