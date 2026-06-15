---
name: cost-aware-llm-pipeline
description: "Optimizes LLM API usage with routing, budgets, retries, and caching."
origin: lamella
---

# Cost-Aware LLM Pipeline

Use this skill when an LLM workflow needs explicit cost controls without collapsing quality. The main pattern is to combine routing, budget enforcement, narrow retries, and prompt caching in one composable pipeline.

## When to Use

- Batch or background processing where small inefficiencies add up
- Multi-model systems with clear cheap-versus-expensive trade-offs
- Production systems that need per-request or per-batch budget guardrails
- Prompt-heavy applications that resend the same long system context

## Core Components

| Component | Purpose |
|----------|---------|
| Model routing | send simple work to cheaper models |
| Cost tracking | accumulate spend and stop on budget breach |
| Narrow retries | retry only transient failures |
| Prompt caching | avoid repaying for repeated long prompts |

## Core Workflow

1. Estimate complexity and route to the cheapest acceptable model.
2. Check budget before the call, not only after it.
3. Retry only rate limits, transport failures, or transient server errors.
4. Cache long stable prompts or other reusable context.
5. Log routing and spend so thresholds can be tuned with real data.

## Minimal Example

```python
def process(prompt: str, tracker: CostTracker) -> tuple[str, CostTracker]:
    model = select_model(text_length=len(prompt), item_count=1)
    if tracker.over_budget:
        raise RuntimeError("budget exceeded")

    response = call_with_retry(model=model, prompt=prompt)
    tracker = tracker.add(cost_from_response(model, response))
    return response.output_text, tracker
```

## Guardrails

- Default to the cheaper model and escalate only on evidence.
- Keep model names and prices configurable.
- Treat retries and caching as cost features, not just reliability features.
