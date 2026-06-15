# Hallucination Detection Workflow

Use this workflow before agent output becomes trusted context for later steps.

## When to Use

- the output contains factual claims
- another agent will consume the output next
- the artifact will guide implementation, review, or documentation

## Workflow

### 1. Extract Claims

Pull out factual or evidence-bearing claims from the output. Keep them atomic
enough to verify one by one.

### 2. Verify Claims

For each claim, classify it as:
- verified
- false
- unverifiable with current evidence

Use code, docs, tool outputs, or explicit sources. Do not rely on the original
model’s confidence.

### 3. Assess Poisoning Risk

Risk rises when:
- false claims are numerous
- unverifiable claims dominate
- the output is about to feed another agent or workflow stage

### 4. Decide the Next Step

- low risk: proceed
- medium risk: review flagged claims manually
- high risk: regenerate the output with stricter grounding requirements

## Regeneration Rule

If you regenerate, instruct the agent to:
- verify claims before stating them
- admit uncertainty instead of asserting
- cite the supporting source or file location where possible

## Why It Matters

Hallucinations become much more expensive once they enter shared context. The
right time to catch them is before downstream agents treat them as facts.
