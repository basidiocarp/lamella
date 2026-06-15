# Sub-Agent Negotiation Protocol

Use negotiation when a sub-agent response is likely to be partial, ambiguous, or
dependent on missing context.

## Core Rule

A negotiation response is not a final answer. It is a structured intermediate
result the orchestrator evaluates against the original intent.

## When to Negotiate

Good fits:
- comparative questions
- cross-domain questions
- ambiguous scope
- synthesis tasks
- multi-source research

Skip negotiation for:
- simple factual lookups
- direct definitions
- single-source questions with obvious answers

## Response Shape

When negotiation is enabled, the response should include:
- findings
- gaps or missing context
- confidence level
- any follow-up question that would materially improve the answer

The point is to surface what is still missing before synthesis hardens the
result.

## Confidence Levels

- high: enough evidence to proceed
- medium: usable, but some gaps remain
- low: likely needs another round
- uncertain: conflicting or unreliable evidence

Confidence should drive the next action, not just label the output.

## Orchestrator Responsibilities

- preserve original user intent
- accumulate confirmed facts across rounds
- assess whether the remaining gaps block an answer
- decide whether to refine, re-route, or synthesize

## Agent Responsibilities

- do not inflate confidence
- identify blockers clearly
- ask only the context questions that materially change answer quality
- keep the structure consistent across rounds

## Escalation Rule

If repeated negotiation still produces low-confidence output, stop pretending the
system has enough context. Re-route, narrow the scope, or disclose the gap.
