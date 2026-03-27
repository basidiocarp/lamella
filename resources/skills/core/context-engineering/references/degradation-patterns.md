# Context Degradation Patterns

Long context does not fail all at once. It degrades in recognizable ways. Use
these patterns to diagnose when a prompt, chain, or session has become too large
or too noisy.

## Lost in the Middle

Information buried in the middle of a long context is easier to miss than
information near the start or end.

Mitigations:
- place critical constraints near the edges
- use summaries that restate the most important facts
- structure long context with clear section markers

## Context Poisoning

Bad information enters context and keeps getting reused as if it were true.

Common sources:
- incorrect tool output
- flawed summaries
- unverified agent-generated claims

Recovery usually requires removing or replacing the poisoned context, not merely
arguing against it inside the same chain.

## Context Distraction

Too much irrelevant material competes with the useful material for attention.

Mitigations:
- retrieve less
- filter harder
- keep unrelated documents out of the active window

## Context Confusion

Multiple tasks, tool schemas, or objectives bleed together.

Symptoms:
- wrong tool choice
- output aimed at a previous task
- mixed constraints from unrelated work

Mitigations:
- isolate tasks
- use cleaner session boundaries
- keep one objective per active context

## Context Clash

Contradictory sources appear together and the model cannot resolve them cleanly.

Mitigations:
- mark conflicts explicitly
- define source precedence
- remove outdated or low-priority versions

## Practical Controls

Four good defaults:
- write: move durable context out of the live window
- select: load only the relevant subset
- compress: summarize without losing the decision-relevant facts
- isolate: split work across agents or sessions

## Early Warning Signs

- instructions start getting missed
- outputs become less grounded
- tool use drifts
- hallucinations rise after long sessions

When those signs show up, the fix is usually context reduction or isolation, not
more instructions piled onto the same prompt.
