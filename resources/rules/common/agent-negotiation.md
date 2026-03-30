# Agent Negotiation

Treat sub-agent output as input to evaluate, not authority to repeat.

## Use Negotiation When

- the task needs comparison, synthesis, or cross-domain judgment
- the first answer only partially addresses the user request
- multiple agents or sources disagree

Skip it for simple factual lookups or narrow single-step tasks.

## Acceptance Rules

- accept only answers that address the actual user question
- distinguish blocking gaps from acceptable omissions
- rerun with tighter scope before broadening the search
- if three rounds still fail, synthesize the confirmed parts and state the gaps plainly

## Confidence Handling

- `high`: complete enough to use directly
- `medium`: usable with explicit caveats
- `low` or `uncertain`: refine, reroute, or disclose limits instead of over-claiming
